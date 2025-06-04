import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const heading = 'Describe what you want to ask';
const placeholder = 'Type your survey prompt here...';
const buttonText = 'Create Survey';

export default function CreatePage(): JSX.Element {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <Card className="w-full max-w-xl p-8 flex flex-col gap-6">
        <h1 className="text-2xl font-bold text-center">{heading}</h1>
        <Textarea placeholder={placeholder} className="min-h-[120px]" />
        <Button className="self-end">{buttonText}</Button>
      </Card>
    </main>
  );
}
