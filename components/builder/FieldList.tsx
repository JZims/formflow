'use client'

import { useEffect, useState } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { FormField } from '@/types'
import { FieldItem } from './FieldItem'

interface FieldListProps {
  fields: FormField[]
  onReorder: (fields: FormField[]) => void
  onSelectField?: (fieldId: string) => void
  selectedFieldId?: string | null
}

export function FieldList({
  fields,
  onReorder,
  onSelectField,
  selectedFieldId,
}: FieldListProps) {
  const [localFields, setLocalFields] = useState<FormField[]>(fields)

  useEffect(() => {
    setLocalFields(fields)
  }, [fields])

  const moveField = (dragIndex: number, hoverIndex: number) => {
    setLocalFields(prev => {
      if (dragIndex === hoverIndex) {
        return prev
      }

      const next = [...prev]
      const [dragged] = next.splice(dragIndex, 1)
      next.splice(hoverIndex, 0, dragged)
      return next
    })
  }

  const commitReorder = () => {
    const reorderedFields = localFields.map((field, index) => ({
      ...field,
      order: index,
    }))
    onReorder(reorderedFields)
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="space-y-2">
        {localFields.length === 0 ? (
          <p className="text-gray-500 py-8 text-center">No fields yet. Add your first field.</p>
        ) : (
          localFields.map((field, index) => (
            <FieldItem
              key={field.id}
              field={field}
              index={index}
              moveField={moveField}
              onDropField={commitReorder}
              isSelected={selectedFieldId === field.id}
              onSelect={() => onSelectField?.(field.id)}
            />
          ))
        )}
      </div>
    </DndProvider>
  )
}
