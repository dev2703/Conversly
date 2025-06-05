import { VectorClient } from './QuestionPlanner';

/**
 * PgvectorClient implements VectorClient for Postgres with pgvector extension.
 * You can use this for semantic search, deduplication, or RAG.
 * Requires a Postgres client (e.g., node-postgres/pg) and pgvector extension.
 */
export class PgvectorClient implements VectorClient {
  constructor(private db: unknown) {} // Replace 'unknown' with your actual DB client type

  async embed(): Promise<number[]> {
    throw new Error('Embedding model integration not implemented.');
  }

  async storeEmbedding(): Promise<void> {
    throw new Error('storeEmbedding not implemented.');
  }

  async searchSimilar(): Promise<{ id: string; score: number }[]> {
    throw new Error('searchSimilar not implemented.');
  }
}
