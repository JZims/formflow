'use client'

interface CheckboxFieldProps {
  id: string
  label: string
  options: string[]
  required?: boolean
  value: string[]
  onChange: (value: string[]) => void
}

export function CheckboxField({
  id,
  label,
  options,
  required,
  value,
  onChange,
}: CheckboxFieldProps) {
  const handleChange = (option: string) => {
    if (value.includes(option)) {
      onChange(value.filter(v => v !== option))
    } else {
      onChange([...value, option])
    }
  }

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
        {required && <span className="text-error ml-1">*</span>}
      </label>
      <div className="space-y-2">
        {options.map(option => (
          <div key={option} className="flex items-center">
            <input
              type="checkbox"
              id={`${id}-${option}`}
              checked={value.includes(option)}
              onChange={() => handleChange(option)}
              aria-required={required}
              className="h-4 w-4 text-primary border-gray-300 rounded"
            />
            <label htmlFor={`${id}-${option}`} className="ml-2 text-sm text-gray-700">
              {option}
            </label>
          </div>
        ))}
      </div>
    </div>
  )
}
