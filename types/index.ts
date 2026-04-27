export type FieldType = "TEXT" | "TEXTAREA" | "SELECT" | "CHECKBOX"

export interface FormField {
  id: string
  type: FieldType
  label: string
  placeholder?: string
  required: boolean
  order: number
  options: string[]
}

export interface FormSchema {
  id: string
  title: string
  description?: string
  shareToken: string
  fields: FormField[]
}

export interface FieldUpdate {
  label?: string
  placeholder?: string
  required?: boolean
  order?: number
  options?: string[]
}

export interface AggregatedResponse {
  fieldId: string
  label: string
  type: FieldType
  answers: string[]
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}
