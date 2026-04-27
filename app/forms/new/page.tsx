'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

export default function NewFormPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({ title: '', description: '' })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/forms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error('Failed to create form')

      const data = await response.json()
      router.push(`/forms/${data.data.id}/edit`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Create a New Form</h1>

      {error && <div className="mb-4 p-4 bg-red-50 text-error rounded-lg">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Form Title"
          placeholder="e.g., Customer Feedback"
          value={formData.title}
          onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
          required
        />

        <Input
          label="Description (optional)"
          placeholder="Tell people what this form is about"
          value={formData.description}
          onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
        />

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? 'Creating...' : 'Create Form'}
        </Button>
      </form>
    </div>
  )
}
