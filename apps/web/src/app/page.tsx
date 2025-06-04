import { ChatInterface } from '@/components/ChatInterface';

export default function Home(): JSX.Element {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <h1 className="mb-8 text-3xl font-bold">Conversly</h1>
      <ChatInterface />
    </main>
  );
}
