'use client'

import { Input } from '@/components/ui/Input'

interface TextFieldProps {
  id: string
  label: string
  placeholder?: string
  required?: boolean
  value: string
  onChange: (value: string) => void
}

export function TextField({
  id,
  label,
  placeholder,
  required,
  value,
  onChange,
}: TextFieldProps) {
  return (
    <div className="mb-4">
      <Input
        id={id}
        label={label}
        type="text"
        placeholder={placeholder}
        required={required}
        value={value}
        onChange={e => onChange(e.target.value)}
        aria-required={required}
      />
    </div>
  )
}
