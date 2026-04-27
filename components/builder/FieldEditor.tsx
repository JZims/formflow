'use client'

import { useState, useEffect } from 'react'
import { FormField, FieldType, FieldUpdate } from '@/types'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'

const FIELD_TYPES: FieldType[] = ['TEXT', 'TEXTAREA', 'SELECT', 'CHECKBOX']

interface FieldEditorProps {
  field: FormField
  onUpdate: (field: FormField) => void
  onDelete?: (fieldId: string) => void
}

export function FieldEditor({ field, onUpdate, onDelete }: FieldEditorProps) {
  const [label, setLabel] = useState(field.label)
  const [placeholder, setPlaceholder] = useState(field.placeholder || '')
  const [required, setRequired] = useState(field.required)
  const [options, setOptions] = useState(field.options.join('\n'))

  useEffect(() => {
    setLabel(field.label)
    setPlaceholder(field.placeholder || '')
    setRequired(field.required)
    setOptions(field.options.join('\n'))
  }, [field.id])

  const handleSave = () => {
    const update: FieldUpdate = {
      label,
      placeholder: placeholder || undefined,
      required,
      options: field.type === 'SELECT' || field.type === 'CHECKBOX' 
        ? options.split('\n').filter(o => o.trim()) 
        : [],
    }

    onUpdate({
      ...field,
      ...update,
    })
  }

  const showOptionsEditor = field.type === 'SELECT' || field.type === 'CHECKBOX'

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Edit Field</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Field Type</label>
          <Badge>{field.type}</Badge>
        </div>

        <Input
          label="Label"
          value={label}
          onChange={e => setLabel(e.target.value)}
          placeholder="e.g., Full Name"
        />

        <Input
          label="Placeholder"
          value={placeholder}
          onChange={e => setPlaceholder(e.target.value)}
          placeholder="e.g., Enter your full name"
        />

        <div className="flex items-center">
          <input
            type="checkbox"
            id="required"
            checked={required}
            onChange={e => setRequired(e.target.checked)}
            className="h-4 w-4 text-primary border-gray-300 rounded"
          />
          <label htmlFor="required" className="ml-2 text-sm text-gray-700">
            Required
          </label>
        </div>

        {showOptionsEditor && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Options (one per line)
            </label>
            <textarea
              value={options}
              onChange={e => setOptions(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              rows={4}
              placeholder="Option 1&#10;Option 2&#10;Option 3"
            />
          </div>
        )}

        <div className="flex gap-2 pt-4">
          <Button variant="primary" onClick={handleSave}>
            Save Changes
          </Button>
          {onDelete && (
            <Button variant="danger" onClick={() => onDelete(field.id)}>
              Delete
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
