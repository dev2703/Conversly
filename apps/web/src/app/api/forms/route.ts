import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request): Promise<NextResponse> {
  try {
    const { title, description, fields } = await req.json();

    const form = await prisma.form.create({
      data: {
        title,
        description,
        fields,
      },
    });

    return NextResponse.json(form);
  } catch (error) {
    console.error('Error creating form:', error);
    return NextResponse.json({ error: 'Failed to create form' }, { status: 500 });
  }
}

export async function GET(req: Request): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(req.url);
    const shareId = searchParams.get('shareId');

    if (shareId) {
      const form = await prisma.form.findUnique({
        where: { shareId },
        include: { responses: true },
      });

      if (!form) {
        return NextResponse.json({ error: 'Form not found' }, { status: 404 });
      }

      return NextResponse.json(form);
    }

    const forms = await prisma.form.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(forms);
  } catch (error) {
    console.error('Error fetching forms:', error);
    return NextResponse.json({ error: 'Failed to fetch forms' }, { status: 500 });
  }
}
