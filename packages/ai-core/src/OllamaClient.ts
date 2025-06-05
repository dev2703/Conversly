import { LLMClient, Message, PlannedStep } from './QuestionPlanner';

/**
 * OllamaClient implements LLMClient for local Ollama LLMs (Llama 3, Mistral, etc).
 * See: https://github.com/jmorganca/ollama/blob/main/docs/api.md
 */
export class OllamaClient implements LLMClient {
  constructor(
    private model: string = 'llama3',
    private apiUrl: string = 'http://localhost:11434/api/generate'
  ) {}

  async generateNextQuestion(history: Message[]): Promise<PlannedStep> {
    // Compose the prompt from history
    const prompt = this.buildPrompt(history);
    const body = {
      model: this.model,
      prompt,
      stream: false,
    };
    const res = await fetch(this.apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`Ollama API error: ${res.status}`);
    const data = await res.json();
    // Expect the model to return a JSON string for PlannedStep
    try {
      const step: PlannedStep = JSON.parse(data.response);
      return step;
    } catch (e) {
      throw new Error('Ollama did not return valid PlannedStep JSON: ' + data.response);
    }
  }

  private buildPrompt(history: Message[]): string {
    // You can customize this prompt for your use case
    return `Given the following conversation history, return the next survey question as a JSON object with keys: question, type (text|mcq|checkbox), and options (if applicable).\nHistory:\n${history.map((m) => `${m.role}: ${m.content}`).join('\n')}\nNext:`;
  }
}
