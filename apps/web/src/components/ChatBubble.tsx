'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ChatBubbleProps {
  role: 'user' | 'bot';
  content: string;
  className?: string;
}

export function ChatBubble({ role, content, className }: ChatBubbleProps): JSX.Element {
  return (
    <div
      className={cn(
        'flex w-full gap-3',
        role === 'user' ? 'justify-end' : 'justify-start',
        className
      )}
    >
      {role === 'bot' && (
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-primary text-primary-foreground">AI</AvatarFallback>
        </Avatar>
      )}
      <Card
        className={cn(
          'max-w-[80%] p-4',
          role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'
        )}
      >
        <p className="text-sm">{content}</p>
      </Card>
      {role === 'user' && (
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-muted">U</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
