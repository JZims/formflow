import { z } from "zod"

export const FieldTypeSchema = z.enum(["TEXT", "TEXTAREA", "SELECT", "CHECKBOX"])

export const CreateFieldSchema = z.object({
  type: FieldTypeSchema,
  label: z.string().min(1).max(200),
  placeholder: z.string().max(200).optional(),
  required: z.boolean().default(false),
  order: z.number().int().min(0),
  options: z.array(z.string()).default([]),
})

export const UpdateFieldSchema = CreateFieldSchema.partial()

export type CreateFieldInput = z.infer<typeof CreateFieldSchema>
export type UpdateFieldInput = z.infer<typeof UpdateFieldSchema>
