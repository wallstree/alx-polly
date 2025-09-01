'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/card';
import { Label } from '../../components/ui/label';
import { PlusCircle, X } from 'lucide-react';
import { Poll, Option } from '../types';

type EditPollFormProps = {
  poll?: Poll;
  onSubmit: (pollData: Omit<Poll, 'id' | 'createdAt' | 'totalVotes'>) => Promise<void>;
  isSubmitting?: boolean;
};

export function EditPollForm({ poll, onSubmit, isSubmitting = false }: EditPollFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(poll?.title || '');
  const [description, setDescription] = useState(poll?.description || '');
  const [options, setOptions] = useState<string[]>(
    poll?.options?.map(opt => opt.text) || ['', '']
  );
  const [isActive, setIsActive] = useState(poll?.isActive ?? true);
  const [error, setError] = useState('');

  const addOption = () => {
    setOptions([...options, '']);
  };

  const removeOption = (index: number) => {
    if (options.length <= 2) {
      setError('A poll must have at least 2 options');
      return;
    }
    
    setError('');
    const newOptions = [...options];
    newOptions.splice(index, 1);
    setOptions(newOptions);
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate form
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    if (!description.trim()) {
      setError('Description is required');
      return;
    }

    const validOptions = options.filter(opt => opt.trim() !== '');
    if (validOptions.length < 2) {
      setError('At least 2 valid options are required');
      return;
    }

    try {
      // Create poll options in the format expected by the API
      const formattedOptions = validOptions.map((text, index) => ({
        id: poll?.options?.[index]?.id || `opt${index + 1}`,
        text,
        votes: poll?.options?.[index]?.votes || 0,
      }));

      // Submit the poll data
      await onSubmit({
        title,
        description,
        options: formattedOptions,
        isActive,
      });

    } catch (error) {
      console.error('Failed to submit poll:', error);
      setError('Failed to submit poll. Please try again.');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">{poll ? 'Edit Poll' : 'Create New Poll'}</CardTitle>
        <CardDescription>
          {poll ? 'Update your poll details' : 'Fill out the form below to create a new poll'}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Poll Title</Label>
            <Input
              id="title"
              placeholder="Enter a question for your poll"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Provide more context for your poll"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              required
            />
          </div>

          <div className="space-y-3">
            <Label>Poll Options</Label>
            {options.map((option, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  placeholder={`Option ${index + 1}`}
                  value={option}
                  onChange={(e) => updateOption(index, e.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeOption(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              className="w-full mt-2"
              onClick={addOption}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Option
            </Button>
          </div>

          {error && (
            <div className="text-sm text-red-500">
              {error}
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (poll ? 'Updating Poll...' : 'Creating Poll...') : (poll ? 'Update Poll' : 'Create Poll')}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}