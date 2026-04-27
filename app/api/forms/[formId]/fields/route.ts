import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { CreateFieldSchema } from '@/lib/validators/field'

export async function GET(
  req: NextRequest,
  { params }: { params: { formId: string } }
) {
  try {
    const fields = await prisma.field.findMany({
      where: { formId: params.formId },
      orderBy: { order: 'asc' },
    })

    return NextResponse.json({ success: true, data: fields })
  } catch (error) {
    console.error('GET /api/forms/[formId]/fields error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch fields' },
      { status: 500 }
    )
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { formId: string } }
) {
  try {
    const body = await req.json()
    const validated = CreateFieldSchema.parse(body)

    // Get the last field order
    const lastField = await prisma.field.findFirst({
      where: { formId: params.formId },
      orderBy: { order: 'desc' },
    })

    const order = lastField ? lastField.order + 1 : 0

    const field = await prisma.field.create({
      data: {
        formId: params.formId,
        type: validated.type,
        label: validated.label,
        placeholder: validated.placeholder,
        required: validated.required,
        order,
        options: validated.options,
      },
    })

    return NextResponse.json(
      { success: true, data: field },
      { status: 201 }
    )
  } catch (error) {
    console.error('POST /api/forms/[formId]/fields error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create field' },
      { status: 400 }
    )
  }
}
