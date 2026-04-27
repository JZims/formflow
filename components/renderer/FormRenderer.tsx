'use client'

import { useState } from 'react'
import { FormSchema } from '@/types'
import { TextField } from './fields/TextField'
import { TextareaField } from './fields/TextareaField'
import { SelectField } from './fields/SelectField'
import { CheckboxField } from './fields/CheckboxField'
import { Button } from '@/components/ui/Button'

interface FormRendererProps {
  schema: FormSchema
  onSubmit: (answers: Record<string, string>) => void | Promise<void>
}

export function FormRenderer({ schema, onSubmit }: FormRendererProps) {
  const [values, setValues] = useState<Record<string, string | string[]>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate required fields
    const requiredFields = schema.fields.filter(f => f.required)
    const missingFields = requiredFields.filter(f => {
      const value = values[f.id]
      if (Array.isArray(value)) {
        return value.length === 0
      }
      return !value
    })

    if (missingFields.length > 0) {
      alert(`Please fill in all required fields: ${missingFields.map(f => f.label).join(', ')}`)
      return
    }

    // Convert answers to string format
    const answers: Record<string, string> = {}
    for (const field of schema.fields) {
      const value = values[field.id]
      if (Array.isArray(value)) {
        answers[field.id] = value.join(',')
      } else {
        answers[field.id] = String(value || '')
      }
    }

    setIsSubmitting(true)
    try {
      await onSubmit(answers)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFieldChange = (fieldId: string, value: string | string[]) => {
    setValues(prev => ({
      ...prev,
      [fieldId]: value,
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{schema.title}</h1>
        {schema.description && <p className="text-gray-600 mt-2">{schema.description}</p>}
      </div>

      <div className="space-y-6">
        {schema.fields.map(field => {
          const fieldValue = values[field.id] ?? (field.type === 'CHECKBOX' ? [] : '')

          switch (field.type) {
            case 'TEXT':
              return (
                <TextField
                  key={field.id}
                  id={field.id}
                  label={field.label}
                  placeholder={field.placeholder}
                  required={field.required}
                  value={String(fieldValue)}
                  onChange={v => handleFieldChange(field.id, v)}
                />
              )
            case 'TEXTAREA':
              return (
                <TextareaField
                  key={field.id}
                  id={field.id}
                  label={field.label}
                  placeholder={field.placeholder}
                  required={field.required}
                  value={String(fieldValue)}
                  onChange={v => handleFieldChange(field.id, v)}
                />
              )
            case 'SELECT':
              return (
                <SelectField
                  key={field.id}
                  id={field.id}
                  label={field.label}
                  options={field.options}
                  required={field.required}
                  value={String(fieldValue)}
                  onChange={v => handleFieldChange(field.id, v)}
                />
              )
            case 'CHECKBOX':
              return (
                <CheckboxField
                  key={field.id}
                  id={field.id}
                  label={field.label}
                  options={field.options}
                  required={field.required}
                  value={Array.isArray(fieldValue) ? fieldValue : []}
                  onChange={v => handleFieldChange(field.id, v)}
                />
              )
            default:
              return null
          }
        })}
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </Button>
    </form>
  )
}
