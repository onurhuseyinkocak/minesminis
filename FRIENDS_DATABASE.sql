-- Friends & Weekly Challenge Social System
-- Run this migration in your Supabase SQL editor

CREATE TABLE IF NOT EXISTS public.friends (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  friend_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'accepted')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, friend_id)
);

-- Enable Row Level Security
ALTER TABLE public.friends ENABLE ROW LEVEL SECURITY;

-- Users can see their own friend rows (both directions)
CREATE POLICY "Users can view own friend rows" ON public.friends
  FOR SELECT
  USING (auth.uid() = user_id OR auth.uid() = friend_id);

-- Users can insert friend requests where they are the requester
CREATE POLICY "Users can send friend requests" ON public.friends
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update rows where they are the recipient (to accept)
CREATE POLICY "Users can accept friend requests" ON public.friends
  FOR UPDATE
  USING (auth.uid() = friend_id);

-- Users can delete their own rows
CREATE POLICY "Users can remove friends" ON public.friends
  FOR DELETE
  USING (auth.uid() = user_id OR auth.uid() = friend_id);
