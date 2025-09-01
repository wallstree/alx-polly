'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '../../../components/ui/button';
import { EditPollForm } from '../../components/EditPollForm';

export default function CreatePollPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (pollData: any) => {
    setIsSubmitting(true);

    try {
      // TODO: Replace with actual API call
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Redirect to polls page after successful creation
      router.push('/polls');
    } catch (error) {
      console.error('Failed to create poll:', error);
      throw new Error('Failed to create poll. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container py-6 max-w-2xl">
      <Button variant="outline" onClick={() => router.push('/polls')} className="mb-4">
        ← Back to Polls
      </Button>
      
      <EditPollForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </div>
  );
}