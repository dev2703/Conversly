import { NextResponse } from 'next/server';
import OpenAI from 'openai';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY is not set in environment variables');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request): Promise<NextResponse> {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are a form generation expert. Create a form based on the user's prompt.
          Return the form structure in the following JSON format:
          {
            "fields": [
              {
                "id": "unique_id",
                "type": "text" | "multiple_choice" | "checkbox" | "rating",
                "question": "question text",
                "options": ["option1", "option2"] (only for multiple_choice and checkbox),
                "required": boolean
              }
            ]
          }`,
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      response_format: { type: 'json_object' },
    });

    const content = completion.choices[0].message.content;
    if (!content) {
      throw new Error('No content received from OpenAI');
    }

    try {
      const formStructure = JSON.parse(content);
      return NextResponse.json(formStructure);
    } catch (parseError) {
      console.error('Error parsing OpenAI response:', parseError);
      return NextResponse.json({ error: 'Invalid response format from OpenAI' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error generating form:', error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'Failed to generate form' }, { status: 500 });
  }
}
