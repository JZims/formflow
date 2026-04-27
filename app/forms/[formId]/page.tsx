'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { FormSchema } from '@/types'
import { FormRenderer } from '@/components/renderer/FormRenderer'

export default function FormView() {
  const params = useParams()
  const formId = params.formId as string
  const [schema, setSchema] = useState<FormSchema | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const response = await fetch(`/api/forms/${formId}`)
        if (!response.ok) throw new Error('Form not found')
        const data = await response.json()
        setSchema(data.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load form')
      } finally {
        setIsLoading(false)
      }
    }

    fetchForm()
  }, [formId])

  const handleSubmit = async (answers: Record<string, string>) => {
    try {
      const answersList = Object.entries(answers).map(([fieldId, value]) => ({
        fieldId,
        value,
      }))

      const response = await fetch(`/api/responses/${formId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: answersList }),
      })

      if (!response.ok) throw new Error('Failed to submit form')

      setSubmitted(true)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'An error occurred')
    }
  }

  if (isLoading) {
    return <div className="text-center py-12">Loading...</div>
  }

  if (error) {
    return <div className="text-center py-12 text-error">{error}</div>
  }

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <h1 className="text-3xl font-bold text-success mb-4">Thank you!</h1>
        <p className="text-gray-600">Your response has been submitted.</p>
      </div>
    )
  }

  if (!schema) {
    return <div className="text-center py-12">Form not found</div>
  }

  return (
    <div className="max-w-2xl mx-auto">
      <FormRenderer schema={schema} onSubmit={handleSubmit} />
    </div>
  )
}
