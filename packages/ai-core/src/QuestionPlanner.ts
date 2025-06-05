// Domain types
export type Message = {
  role: 'user' | 'bot';
  content: string;
};

export type PlannedStep = {
  question: string;
  type: 'text' | 'mcq' | 'checkbox';
  options?: string[];
};

// Abstract LLM client interface
export interface LLMClient {
  generateNextQuestion(history: Message[]): Promise<PlannedStep>;
}

// Abstract vector client interface (for embeddings, optional)
export interface VectorClient {
  embed(text: string): Promise<number[]>;
}

/**
 * QuestionPlanner is the core engine for planning the next survey question.
 * It is agnostic to the LLM provider (OpenAI, Llama, etc) and vector DB.
 *
 * Usage:
 *   - Pass in any LLM client (e.g., OpenAI, Ollama, etc) that implements LLMClient.
 *   - Swap out LLMs by providing a different client.
 */
export class QuestionPlanner {
  constructor(
    private llmClient: LLMClient,
    private vectorClient?: VectorClient // optional, for advanced use
  ) {}

  async planNext(questionHistory: Message[]): Promise<PlannedStep> {
    // You can add pre/post-processing here if needed
    return this.llmClient.generateNextQuestion(questionHistory);
  }
}

// ---
// To use GPT-4: implement LLMClient with OpenAI API calls
// To use Llama: implement LLMClient with Ollama/Replicate/etc API calls
//
// Example (pseudo):
// class OpenAIClient implements LLMClient { ... }
// class OllamaClient implements LLMClient { ... }
//
// Pass your client to QuestionPlanner:
//   const planner = new QuestionPlanner(new OpenAIClient(...));
//
// This makes your engine future-proof and testable!
