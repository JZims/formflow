import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { CreateFormSchema } from '@/lib/validators/form'
import { ApiResponse } from '@/types'

export async function GET() {
  try {
    const forms = await prisma.form.findMany({
      include: { _count: { select: { fields: true } } },
      orderBy: { createdAt: 'desc' },
    })

    const response = forms.map(form => ({
      id: form.id,
      title: form.title,
      description: form.description,
      fieldCount: form._count.fields,
      createdAt: form.createdAt,
    }))

    return NextResponse.json({ success: true, data: response })
  } catch (error) {
    console.error('GET /api/forms error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch forms' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const validated = CreateFormSchema.parse(body)

    const form = await prisma.form.create({
      data: {
        title: validated.title,
        description: validated.description,
      },
    })

    return NextResponse.json(
      { success: true, data: form },
      { status: 201 }
    )
  } catch (error) {
    console.error('POST /api/forms error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create form' },
      { status: 400 }
    )
  }
}
