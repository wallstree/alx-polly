'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '../../../../components/ui/button';
import { EditPollForm } from '../../../components/EditPollForm';
import { Poll } from '../../../types';

type EditPollPageProps = {
  params: {
    id: string;
  };
};

export default function EditPollPage({ params }: EditPollPageProps) {
  const router = useRouter();
  const [poll, setPoll] = useState<Poll | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPoll = async () => {
      try {
        // TODO: Replace with actual API call
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Mock data for now
        setPoll({
          id: params.id,
          title: 'Sample Poll',
          description: 'This is a sample poll description',
          createdAt: new Date().toISOString(),
          options: [
            { id: '1', text: 'Option 1', votes: 5 },
            { id: '2', text: 'Option 2', votes: 3 },
          ],
          totalVotes: 8,
          isActive: true
        });
      } catch (err) {
        console.error('Failed to fetch poll:', err);
        setError('Failed to load poll data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPoll();
  }, [params.id]);

  const handleSubmit = async (pollData: any) => {
    setIsSubmitting(true);

    try {
      // TODO: Replace with actual API call
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Redirect to poll page after successful update
      router.push(`/polls/${params.id}`);
    } catch (err) {
      console.error('Failed to update poll:', err);
      throw new Error('Failed to update poll. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container py-6 max-w-2xl">
        <p>Loading poll data...</p>
      </div>
    );
  }

  if (error || !poll) {
    return (
      <div className="container py-6 max-w-2xl">
        <p className="text-red-500">{error || 'Poll not found'}</p>
        <Button variant="outline" onClick={() => router.push('/polls')} className="mt-4">
          Back to Polls
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-6 max-w-2xl">
      <Button variant="outline" onClick={() => router.push(`/polls/${params.id}`)} className="mb-4">
        ← Back to Poll
      </Button>
      
      <EditPollForm poll={poll} onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </div>
  );
}