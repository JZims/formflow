'use client'

import { useRef } from 'react'
import { useDrag, useDrop } from 'react-dnd'
import { FormField } from '@/types'
import { Badge } from '@/components/ui/Badge'

const DRAG_TYPE = 'FORM_FIELD'

interface DragItem {
  id: string
  index: number
}

interface FieldItemProps {
  field: FormField
  index: number
  moveField: (dragIndex: number, hoverIndex: number) => void
  onDropField: () => void
  isSelected: boolean
  onSelect: () => void
}

export function FieldItem({
  field,
  index,
  moveField,
  onDropField,
  isSelected,
  onSelect,
}: FieldItemProps) {
  const ref = useRef<HTMLDivElement>(null)

  const [{ isDragging }, drag] = useDrag(() => ({
    type: DRAG_TYPE,
    item: { id: field.id, index },
    end: () => {
      onDropField()
    },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  }), [field.id, index, onDropField])

  const [, drop] = useDrop<DragItem>(() => ({
    accept: DRAG_TYPE,
    hover: (item: DragItem) => {
      if (!ref.current) {
        return
      }

      const dragIndex = item.index
      const hoverIndex = index

      if (dragIndex === hoverIndex) {
        return
      }

      moveField(dragIndex, hoverIndex)
      item.index = hoverIndex
    },
  }), [index, moveField])

  drag(drop(ref))

  return (
    <div
      ref={ref}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      onClick={onSelect}
      className={`p-3 rounded-lg border-2 cursor-move transition-colors ${
        isSelected ? 'border-primary bg-blue-50' : 'border-gray-200 bg-white hover:border-gray-300'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="font-medium text-gray-900">{field.label}</h3>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="secondary">{field.type}</Badge>
            {field.required && <Badge variant="error">Required</Badge>}
          </div>
        </div>
        <div className="text-gray-400 cursor-grab active:cursor-grabbing ml-4">⋮</div>
      </div>
    </div>
  )
}
