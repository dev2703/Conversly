import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const { history } = await req.json();
    const prompt = `Given the following conversation history, return the next survey question as a JSON object with keys: question, type (text|mcq|checkbox), and options (if applicable).\nHistory:\n${history.map((m: { role: string; content: string }) => `${m.role}: ${m.content}`).join('\n')}\nNext:`;
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful survey assistant.' },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 512,
    });
    const content = response.choices[0].message.content;
    try {
      return NextResponse.json(JSON.parse(content!));
    } catch (e) {
      console.error('OpenAI did not return valid PlannedStep JSON:', content);
      return NextResponse.json(
        { error: 'OpenAI did not return valid PlannedStep JSON', raw: content },
        { status: 500 }
      );
    }
  } catch (error) {
    // Log the error for debugging
    console.error('API error in /api/next-question:', error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
