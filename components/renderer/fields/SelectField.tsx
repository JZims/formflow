'use client'

interface SelectFieldProps {
  id: string
  label: string
  options: string[]
  required?: boolean
  value: string
  onChange: (value: string) => void
}

export function SelectField({
  id,
  label,
  options,
  required,
  value,
  onChange,
}: SelectFieldProps) {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-error ml-1">*</span>}
      </label>
      <select
        id={id}
        required={required}
        value={value}
        onChange={e => onChange(e.target.value)}
        aria-required={required}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
      >
        <option value="">Select an option</option>
        {options.map(option => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  )
}
