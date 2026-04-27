'use client'

import { useState } from 'react'
import { FormField, FieldType } from '@/types'
import { Button } from '@/components/ui/Button'

const FIELD_TYPES: { type: FieldType; label: string }[] = [
  { type: 'TEXT', label: 'Text Input' },
  { type: 'TEXTAREA', label: 'Text Area' },
  { type: 'SELECT', label: 'Dropdown' },
  { type: 'CHECKBOX', label: 'Checkboxes' },
]

interface AddFieldMenuProps {
  onAddField: (field: Omit<FormField, 'id'>) => void
  currentFieldCount: number
}

export function AddFieldMenu({ onAddField, currentFieldCount }: AddFieldMenuProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleAddField = (type: FieldType) => {
    const newField: Omit<FormField, 'id'> = {
      type,
      label: `${type} Field`,
      placeholder: undefined,
      required: false,
      order: currentFieldCount,
      options: [],
    }
    onAddField(newField)
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <Button
        variant="primary"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full"
      >
        + Add Field
      </Button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
          {FIELD_TYPES.map(({ type, label }) => (
            <button
              key={type}
              onClick={() => handleAddField(type)}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 first:rounded-t-lg last:rounded-b-lg"
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
