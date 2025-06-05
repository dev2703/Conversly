'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Share2, Eye } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

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
  published: boolean;
}

interface FormPageProps {
  params: {
    id: string;
  };
}

export default function FormPage({ params }: FormPageProps): JSX.Element {
  const [form, setForm] = useState<Form | null>(null);
  const [isPublished, setIsPublished] = useState(false);

  // Fetch form data
  useEffect(() => {
    fetch(`/api/forms/${params.id}`)
      .then((res) => res.json())
      .then((data) => {
        setForm(data);
        setIsPublished(data.published);
      })
      .catch((error) => {
        console.error('Error fetching form:', error);
        toast.error('Failed to load form');
      });
  }, [params.id]);

  const handlePublishToggle = async (): Promise<void> => {
    try {
      const response = await fetch(`/api/forms/${params.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ published: !isPublished }),
      });

      if (!response.ok) {
        throw new Error('Failed to update form');
      }

      setIsPublished(!isPublished);
      toast.success(`Form ${!isPublished ? 'published' : 'unpublished'} successfully!`);
    } catch (error) {
      console.error('Error updating form:', error);
      toast.error('Failed to update form. Please try again.');
    }
  };

  if (!form) {
    return <div>Loading...</div>;
  }

  const previewUrl = `${window.location.origin}/forms/${form.id}/preview`;
  const embedCode = `<iframe src="${previewUrl}" width="100%" height="600" frameborder="0"></iframe>`;

  return (
    <main className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Button variant="ghost" asChild>
            <Link href="/forms">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Forms
            </Link>
          </Button>

          <div className="flex items-center gap-4">
            <div className="flex items-center space-x-2">
              <Switch id="publish" checked={isPublished} onCheckedChange={handlePublishToggle} />
              <Label htmlFor="publish">Published</Label>
            </div>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Share Form</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Preview Link</h3>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={previewUrl}
                        readOnly
                        className="flex-1 p-2 border rounded"
                      />
                      <Button
                        variant="outline"
                        onClick={() => {
                          navigator.clipboard.writeText(previewUrl);
                          toast.success('Link copied to clipboard!');
                        }}
                      >
                        Copy
                      </Button>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Embed Code</h3>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={embedCode}
                        readOnly
                        className="flex-1 p-2 border rounded"
                      />
                      <Button
                        variant="outline"
                        onClick={() => {
                          navigator.clipboard.writeText(embedCode);
                          toast.success('Embed code copied to clipboard!');
                        }}
                      >
                        Copy
                      </Button>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Button asChild>
              <Link href={`/forms/${form.id}/preview`}>
                <Eye className="mr-2 h-4 w-4" />
                Preview
              </Link>
            </Button>
          </div>
        </div>

        <Card className="p-8">
          <h1 className="text-3xl font-bold mb-2">{form.title}</h1>
          {form.description && <p className="text-muted-foreground mb-8">{form.description}</p>}

          <div className="space-y-6">
            {form.fields.map((field) => (
              <div key={field.id} className="space-y-2">
                <label className="block font-medium">
                  {field.question}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                {field.type === 'text' && (
                  <input
                    type="text"
                    disabled
                    className="w-full p-2 border rounded bg-muted"
                    placeholder="Text answer"
                  />
                )}
                {field.type === 'multiple_choice' && field.options && (
                  <div className="space-y-2">
                    {field.options.map((option: string) => (
                      <label key={option} className="flex items-center">
                        <input type="radio" disabled className="mr-2" />
                        {option}
                      </label>
                    ))}
                  </div>
                )}
                {field.type === 'checkbox' && field.options && (
                  <div className="space-y-2">
                    {field.options.map((option: string) => (
                      <label key={option} className="flex items-center">
                        <input type="checkbox" disabled className="mr-2" />
                        {option}
                      </label>
                    ))}
                  </div>
                )}
                {field.type === 'rating' && (
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        type="button"
                        disabled
                        className="w-10 h-10 border rounded-full bg-muted"
                      >
                        {rating}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </main>
  );
}
