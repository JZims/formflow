import { useReducer, useCallback } from 'react'

interface OptimisticState<T> {
  items: T[]
  lastConfirmedItems: T[]
}

type OptimisticAction<T> =
  | { type: 'ADD'; payload: T }
  | { type: 'UPDATE'; payload: T }
  | { type: 'REMOVE'; payload: string }
  | { type: 'REVERT' }
  | { type: 'CONFIRM'; payload: T[] }

function optimisticReducer<T>(
  state: OptimisticState<T>,
  action: OptimisticAction<T>,
  keyFn: (item: T) => string
): OptimisticState<T> {
  switch (action.type) {
    case 'ADD':
      return {
        ...state,
        items: [...state.items, action.payload],
      }
    case 'UPDATE': {
      const key = keyFn(action.payload)
      return {
        ...state,
        items: state.items.map(item => (keyFn(item) === key ? action.payload : item)),
      }
    }
    case 'REMOVE': {
      return {
        ...state,
        items: state.items.filter(item => keyFn(item) !== action.payload),
      }
    }
    case 'CONFIRM':
      return {
        ...state,
        items: action.payload,
        lastConfirmedItems: action.payload,
      }
    case 'REVERT':
      return {
        ...state,
        items: state.lastConfirmedItems,
      }
    default:
      return state
  }
}

export function useOptimistic<T>(initialItems: T[], keyFn: (item: T) => string) {
  const reducer = useCallback(
    (currentState: OptimisticState<T>, action: OptimisticAction<T>): OptimisticState<T> =>
      optimisticReducer(currentState, action, keyFn),
    [keyFn]
  )

  const [state, dispatch] = useReducer(
    reducer,
    {
      items: initialItems,
      lastConfirmedItems: initialItems,
    }
  )

  const addOptimistic = useCallback((item: T) => {
    dispatch({ type: 'ADD', payload: item })
  }, [])

  const updateOptimistic = useCallback((item: T) => {
    dispatch({ type: 'UPDATE', payload: item })
  }, [])

  const removeOptimistic = useCallback((key: string) => {
    dispatch({ type: 'REMOVE', payload: key })
  }, [])

  const confirm = useCallback((items: T[]) => {
    dispatch({ type: 'CONFIRM', payload: items })
  }, [])

  const revert = useCallback(() => {
    dispatch({ type: 'REVERT' })
  }, [])

  return {
    items: state.items,
    addOptimistic,
    updateOptimistic,
    removeOptimistic,
    confirm,
    revert,
  }
}
