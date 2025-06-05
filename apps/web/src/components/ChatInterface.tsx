'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ChatBubble } from '@/components/ChatBubble';
import { useState } from 'react';

interface Message {
  role: 'user' | 'bot';
  content: string;
}

interface PlannedStep {
  question: string;
  type: 'text' | 'mcq' | 'checkbox';
  options?: string[];
}

export function ChatInterface(): JSX.Element {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!input.trim()) return;
    setError(null);

    // Add user message
    const userMessage: Message = { role: 'user', content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/next-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ history: [...messages, userMessage] }),
      });
      if (!res.ok) throw new Error('Failed to get next question');
      const data: PlannedStep = await res.json();
      setMessages((prev) => [...prev, { role: 'bot', content: data.question }]);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="flex h-[600px] w-full max-w-2xl flex-col">
      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {messages.map((message, index) => (
          <ChatBubble key={index} role={message.role} content={message.content} />
        ))}
        {loading && <ChatBubble role="bot" content="Thinking..." />}
        {error && <div className="text-red-500">{error}</div>}
      </div>
      <form onSubmit={handleSubmit} className="border-t p-4">
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="min-h-[60px]"
            disabled={loading}
          />
          <Button type="submit" className="self-end" disabled={loading}>
            Send
          </Button>
        </div>
      </form>
    </Card>
  );
}
