'use client'

interface TextareaFieldProps {
  id: string
  label: string
  placeholder?: string
  required?: boolean
  value: string
  onChange: (value: string) => void
}

export function TextareaField({
  id,
  label,
  placeholder,
  required,
  value,
  onChange,
}: TextareaFieldProps) {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-error ml-1">*</span>}
      </label>
      <textarea
        id={id}
        placeholder={placeholder}
        required={required}
        value={value}
        onChange={e => onChange(e.target.value)}
        aria-required={required}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
        rows={4}
      />
    </div>
  )
}
