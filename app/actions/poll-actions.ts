'use server';

import { revalidatePath } from 'next/cache';
import { Poll, Option } from '../types';

// Type for creating a new poll
type CreatePollData = {
  title: string;
  description: string;
  options: string[];
  isActive?: boolean;
};

// Type for updating an existing poll
type UpdatePollData = {
  id: string;
  title: string;
  description: string;
  options: Option[];
  isActive: boolean;
};

// Type for voting on a poll
type VoteData = {
  pollId: string;
  optionId: string;
};

/**
 * Create a new poll
 */
export async function createPoll(data: CreatePollData): Promise<{ id: string }> {
  // Validate input
  if (!data.title.trim()) {
    throw new Error('Title is required');
  }

  if (!data.description.trim()) {
    throw new Error('Description is required');
  }

  const validOptions = data.options.filter(opt => opt.trim() !== '');
  if (validOptions.length < 2) {
    throw new Error('At least 2 valid options are required');
  }

  try {
    // TODO: Replace with actual Supabase implementation
    // This is a mock implementation
    console.log('Creating poll:', data);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock response with a generated ID
    const newPollId = `poll_${Date.now()}`;
    
    // Revalidate the polls page to show the new poll
    revalidatePath('/polls');
    
    return { id: newPollId };
  } catch (error) {
    console.error('Failed to create poll:', error);
    throw new Error('Failed to create poll');
  }
}

/**
 * Get a poll by ID
 */
export async function getPoll(id: string): Promise<Poll | null> {
  try {
    // TODO: Replace with actual Supabase implementation
    // This is a mock implementation
    console.log('Fetching poll:', id);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Return mock data
    if (id === 'not_found') {
      return null;
    }
    
    return {
      id,
      title: id === '1' ? 'Favorite Programming Language' : 'Sample Poll',
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
  } catch (error) {
    console.error('Failed to fetch poll:', error);
    throw new Error('Failed to fetch poll');
  }
}

/**
 * Get all polls
 */
export async function getPolls(): Promise<Poll[]> {
  try {
    // TODO: Replace with actual Supabase implementation
    // This is a mock implementation
    console.log('Fetching all polls');
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Return mock data
    return [
      {
        id: '1',
        title: 'Favorite Programming Language',
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
      },
      {
        id: '2',
        title: 'Best Frontend Framework',
        description: 'Which frontend framework do you think is the best?',
        createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        options: [
          { id: 'opt1', text: 'React', votes: 25 },
          { id: 'opt2', text: 'Vue', votes: 18 },
          { id: 'opt3', text: 'Angular', votes: 15 },
          { id: 'opt4', text: 'Svelte', votes: 20 },
        ],
        totalVotes: 78,
        isActive: true,
      },
    ];
  } catch (error) {
    console.error('Failed to fetch polls:', error);
    throw new Error('Failed to fetch polls');
  }
}

/**
 * Update an existing poll
 */
export async function updatePoll(data: UpdatePollData): Promise<void> {
  // Validate input
  if (!data.id) {
    throw new Error('Poll ID is required');
  }
  
  if (!data.title.trim()) {
    throw new Error('Title is required');
  }

  if (!data.description.trim()) {
    throw new Error('Description is required');
  }

  if (data.options.length < 2) {
    throw new Error('At least 2 options are required');
  }

  try {
    // TODO: Replace with actual Supabase implementation
    // This is a mock implementation
    console.log('Updating poll:', data);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Revalidate both the polls list and the specific poll page
    revalidatePath('/polls');
    revalidatePath(`/polls/${data.id}`);
  } catch (error) {
    console.error('Failed to update poll:', error);
    throw new Error('Failed to update poll');
  }
}

/**
 * Delete a poll
 */
export async function deletePoll(id: string): Promise<void> {
  if (!id) {
    throw new Error('Poll ID is required');
  }

  try {
    // TODO: Replace with actual Supabase implementation
    // This is a mock implementation
    console.log('Deleting poll:', id);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Revalidate the polls page
    revalidatePath('/polls');
  } catch (error) {
    console.error('Failed to delete poll:', error);
    throw new Error('Failed to delete poll');
  }
}

/**
 * Vote on a poll
 */
export async function votePoll(data: VoteData): Promise<void> {
  if (!data.pollId) {
    throw new Error('Poll ID is required');
  }

  if (!data.optionId) {
    throw new Error('Option ID is required');
  }

  try {
    // TODO: Replace with actual Supabase implementation
    // This is a mock implementation
    console.log('Voting on poll:', data);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Revalidate the poll page to show updated votes
    revalidatePath(`/polls/${data.pollId}`);
  } catch (error) {
    console.error('Failed to submit vote:', error);
    throw new Error('Failed to submit vote');
  }
}