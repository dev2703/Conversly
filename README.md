# Chatform V0

A chat-style, AI-driven data-collection SaaS that turns a creator's short prompt into a conversational survey and instant analytics.

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- shadcn/ui + Tailwind CSS
- Prisma + PostgreSQL (pgvector)
- OpenAI API
- pnpm Workspaces
- Turborepo

## Getting Started

### Prerequisites

- Node.js >= 18
- pnpm >= 8.15.0
- PostgreSQL with pgvector extension

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/chatform-v0.git
   cd chatform-v0
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. Start the development server:
   ```bash
   pnpm dev
   ```

## Project Structure

```
.
├─ apps/
│   └─ web/            # Next 14 app dir
├─ packages/
│   ├─ ai-core/        # LLM orchestration, prompt builders
│   ├─ db/             # Prisma schema + adapters
│   └─ insight-core/   # summarisation & chart helpers
├─ infra/              # Terraform or Supabase config (later)
└─ docs/
```

## Development

- `pnpm dev` - Start development server
- `pnpm build` - Build all packages and apps
- `pnpm lint` - Run ESLint
- `pnpm format` - Format code with Prettier

## Contributing

1. Create a new branch
2. Make your changes
3. Submit a pull request

## License

MIT 