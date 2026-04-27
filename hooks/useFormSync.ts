import { useEffect, useReducer, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { FormField } from '@/types'

interface FormSyncState {
  fields: FormField[]
  isConnected: boolean
}

type FormSyncAction =
  | { type: 'INSERT'; payload: FormField }
  | { type: 'UPDATE'; payload: FormField }
  | { type: 'DELETE'; payload: { id: string } }
  | { type: 'SET_CONNECTED'; payload: boolean }
  | { type: 'SET_FIELDS'; payload: FormField[] }

function formSyncReducer(state: FormSyncState, action: FormSyncAction): FormSyncState {
  switch (action.type) {
    case 'INSERT':
      return {
        ...state,
        fields: [...state.fields, action.payload].sort((a, b) => a.order - b.order),
      }
    case 'UPDATE':
      return {
        ...state,
        fields: state.fields
          .map(f => (f.id === action.payload.id ? action.payload : f))
          .sort((a, b) => a.order - b.order),
      }
    case 'DELETE':
      return {
        ...state,
        fields: state.fields.filter(f => f.id !== action.payload.id),
      }
    case 'SET_CONNECTED':
      return {
        ...state,
        isConnected: action.payload,
      }
    case 'SET_FIELDS':
      return {
        ...state,
        fields: action.payload,
      }
    default:
      return state
  }
}

export function useFormSync(formId: string) {
  const [state, dispatch] = useReducer(formSyncReducer, {
    fields: [],
    isConnected: false,
  })

  useEffect(() => {
    dispatch({ type: 'SET_CONNECTED', payload: false })

    const channel = supabase.channel(`form-fields-${formId}`)

    channel
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'Field', filter: `formId=eq.${formId}` },
        payload => {
          const field: FormField = {
            id: payload.new.id,
            type: payload.new.type,
            label: payload.new.label,
            placeholder: payload.new.placeholder,
            required: payload.new.required,
            order: payload.new.order,
            options: payload.new.options || [],
          }
          dispatch({ type: 'INSERT', payload: field })
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'Field', filter: `formId=eq.${formId}` },
        payload => {
          const field: FormField = {
            id: payload.new.id,
            type: payload.new.type,
            label: payload.new.label,
            placeholder: payload.new.placeholder,
            required: payload.new.required,
            order: payload.new.order,
            options: payload.new.options || [],
          }
          dispatch({ type: 'UPDATE', payload: field })
        }
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'Field', filter: `formId=eq.${formId}` },
        payload => {
          dispatch({ type: 'DELETE', payload: { id: payload.old.id } })
        }
      )
      .subscribe(status => {
        dispatch({ type: 'SET_CONNECTED', payload: status === 'SUBSCRIBED' })
      })

    return () => {
      channel.unsubscribe()
    }
  }, [formId])

  return state
}
