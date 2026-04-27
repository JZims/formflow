import React from 'react'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error'
}

export function Badge({ children, variant = 'primary' }: BadgeProps) {
  const variantStyles = {
    primary: 'bg-blue-100 text-primary',
    secondary: 'bg-purple-100 text-secondary',
    success: 'bg-green-100 text-success',
    warning: 'bg-yellow-100 text-warning',
    error: 'bg-red-100 text-error',
  }

  return (
    <span className={`inline-block px-2 py-1 text-xs font-medium rounded ${variantStyles[variant]}`}>
      {children}
    </span>
  )
}
