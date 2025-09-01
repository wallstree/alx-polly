// Poll and Option type definitions

export type Option = {
  id: string;
  text: string;
  votes: number;
};

export type Poll = {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  options: Option[];
  totalVotes: number;
  isActive: boolean;
};

// List view poll type (simplified version of Poll)
export type ListPoll = {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  votesCount: number;
  isActive: boolean;
};