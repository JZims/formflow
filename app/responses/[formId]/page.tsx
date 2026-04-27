'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { AggregatedResponse } from '@/types'
import { Badge } from '@/components/ui/Badge'

export default function ResponsesPage() {
  const params = useParams()
  const formId = params.formId as string
  const [responses, setResponses] = useState<AggregatedResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        const response = await fetch(`/api/responses/${formId}`)
        if (!response.ok) throw new Error('Failed to fetch responses')
        const data = await response.json()
        setResponses(data.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load responses')
      } finally {
        setIsLoading(false)
      }
    }

    fetchResponses()
  }, [formId])

  if (isLoading) {
    return <div className="text-center py-12">Loading responses...</div>
  }

  if (error) {
    return <div className="text-center py-12 text-error">{error}</div>
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Form Responses</h1>

      <div className="space-y-8">
        {responses.length === 0 ? (
          <div className="text-center py-12 text-gray-600">
            <p>No responses yet</p>
          </div>
        ) : (
          responses.map(field => (
            <div key={field.fieldId} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">{field.label}</h2>
                <Badge variant="primary">{field.type}</Badge>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-gray-600 mb-3">
                  {field.answers.length} {field.answers.length === 1 ? 'response' : 'responses'}
                </p>

                <div className="flex flex-wrap gap-2">
                  {field.type === 'CHECKBOX' ? (
                    field.answers
                      .flatMap((answer: string) => answer.split(','))
                      .reduce(
                        (acc, answer) => {
                          const existing = acc.find(item => item.value === answer)
                          if (existing) {
                            existing.count++
                          } else {
                            acc.push({ value: answer, count: 1 })
                          }
                          return acc
                        },
                        [] as { value: string; count: number }[]
                      )
                      .map(item => (
                        <div key={item.value} className="bg-blue-50 px-3 py-1 rounded">
                          <span className="font-medium">{item.value}</span>
                          <span className="text-gray-600 ml-2">({item.count})</span>
                        </div>
                      ))
                  ) : field.type === 'SELECT' ? (
                    field.answers
                      .reduce(
                        (acc, answer) => {
                          const existing = acc.find(item => item === answer)
                          if (!existing) {
                            acc.push(answer)
                          }
                          return acc
                        },
                        [] as string[]
                      )
                      .map(answer => (
                        <div key={answer} className="bg-blue-50 px-3 py-1 rounded">
                          {answer}
                        </div>
                      ))
                  ) : (
                    <div className="w-full space-y-2">
                      {field.answers.map((answer, idx) => (
                        <div key={idx} className="bg-gray-50 px-3 py-2 rounded border border-gray-200">
                          {answer}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
