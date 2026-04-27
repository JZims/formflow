'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { FormSchema, FormField } from '@/types'
import { FieldList } from '@/components/builder/FieldList'
import { FieldEditor } from '@/components/builder/FieldEditor'
import { AddFieldMenu } from '@/components/builder/AddFieldMenu'
import { Button } from '@/components/ui/Button'
import { PresenceAvatars } from '@/components/presence/PresenceAvatars'
import { useFormSync } from '@/hooks/useFormSync'

export default function FormEditPage() {
  const params = useParams()
  const formId = params.formId as string
  const [schema, setSchema] = useState<FormSchema | null>(null)
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const { fields: syncedFields, isConnected } = useFormSync(formId)

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const response = await fetch(`/api/forms/${formId}`)
        if (!response.ok) throw new Error('Form not found')
        const data = await response.json()
        setSchema(data.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load form')
      } finally {
        setIsLoading(false)
      }
    }

    fetchForm()
  }, [formId])

  const handleReorder = async (fields: FormField[]) => {
    if (!schema) return

    try {
      // Optimistically update UI
      setSchema(prev => prev ? { ...prev, fields } : null)

      // Send reorder to server
      for (const field of fields) {
        await fetch(`/api/forms/${formId}/fields/${field.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ order: field.order }),
        })
      }
    } catch (err) {
      console.error('Failed to reorder fields:', err)
    }
  }

  const handleAddField = async (newField: Omit<FormField, 'id'>) => {
    try {
      const response = await fetch(`/api/forms/${formId}/fields`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newField),
      })

      if (!response.ok) throw new Error('Failed to add field')

      const data = await response.json()
      setSchema(prev => {
        if (!prev) return null
        return {
          ...prev,
          fields: [...prev.fields, data.data],
        }
      })
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to add field')
    }
  }

  const handleUpdateField = async (field: FormField) => {
    try {
      // For now, just update locally
      setSchema(prev => {
        if (!prev) return null
        return {
          ...prev,
          fields: prev.fields.map(f => (f.id === field.id ? field : f)),
        }
      })
    } catch (err) {
      console.error('Failed to update field:', err)
    }
  }

  const handleDeleteField = async (fieldId: string) => {
    try {
      setSchema(prev => {
        if (!prev) return null
        return {
          ...prev,
          fields: prev.fields.filter(f => f.id !== fieldId),
        }
      })
    } catch (err) {
      console.error('Failed to delete field:', err)
    }
  }

  const selectedField = schema?.fields.find(f => f.id === selectedFieldId)

  if (isLoading) {
    return <div className="text-center py-12">Loading...</div>
  }

  if (error) {
    return <div className="text-center py-12 text-error">{error}</div>
  }

  if (!schema) {
    return <div className="text-center py-12">Form not found</div>
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{schema.title}</h1>
          {schema.description && <p className="text-gray-600 mt-1">{schema.description}</p>}
        </div>
        <div className="flex items-center gap-4">
          <PresenceAvatars presenceState={{}} />
          <div className="flex items-center gap-2">
            <div
              className={`h-3 w-3 rounded-full ${
                isConnected ? 'bg-success' : 'bg-warning'
              }`}
            />
            <span className="text-sm text-gray-600">
              {isConnected ? 'Connected' : 'Connecting...'}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-4">
          <AddFieldMenu onAddField={handleAddField} currentFieldCount={schema.fields.length} />
          <FieldList
            fields={schema.fields}
            onReorder={handleReorder}
            onSelectField={setSelectedFieldId}
            selectedFieldId={selectedFieldId}
          />
        </div>

        <div className="md:col-span-2">
          {selectedField ? (
            <FieldEditor
              field={selectedField}
              onUpdate={handleUpdateField}
              onDelete={handleDeleteField}
            />
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center text-gray-500">
              <p>Select a field to edit or add a new one</p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 pt-8 border-t border-gray-200">
        <Button variant="secondary">
          Preview Form →
        </Button>
        <span className="ml-4 text-gray-600 text-sm">
          Share this link: <code className="bg-gray-100 px-2 py-1 rounded">{schema.shareToken}</code>
        </span>
      </div>
    </div>
  )
}
