-- Run this in your Supabase SQL Editor to enable atomic view count increments.
-- The app falls back to fetch+update if this function doesn't exist.

CREATE OR REPLACE FUNCTION increment_view_count(proposal_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE proposals
  SET view_count = COALESCE(view_count, 0) + 1
  WHERE id = proposal_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add signature column for proposal signing
ALTER TABLE proposals ADD COLUMN IF NOT EXISTS signature JSONB DEFAULT NULL;
