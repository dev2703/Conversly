import { LLMClient, Message, PlannedStep } from './QuestionPlanner';
import OpenAI from 'openai';

/**
 * LangChainClient implements LLMClient using LangChain for advanced prompt orchestration.
 * You can use any supported LLM (OpenAI, Ollama, etc) via LangChain.
 *
 * NOTE: Uncomment and install langchain and your LLM provider to use this in production.
 */
export class LangChainClient implements LLMClient {
  private openai: OpenAI;

  constructor(apiKey: string) {
    this.openai = new OpenAI({ apiKey });
  }

  async generateNextQuestion(history: Message[]): Promise<PlannedStep> {
    const prompt = `Given the following conversation history, return the next survey question as a JSON object with keys: question, type (text|mcq|checkbox), and options (if applicable).\nHistory:\n${history.map((m) => `${m.role}: ${m.content}`).join('\n')}\nNext:`;
    const response = await this.openai.chat.completions.create({
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
      return JSON.parse(content!);
    } catch (e) {
      throw new Error('OpenAI did not return valid PlannedStep JSON: ' + content);
    }
  }
}
