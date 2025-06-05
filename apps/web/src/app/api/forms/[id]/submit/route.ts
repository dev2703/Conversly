import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const { answers } = await req.json();

    const form = await prisma.form.findUnique({
      where: { id: params.id },
    });

    if (!form) {
      return NextResponse.json({ error: 'Form not found' }, { status: 404 });
    }

    if (!form.published) {
      return NextResponse.json({ error: 'Form is not published' }, { status: 403 });
    }

    const response = await prisma.response.create({
      data: {
        formId: params.id,
        answers,
      },
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error submitting form:', error);
    return NextResponse.json({ error: 'Failed to submit form' }, { status: 500 });
  }
}
