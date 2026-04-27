import { z } from "zod"

export const CreateFormSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(500).optional(),
})

export const UpdateFormSchema = CreateFormSchema.partial()

export type CreateFormInput = z.infer<typeof CreateFormSchema>
export type UpdateFormInput = z.infer<typeof UpdateFormSchema>
