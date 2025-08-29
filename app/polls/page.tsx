'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';

type Poll = {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  votesCount: number;
  isActive: boolean;
};

export default function PollsPage() {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        // TODO: Replace with actual API call
        // Simulate API call with mock data
        const mockPolls: Poll[] = [
          {
            id: '1',
            title: 'Favorite Programming Language',
            description: 'What programming language do you prefer to work with?',
            createdAt: new Date().toISOString(),
            votesCount: 42,
            isActive: true,
          },
          {
            id: '2',
            title: 'Best Frontend Framework',
            description: 'Which frontend framework do you think is the best?',
            createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
            votesCount: 78,
            isActive: true,
          },
          {
            id: '3',
            title: 'Remote Work Preferences',
            description: 'Do you prefer working remotely or in an office?',
            createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
            votesCount: 120,
            isActive: false,
          },
        ];

        setTimeout(() => {
          setPolls(mockPolls);
          setIsLoading(false);
        }, 500); // Simulate loading delay
      } catch (error) {
        console.error('Failed to fetch polls:', error);
        setIsLoading(false);
      }
    };

    fetchPolls();
  }, []);

  return (
    <div className="container py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Polls</h1>
        <Button asChild>
          <Link href="/polls/create">Create New Poll</Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <p>Loading polls...</p>
        </div>
      ) : polls.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-medium">No polls available</h2>
          <p className="text-muted-foreground mt-2">Create a new poll to get started</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {polls.map((poll) => (
            <Link key={poll.id} href={`/polls/${poll.id}`} className="block">
              <Card className="h-full hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">{poll.title}</CardTitle>
                    {poll.isActive ? (
                      <Badge variant="default">Active</Badge>
                    ) : (
                      <Badge variant="outline">Closed</Badge>
                    )}
                  </div>
                  <CardDescription className="line-clamp-2">
                    {poll.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {new Date(poll.createdAt).toLocaleDateString()}
                  </p>
                </CardContent>
                <CardFooter>
                  <p className="text-sm">{poll.votesCount} votes</p>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}