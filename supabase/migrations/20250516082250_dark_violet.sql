/*
  # Initial schema setup for NBCR application

  1. New Tables
    - `repositories`
      - `id` (uuid, primary key)
      - `name` (text)
      - `full_name` (text)
      - `description` (text)
      - `is_nbcr_enabled` (boolean)
      - `default_branch` (text)
      - `nbcr_enabled_branches` (text[])
      - `avatar_url` (text)
      - `updated_at` (timestamp)
      - `user_id` (uuid, foreign key)

    - `pull_requests`
      - `id` (uuid, primary key)
      - `number` (integer)
      - `title` (text)
      - `repository_id` (uuid, foreign key)
      - `author_id` (uuid, foreign key)
      - `created_at` (timestamp)
      - `merged_at` (timestamp)
      - `status` (text)
      - `review_status` (text)
      - `is_merged_before_review` (boolean)

    - `reviewers`
      - `id` (uuid, primary key)
      - `pull_request_id` (uuid, foreign key)
      - `user_id` (uuid, foreign key)
      - `status` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create repositories table
CREATE TABLE repositories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  full_name text NOT NULL,
  description text,
  is_nbcr_enabled boolean DEFAULT false,
  default_branch text NOT NULL,
  nbcr_enabled_branches text[] DEFAULT '{}',
  avatar_url text,
  updated_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create pull_requests table
CREATE TABLE pull_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  number integer NOT NULL,
  title text NOT NULL,
  repository_id uuid REFERENCES repositories(id) NOT NULL,
  author_id uuid REFERENCES auth.users(id) NOT NULL,
  created_at timestamptz DEFAULT now(),
  merged_at timestamptz,
  status text NOT NULL,
  review_status text NOT NULL,
  is_merged_before_review boolean DEFAULT false
);

-- Create reviewers table
CREATE TABLE reviewers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pull_request_id uuid REFERENCES pull_requests(id) NOT NULL,
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  status text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE repositories ENABLE ROW LEVEL SECURITY;
ALTER TABLE pull_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviewers ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own repositories"
  ON repositories
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own repositories"
  ON repositories
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own repositories"
  ON repositories
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can read pull requests they're involved with"
  ON pull_requests
  FOR SELECT
  TO authenticated
  USING (
    author_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM reviewers
      WHERE pull_requests.id = reviewers.pull_request_id
      AND reviewers.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can read reviews they're involved with"
  ON reviewers
  FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM pull_requests
      WHERE reviewers.pull_request_id = pull_requests.id
      AND pull_requests.author_id = auth.uid()
    )
  );