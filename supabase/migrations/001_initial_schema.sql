-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create polls table
CREATE TABLE polls (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  allow_anonymous BOOLEAN DEFAULT true,
  multiple_choice BOOLEAN DEFAULT false,
  qr_code_url TEXT
);

-- Create poll_options table
CREATE TABLE poll_options (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  poll_id UUID REFERENCES polls(id) ON DELETE CASCADE,
  option_text VARCHAR(500) NOT NULL,
  option_order INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create votes table
CREATE TABLE votes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  poll_id UUID REFERENCES polls(id) ON DELETE CASCADE,
  option_id UUID REFERENCES poll_options(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  voter_ip INET,
  voter_fingerprint TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_polls_created_by ON polls(created_by);
CREATE INDEX idx_polls_created_at ON polls(created_at);
CREATE INDEX idx_polls_is_active ON polls(is_active);
CREATE INDEX idx_poll_options_poll_id ON poll_options(poll_id);
CREATE INDEX idx_votes_poll_id ON votes(poll_id);
CREATE INDEX idx_votes_option_id ON votes(option_id);
CREATE INDEX idx_votes_user_id ON votes(user_id);
CREATE INDEX idx_votes_voter_ip ON votes(voter_ip);

-- Create a composite unique index to prevent duplicate votes from same user/IP
CREATE UNIQUE INDEX idx_votes_unique_user ON votes(poll_id, user_id) WHERE user_id IS NOT NULL;
CREATE UNIQUE INDEX idx_votes_unique_anonymous ON votes(poll_id, voter_ip, voter_fingerprint) WHERE user_id IS NULL;

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for polls updated_at
CREATE TRIGGER update_polls_updated_at
  BEFORE UPDATE ON polls
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE poll_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for polls table
-- Anyone can read active polls
CREATE POLICY "Anyone can view active polls" ON polls
  FOR SELECT USING (is_active = true);

-- Users can create their own polls
CREATE POLICY "Users can create polls" ON polls
  FOR INSERT WITH CHECK (auth.uid() = created_by);

-- Users can update their own polls
CREATE POLICY "Users can update own polls" ON polls
  FOR UPDATE USING (auth.uid() = created_by);

-- Users can delete their own polls
CREATE POLICY "Users can delete own polls" ON polls
  FOR DELETE USING (auth.uid() = created_by);

-- RLS Policies for poll_options table
-- Anyone can read poll options for active polls
CREATE POLICY "Anyone can view poll options" ON poll_options
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM polls 
      WHERE polls.id = poll_options.poll_id 
      AND polls.is_active = true
    )
  );

-- Poll creators can insert options for their polls
CREATE POLICY "Poll creators can add options" ON poll_options
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM polls 
      WHERE polls.id = poll_options.poll_id 
      AND polls.created_by = auth.uid()
    )
  );

-- Poll creators can update options for their polls
CREATE POLICY "Poll creators can update options" ON poll_options
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM polls 
      WHERE polls.id = poll_options.poll_id 
      AND polls.created_by = auth.uid()
    )
  );

-- Poll creators can delete options for their polls
CREATE POLICY "Poll creators can delete options" ON poll_options
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM polls 
      WHERE polls.id = poll_options.poll_id 
      AND polls.created_by = auth.uid()
    )
  );

-- RLS Policies for votes table
-- Anyone can read vote counts (aggregated)
CREATE POLICY "Anyone can view votes" ON votes
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM polls 
      WHERE polls.id = votes.poll_id 
      AND polls.is_active = true
    )
  );

-- Authenticated users can vote (with user_id)
CREATE POLICY "Authenticated users can vote" ON votes
  FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL 
    AND user_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM polls 
      WHERE polls.id = votes.poll_id 
      AND polls.is_active = true
      AND (polls.expires_at IS NULL OR polls.expires_at > NOW())
    )
  );

-- Anonymous users can vote (without user_id) if poll allows it
CREATE POLICY "Anonymous users can vote" ON votes
  FOR INSERT WITH CHECK (
    user_id IS NULL
    AND EXISTS (
      SELECT 1 FROM polls 
      WHERE polls.id = votes.poll_id 
      AND polls.is_active = true 
      AND polls.allow_anonymous = true
      AND (polls.expires_at IS NULL OR polls.expires_at > NOW())
    )
  );

-- Create a view for poll results with vote counts
CREATE VIEW poll_results AS
SELECT 
  p.id as poll_id,
  p.title,
  p.description,
  p.created_at,
  p.expires_at,
  p.allow_anonymous,
  p.multiple_choice,
  po.id as option_id,
  po.option_text,
  po.option_order,
  COALESCE(vote_counts.vote_count, 0) as vote_count
FROM polls p
LEFT JOIN poll_options po ON p.id = po.poll_id
LEFT JOIN (
  SELECT 
    option_id, 
    COUNT(*) as vote_count
  FROM votes 
  GROUP BY option_id
) vote_counts ON po.id = vote_counts.option_id
WHERE p.is_active = true
ORDER BY p.created_at DESC, po.option_order ASC;

-- Grant necessary permissions
GRANT SELECT ON poll_results TO authenticated, anon;
GRANT ALL ON polls TO authenticated;
GRANT ALL ON poll_options TO authenticated;
GRANT ALL ON votes TO authenticated, anon;

-- Create function to get poll with options and vote counts
CREATE OR REPLACE FUNCTION get_poll_with_results(poll_uuid UUID)
RETURNS TABLE (
  poll_id UUID,
  title VARCHAR,
  description TEXT,
  created_by UUID,
  created_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  allow_anonymous BOOLEAN,
  multiple_choice BOOLEAN,
  option_id UUID,
  option_text VARCHAR,
  option_order INTEGER,
  vote_count BIGINT
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.title,
    p.description,
    p.created_by,
    p.created_at,
    p.expires_at,
    p.allow_anonymous,
    p.multiple_choice,
    po.id,
    po.option_text,
    po.option_order,
    COALESCE(COUNT(v.id), 0)::BIGINT
  FROM polls p
  LEFT JOIN poll_options po ON p.id = po.poll_id
  LEFT JOIN votes v ON po.id = v.option_id
  WHERE p.id = poll_uuid AND p.is_active = true
  GROUP BY p.id, p.title, p.description, p.created_by, p.created_at, p.expires_at, p.allow_anonymous, p.multiple_choice, po.id, po.option_text, po.option_order
  ORDER BY po.option_order;
END;
$$;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION get_poll_with_results(UUID) TO authenticated, anon;