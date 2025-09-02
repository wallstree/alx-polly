import { createPoll, getPoll, getPolls, updatePoll, deletePoll, votePoll } from '../poll-actions';
import { revalidatePath } from 'next/cache';

// Mock next/cache
jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}));

// Reset mocks before each test
beforeEach(() => {
  jest.resetAllMocks();
});

describe('Poll Actions', () => {
  describe('createPoll', () => {
    it('should create a poll with valid data', async () => {
      const pollData = {
        title: 'Test Poll',
        description: 'This is a test poll',
        options: ['Option 1', 'Option 2'],
        isActive: true,
      };

      const result = await createPoll(pollData);

      expect(result).toHaveProperty('id');
      expect(typeof result.id).toBe('string');
      expect(revalidatePath).toHaveBeenCalledWith('/polls');
    });

    it('should throw an error if title is empty', async () => {
      const pollData = {
        title: '',
        description: 'This is a test poll',
        options: ['Option 1', 'Option 2'],
      };

      await expect(createPoll(pollData)).rejects.toThrow('Title is required');
    });

    it('should throw an error if description is empty', async () => {
      const pollData = {
        title: 'Test Poll',
        description: '',
        options: ['Option 1', 'Option 2'],
      };

      await expect(createPoll(pollData)).rejects.toThrow('Description is required');
    });

    it('should throw an error if less than 2 valid options are provided', async () => {
      const pollData = {
        title: 'Test Poll',
        description: 'This is a test poll',
        options: ['Option 1', ''],
      };

      await expect(createPoll(pollData)).rejects.toThrow('At least 2 valid options are required');
    });
  });

  describe('getPoll', () => {
    it('should return a poll when valid ID is provided', async () => {
      const poll = await getPoll('1');

      expect(poll).not.toBeNull();
      expect(poll?.id).toBe('1');
      expect(poll?.title).toBe('Favorite Programming Language');
      expect(poll?.options.length).toBeGreaterThanOrEqual(2);
    });

    it('should return null for non-existent poll', async () => {
      const poll = await getPoll('not_found');
      expect(poll).toBeNull();
    });
  });

  describe('getPolls', () => {
    it('should return an array of polls', async () => {
      const polls = await getPolls();

      expect(Array.isArray(polls)).toBe(true);
      expect(polls.length).toBeGreaterThan(0);
      expect(polls[0]).toHaveProperty('id');
      expect(polls[0]).toHaveProperty('title');
      expect(polls[0]).toHaveProperty('options');
    });
  });

  describe('updatePoll', () => {
    it('should update a poll with valid data', async () => {
      const pollData = {
        id: '1',
        title: 'Updated Poll',
        description: 'This is an updated poll',
        options: [
          { id: 'opt1', text: 'Option 1', votes: 5 },
          { id: 'opt2', text: 'Option 2', votes: 3 },
        ],
        isActive: true,
      };

      await expect(updatePoll(pollData)).resolves.not.toThrow();
      expect(revalidatePath).toHaveBeenCalledWith('/polls');
      expect(revalidatePath).toHaveBeenCalledWith('/polls/1');
    });

    it('should throw an error if poll ID is missing', async () => {
      const pollData = {
        id: '',
        title: 'Updated Poll',
        description: 'This is an updated poll',
        options: [
          { id: 'opt1', text: 'Option 1', votes: 5 },
          { id: 'opt2', text: 'Option 2', votes: 3 },
        ],
        isActive: true,
      };

      await expect(updatePoll(pollData)).rejects.toThrow('Poll ID is required');
    });

    it('should throw an error if title is empty', async () => {
      const pollData = {
        id: '1',
        title: '',
        description: 'This is an updated poll',
        options: [
          { id: 'opt1', text: 'Option 1', votes: 5 },
          { id: 'opt2', text: 'Option 2', votes: 3 },
        ],
        isActive: true,
      };

      await expect(updatePoll(pollData)).rejects.toThrow('Title is required');
    });

    it('should throw an error if less than 2 options are provided', async () => {
      const pollData = {
        id: '1',
        title: 'Updated Poll',
        description: 'This is an updated poll',
        options: [
          { id: 'opt1', text: 'Option 1', votes: 5 },
        ],
        isActive: true,
      };

      await expect(updatePoll(pollData)).rejects.toThrow('At least 2 options are required');
    });
  });

  describe('deletePoll', () => {
    it('should delete a poll with valid ID', async () => {
      await expect(deletePoll('1')).resolves.not.toThrow();
      expect(revalidatePath).toHaveBeenCalledWith('/polls');
    });

    it('should throw an error if poll ID is missing', async () => {
      await expect(deletePoll('')).rejects.toThrow('Poll ID is required');
    });
  });

  describe('votePoll', () => {
    it('should register a vote with valid data', async () => {
      const voteData = {
        pollId: '1',
        optionId: 'opt1',
      };

      await expect(votePoll(voteData)).resolves.not.toThrow();
      expect(revalidatePath).toHaveBeenCalledWith('/polls/1');
    });

    it('should throw an error if poll ID is missing', async () => {
      const voteData = {
        pollId: '',
        optionId: 'opt1',
      };

      await expect(votePoll(voteData)).rejects.toThrow('Poll ID is required');
    });

    it('should throw an error if option ID is missing', async () => {
      const voteData = {
        pollId: '1',
        optionId: '',
      };

      await expect(votePoll(voteData)).rejects.toThrow('Option ID is required');
    });
  });
});