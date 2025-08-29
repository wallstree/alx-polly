'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../../components/ui/card';
import { RadioGroup, RadioGroupItem } from '../../../components/ui/radio-group';
import { Label } from '../../../components/ui/label';
import { Badge } from '../../../components/ui/badge';

type Option = {
  id: string;
  text: string;
  votes: number;
};

type Poll = {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  options: Option[];
  totalVotes: number;
  isActive: boolean;
};

export default function PollPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [poll, setPoll] = useState<Poll | null>(null);
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);

  useEffect(() => {
    const fetchPoll = async () => {
      try {
        // TODO: Replace with actual API call
        // Simulate API call with mock data
        const mockPoll: Poll = {
          id: params.id,
          title: params.id === '1' ? 'Favorite Programming Language' : 'Sample Poll',
          description: 'What programming language do you prefer to work with?',
          createdAt: new Date().toISOString(),
          options: [
            { id: 'opt1', text: 'JavaScript', votes: 15 },
            { id: 'opt2', text: 'Python', votes: 12 },
            { id: 'opt3', text: 'TypeScript', votes: 8 },
            { id: 'opt4', text: 'Rust', votes: 7 },
          ],
          totalVotes: 42,
          isActive: true,
        };

        setTimeout(() => {
          setPoll(mockPoll);
          setIsLoading(false);
        }, 500); // Simulate loading delay
      } catch (error) {
        console.error('Failed to fetch poll:', error);
        setIsLoading(false);
      }
    };

    fetchPoll();
  }, [params.id]);

  const handleVote = async () => {
    if (!selectedOption || !poll?.isActive) return;

    setIsSubmitting(true);

    try {
      // TODO: Replace with actual API call
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Update local state to reflect the vote
      setPoll(prevPoll => {
        if (!prevPoll) return null;

        const updatedOptions = prevPoll.options.map(option => {
          if (option.id === selectedOption) {
            return { ...option, votes: option.votes + 1 };
          }
          return option;
        });

        return {
          ...prevPoll,
          options: updatedOptions,
          totalVotes: prevPoll.totalVotes + 1,
        };
      });

      setHasVoted(true);
    } catch (error) {
      console.error('Failed to submit vote:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container py-6 flex justify-center items-center min-h-[300px]">
        <p>Loading poll...</p>
      </div>
    );
  }

  if (!poll) {
    return (
      <div className="container py-6">
        <h1 className="text-2xl font-bold">Poll not found</h1>
        <Button className="mt-4" onClick={() => router.push('/polls')}>
          Back to Polls
        </Button>
      </div>
    );
  }

  const calculatePercentage = (votes: number) => {
    if (poll.totalVotes === 0) return 0;
    return Math.round((votes / poll.totalVotes) * 100);
  };

  return (
    <div className="container py-6 max-w-3xl">
      <Button variant="outline" onClick={() => router.push('/polls')} className="mb-4">
        ← Back to Polls
      </Button>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="text-2xl">{poll.title}</CardTitle>
            {poll.isActive ? (
              <Badge variant="default">Active</Badge>
            ) : (
              <Badge variant="outline">Closed</Badge>
            )}
          </div>
          <CardDescription className="text-base">
            {poll.description}
          </CardDescription>
          <p className="text-sm text-muted-foreground">
            Created on {new Date(poll.createdAt).toLocaleDateString()}
          </p>
        </CardHeader>
        <CardContent>
          {hasVoted ? (
            <div className="space-y-4">
              <h3 className="font-medium">Results:</h3>
              {poll.options.map((option) => {
                const percentage = calculatePercentage(option.votes);
                return (
                  <div key={option.id} className="space-y-1">
                    <div className="flex justify-between">
                      <span>{option.text}</span>
                      <span>{percentage}% ({option.votes} votes)</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2.5">
                      <div
                        className="bg-primary h-2.5 rounded-full"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
              <p className="text-sm text-muted-foreground pt-2">
                Total votes: {poll.totalVotes}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="font-medium">Cast your vote:</h3>
              <RadioGroup value={selectedOption} onValueChange={setSelectedOption}>
                {poll.options.map((option) => (
                  <div key={option.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={option.id} id={option.id} disabled={!poll.isActive} />
                    <Label htmlFor={option.id}>{option.text}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          )}
        </CardContent>
        <CardFooter>
          {!hasVoted && (
            <Button 
              onClick={handleVote} 
              disabled={!selectedOption || isSubmitting || !poll.isActive}
              className="w-full"
            >
              {isSubmitting ? 'Submitting...' : 'Vote'}
            </Button>
          )}
          {!poll.isActive && !hasVoted && (
            <p className="text-sm text-muted-foreground mt-2">
              This poll is closed and no longer accepting votes.
            </p>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}