import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { AggregatedResponse } from '@/types'
import { z } from 'zod'

const SubmitResponseSchema = z.object({
  answers: z.array(
    z.object({
      fieldId: z.string(),
      value: z.string(),
    })
  ),
})

export async function POST(
  req: NextRequest,
  { params }: { params: { formId: string } }
) {
  try {
    const body = await req.json()
    const validated = SubmitResponseSchema.parse(body)

    const response = await prisma.response.create({
      data: {
        formId: params.formId,
        answers: {
          create: validated.answers,
        },
      },
    })

    return NextResponse.json(
      { success: true, data: response },
      { status: 201 }
    )
  } catch (error) {
    console.error('POST /api/responses/[formId] error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to submit response' },
      { status: 400 }
    )
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { formId: string } }
) {
  try {
    const fields = await prisma.field.findMany({
      where: { formId: params.formId },
      orderBy: { order: 'asc' },
    })

    const answers = await prisma.answer.findMany({
      where: { field: { formId: params.formId } },
      include: { field: true },
    })

    const aggregated: AggregatedResponse[] = fields.map(field => ({
      fieldId: field.id,
      label: field.label,
      type: field.type as any,
      answers: answers
        .filter(a => a.fieldId === field.id)
        .map(a => a.value),
    }))

    return NextResponse.json({ success: true, data: aggregated })
  } catch (error) {
    console.error('GET /api/responses/[formId] error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch responses' },
      { status: 500 }
    )
  }
}
