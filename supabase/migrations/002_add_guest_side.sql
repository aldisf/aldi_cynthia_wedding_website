-- ============================================
-- Migration: Add guest_side column to guests table
-- Run this in Supabase SQL Editor
-- ============================================

-- Add guest_side column if it doesn't exist
ALTER TABLE guests 
ADD COLUMN IF NOT EXISTS guest_side VARCHAR(20) DEFAULT 'both';

-- Add check constraint (only if it doesn't exist)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'guests_guest_side_check'
  ) THEN
    ALTER TABLE guests ADD CONSTRAINT guests_guest_side_check 
    CHECK (guest_side IN ('groom', 'bride', 'both'));
  END IF;
END $$;

-- Optional: Update any NULL values to 'both'
UPDATE guests SET guest_side = 'both' WHERE guest_side IS NULL;
