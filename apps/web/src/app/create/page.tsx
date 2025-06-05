'use client';

import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Wand2, Eye, Save, Pencil, Trash2, Plus } from 'lucide-react';
import { toast } from 'sonner';

interface FormField {
  id: string;
  type: 'text' | 'multiple_choice' | 'checkbox' | 'rating';
  question: string;
  options?: string[];
  required: boolean;
}

export default function CreatePage(): JSX.Element {
  const [prompt, setPrompt] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [formFields, setFormFields] = useState<FormField[]>([]);
  const [isPreviewMode, setIsPreviewMode] = useState<boolean>(false);
  const [editingField, setEditingField] = useState<string | null>(null);

  const handleGenerateForm = async (): Promise<void> => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate form');
      }

      const data = await response.json();
      setFormFields(data.fields);
      toast.success('Form generated successfully!');
    } catch (error) {
      console.error('Error generating form:', error);
      toast.error('Failed to generate form. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveForm = async (): Promise<void> => {
    try {
      const formData = {
        title: prompt,
        description: 'AI-generated form',
        fields: formFields,
      };

      const response = await fetch('/api/forms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to save form');
      }

      const savedForm = await response.json();
      toast.success('Form saved successfully!');

      // Redirect to form view
      window.location.href = `/forms/${savedForm.id}`;
    } catch (error) {
      console.error('Error saving form:', error);
      toast.error('Failed to save form. Please try again.');
    }
  };

  const handleEditField = (fieldId: string): void => {
    setEditingField(fieldId);
  };

  const handleUpdateField = (fieldId: string, updates: Partial<FormField>): void => {
    setFormFields((fields) =>
      fields.map((field) => (field.id === fieldId ? { ...field, ...updates } : field))
    );
    setEditingField(null);
  };

  const handleDeleteField = (fieldId: string): void => {
    setFormFields((fields) => fields.filter((field) => field.id !== fieldId));
    toast.success('Field deleted successfully!');
  };

  const handleAddField = (): void => {
    const newField: FormField = {
      id: `field-${Date.now()}`,
      type: 'text',
      question: 'New Question',
      required: false,
    };
    setFormFields([...formFields, newField]);
    setEditingField(newField.id);
  };

  return (
    <main className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Create New Form</h1>
        <div className="flex gap-4">
          <Button variant="outline" onClick={() => setIsPreviewMode(!isPreviewMode)}>
            <Eye className="mr-2 h-4 w-4" />
            {isPreviewMode ? 'Edit Mode' : 'Preview Mode'}
          </Button>
          <Button onClick={handleSaveForm}>
            <Save className="mr-2 h-4 w-4" />
            Save Form
          </Button>
        </div>
      </div>

      {!isPreviewMode ? (
        <div className="grid gap-8 md:grid-cols-2">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Form Prompt</h2>
            <Textarea
              placeholder="Describe the form you want to create. For example: 'Create a customer feedback form with questions about product satisfaction, service quality, and suggestions for improvement.'"
              className="min-h-[200px] mb-4"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <Button
              onClick={handleGenerateForm}
              disabled={isGenerating || !prompt.trim()}
              className="w-full"
            >
              <Wand2 className="mr-2 h-4 w-4" />
              {isGenerating ? 'Generating...' : 'Generate Form'}
            </Button>
          </Card>

          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Generated Form</h2>
              <Button variant="outline" size="sm" onClick={handleAddField}>
                <Plus className="mr-2 h-4 w-4" />
                Add Field
              </Button>
            </div>
            {formFields.length > 0 ? (
              <div className="space-y-4">
                {formFields.map((field) => (
                  <div key={field.id} className="p-4 border rounded-lg">
                    {editingField === field.id ? (
                      <div className="space-y-4">
                        <input
                          type="text"
                          className="w-full p-2 border rounded"
                          value={field.question}
                          onChange={(e) =>
                            handleUpdateField(field.id, { question: e.target.value })
                          }
                        />
                        <select
                          className="w-full p-2 border rounded"
                          value={field.type}
                          onChange={(e) =>
                            handleUpdateField(field.id, {
                              type: e.target.value as FormField['type'],
                            })
                          }
                        >
                          <option value="text">Text</option>
                          <option value="multiple_choice">Multiple Choice</option>
                          <option value="checkbox">Checkbox</option>
                          <option value="rating">Rating</option>
                        </select>
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={field.required}
                            onChange={(e) =>
                              handleUpdateField(field.id, { required: e.target.checked })
                            }
                          />
                          <label>Required</label>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => setEditingField(null)}>
                          Done
                        </Button>
                      </div>
                    ) : (
                      <>
                        <div className="flex justify-between items-start mb-2">
                          <p className="font-medium">{field.question}</p>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditField(field.id)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteField(field.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        {field.type === 'text' && (
                          <input
                            type="text"
                            className="w-full p-2 border rounded"
                            placeholder="Type your answer here..."
                            disabled
                          />
                        )}
                        {field.type === 'multiple_choice' && field.options && (
                          <div className="space-y-2">
                            {field.options.map((option) => (
                              <label key={option} className="flex items-center">
                                <input type="radio" name={field.id} className="mr-2" disabled />
                                {option}
                              </label>
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                Your generated form will appear here
              </p>
            )}
          </Card>
        </div>
      ) : (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Form Preview</h2>
          {formFields.length > 0 ? (
            <div className="space-y-6">
              {formFields.map((field) => (
                <div key={field.id} className="space-y-2">
                  <label className="block font-medium">
                    {field.question}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  {field.type === 'text' && (
                    <input
                      type="text"
                      className="w-full p-2 border rounded"
                      placeholder="Type your answer here..."
                    />
                  )}
                  {field.type === 'multiple_choice' && field.options && (
                    <div className="space-y-2">
                      {field.options.map((option) => (
                        <label key={option} className="flex items-center">
                          <input type="radio" name={field.id} className="mr-2" />
                          {option}
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">
              Generate a form to see the preview
            </p>
          )}
        </Card>
      )}
    </main>
  );
}
