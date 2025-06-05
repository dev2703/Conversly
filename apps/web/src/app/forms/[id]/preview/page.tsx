'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface FormField {
  id: string;
  type: string;
  question: string;
  options?: string[];
  required: boolean;
}

interface Form {
  id: string;
  title: string;
  description?: string;
  fields: FormField[];
}

interface FormPreviewPageProps {
  params: {
    id: string;
  };
}

export default function FormPreviewPage({ params }: FormPreviewPageProps): JSX.Element {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState<Form | null>(null);
  const [fields, setFields] = useState<FormField[]>([]);

  // Fetch form data
  useEffect(() => {
    fetch(`/api/forms/${params.id}`)
      .then((res) => res.json())
      .then((data) => {
        setForm(data);
        setFields(data.fields);
      })
      .catch((error) => {
        console.error('Error fetching form:', error);
        toast.error('Failed to load form');
      });
  }, [params.id]);

  if (!form) {
    return <div>Loading...</div>;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);
      const answers = fields.map((field) => ({
        fieldId: field.id,
        value: formData.get(field.id),
      }));

      const response = await fetch(`/api/forms/${params.id}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ answers }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit form');
      }

      toast.success('Form submitted successfully!');
      e.currentTarget.reset();
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Failed to submit form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="container mx-auto py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <Button variant="ghost" asChild className="mb-8">
          <Link href={`/forms/${form.id}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Form
          </Link>
        </Button>

        <Card className="p-8">
          <h1 className="text-3xl font-bold mb-2">{form.title}</h1>
          {form.description && <p className="text-muted-foreground mb-8">{form.description}</p>}

          <form onSubmit={handleSubmit} className="space-y-6">
            {fields.map((field) => (
              <div key={field.id} className="space-y-2">
                <label className="block font-medium">
                  {field.question}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                {field.type === 'text' && (
                  <input
                    type="text"
                    name={field.id}
                    className="w-full p-2 border rounded"
                    placeholder="Type your answer here..."
                    required={field.required}
                  />
                )}
                {field.type === 'multiple_choice' && field.options && (
                  <div className="space-y-2">
                    {field.options.map((option: string) => (
                      <label key={option} className="flex items-center">
                        <input
                          type="radio"
                          name={field.id}
                          value={option}
                          className="mr-2"
                          required={field.required}
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                )}
                {field.type === 'checkbox' && field.options && (
                  <div className="space-y-2">
                    {field.options.map((option: string) => (
                      <label key={option} className="flex items-center">
                        <input
                          type="checkbox"
                          name={field.id}
                          value={option}
                          className="mr-2"
                          required={field.required}
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                )}
                {field.type === 'rating' && (
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <label key={rating} className="flex items-center">
                        <input
                          type="radio"
                          name={field.id}
                          value={rating}
                          className="hidden"
                          required={field.required}
                        />
                        <button
                          type="button"
                          className="w-10 h-10 border rounded-full hover:bg-primary hover:text-primary-foreground"
                          onClick={() => {
                            const input = document.querySelector(
                              `input[name="${field.id}"][value="${rating}"]`
                            ) as HTMLInputElement;
                            if (input) input.checked = true;
                          }}
                        >
                          {rating}
                        </button>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </Button>
          </form>
        </Card>
      </div>
    </main>
  );
}
