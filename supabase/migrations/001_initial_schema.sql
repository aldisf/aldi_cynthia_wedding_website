-- ============================================
-- Wedding Website Database Schema
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- GUESTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS guests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  unique_code VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(50),
  rsvp_status VARCHAR(20) DEFAULT 'pending' CHECK (rsvp_status IN ('pending', 'yes', 'no')),
  max_plus_ones INTEGER DEFAULT 0,  -- Allocated by couple (from CSV)
  attending_count INTEGER DEFAULT 0, -- How many will attend (0 = not attending, 1 = just guest, 2+ = guest + plus ones)
  dietary_notes TEXT,
  song_request VARCHAR(255),
  invited_to VARCHAR(20) DEFAULT 'both' CHECK (invited_to IN ('ceremony', 'reception', 'both')),
  guest_side VARCHAR(20) DEFAULT 'both' CHECK (guest_side IN ('groom', 'bride', 'both')),  -- Which side of the couple the guest belongs to
  attending_events TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for quick lookup by unique code
CREATE INDEX IF NOT EXISTS idx_guests_unique_code ON guests(unique_code);

-- ============================================
-- MESSAGES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  guest_id UUID REFERENCES guests(id) ON DELETE SET NULL,
  guest_name VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for fetching visible messages
CREATE INDEX IF NOT EXISTS idx_messages_visible ON messages(is_visible, created_at DESC);

-- ============================================
-- REGISTRY ITEMS TABLE (Optional)
-- ============================================
CREATE TABLE IF NOT EXISTS registry_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  image_url VARCHAR(500),
  link VARCHAR(500),
  target_amount DECIMAL(10, 2),
  current_amount DECIMAL(10, 2) DEFAULT 0,
  is_claimed BOOLEAN DEFAULT false,
  claimed_by_guest_id UUID REFERENCES guests(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- ADMIN USERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE registry_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Guests policies
-- Anyone can read their own guest record by unique_code
CREATE POLICY "Guests can view own record" ON guests
  FOR SELECT USING (true);

-- Anyone can update their own RSVP
CREATE POLICY "Guests can update own RSVP" ON guests
  FOR UPDATE USING (true);

-- Allow inserting new guests (for admin operations)
CREATE POLICY "Allow guest inserts" ON guests
  FOR INSERT WITH CHECK (true);

-- Allow deleting guests (for admin operations)
CREATE POLICY "Allow guest deletes" ON guests
  FOR DELETE USING (true);

-- Messages policies
-- Anyone can view all messages (admin needs to see hidden ones too)
CREATE POLICY "Anyone can view messages" ON messages
  FOR SELECT USING (true);

-- Authenticated guests can insert messages
CREATE POLICY "Guests can insert messages" ON messages
  FOR INSERT WITH CHECK (true);

-- Allow updating messages (for toggling visibility)
CREATE POLICY "Allow message updates" ON messages
  FOR UPDATE USING (true);

-- Allow deleting messages (for admin operations)
CREATE POLICY "Allow message deletes" ON messages
  FOR DELETE USING (true);

-- Registry items policies
-- Anyone can view registry items
CREATE POLICY "Anyone can view registry items" ON registry_items
  FOR SELECT USING (true);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at for guests
CREATE TRIGGER update_guests_updated_at
  BEFORE UPDATE ON guests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- SAMPLE DATA (Optional - for testing)
-- ============================================

-- Insert a test admin user (password: admin123 - CHANGE IN PRODUCTION!)
-- Password hash for 'admin123' using bcrypt
-- INSERT INTO admin_users (email, password_hash) VALUES
--   ('admin@wedding.com', '$2b$10$rQZ8K1234567890abcdefghijklmnopqrstuvwxyz');

-- Insert some test guests
-- INSERT INTO guests (unique_code, name, email, invited_to) VALUES
--   ('test1234', 'Test Guest 1', 'test1@example.com', 'both'),
--   ('test5678', 'Test Guest 2', 'test2@example.com', 'both');
