-- Fix RLS policies for portfolio_skills table
ALTER TABLE portfolio_skills ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Allow public read access" ON portfolio_skills;
DROP POLICY IF EXISTS "Allow authenticated users to insert" ON portfolio_skills;
DROP POLICY IF EXISTS "Allow authenticated users to update" ON portfolio_skills;
DROP POLICY IF EXISTS "Allow authenticated users to delete" ON portfolio_skills;

-- Create new policies
CREATE POLICY "Allow public read access" ON portfolio_skills
  FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to insert" ON portfolio_skills
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update" ON portfolio_skills
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete" ON portfolio_skills
  FOR DELETE TO authenticated USING (true);
