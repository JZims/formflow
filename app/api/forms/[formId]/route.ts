import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { UpdateFormSchema } from '@/lib/validators/form'
import { FormSchema } from '@/types'

export async function GET(
  req: NextRequest,
  { params }: { params: { formId: string } }
) {
  try {
    const form = await prisma.form.findUnique({
      where: { id: params.formId },
      include: {
        fields: {
          orderBy: { order: 'asc' },
        },
      },
    })

    if (!form) {
      return NextResponse.json(
        { success: false, error: 'Form not found' },
        { status: 404 }
      )
    }

    const response: FormSchema = {
      id: form.id,
      title: form.title,
      description: form.description || undefined,
      shareToken: form.shareToken,
      fields: form.fields.map(f => ({
        id: f.id,
        type: f.type as any,
        label: f.label,
        placeholder: f.placeholder || undefined,
        required: f.required,
        order: f.order,
        options: f.options,
      })),
    }

    return NextResponse.json({ success: true, data: response })
  } catch (error) {
    console.error('GET /api/forms/[formId] error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch form' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { formId: string } }
) {
  try {
    const body = await req.json()
    const validated = UpdateFormSchema.parse(body)

    const form = await prisma.form.update({
      where: { id: params.formId },
      data: validated,
    })

    return NextResponse.json({ success: true, data: form })
  } catch (error) {
    console.error('PATCH /api/forms/[formId] error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update form' },
      { status: 400 }
    )
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { formId: string } }
) {
  try {
    await prisma.form.delete({
      where: { id: params.formId },
    })

    return NextResponse.json({ success: true, data: null })
  } catch (error) {
    console.error('DELETE /api/forms/[formId] error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete form' },
      { status: 400 }
    )
  }
}
