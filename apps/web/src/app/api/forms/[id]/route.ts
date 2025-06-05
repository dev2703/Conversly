import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
): Promise<Response> {
  try {
    const form = await prisma.form.findUnique({
      where: { id: params.id },
      include: { responses: true },
    });

    if (!form) {
      return new NextResponse('Form not found', { status: 404 });
    }

    return NextResponse.json(form);
  } catch (error) {
    console.error('Error fetching form:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
): Promise<Response> {
  try {
    const body = await request.json();
    const { published } = body;

    const form = await prisma.form.update({
      where: { id: params.id },
      data: { published },
    });

    return NextResponse.json(form);
  } catch (error) {
    console.error('Error updating form:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
