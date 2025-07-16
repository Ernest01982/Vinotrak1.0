/*
  # Create clients table

  1. New Tables
    - `clients`
      - `id` (uuid, primary key)
      - `name` (text, required)
      - `store_type` (text, required)
      - `location` (text, required)
      - `contact_person` (text, required)
      - `phone` (text, optional)
      - `email` (text, required)
      - `rep_id` (uuid, required)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `clients` table
    - Add policies for authenticated users to read and manage clients

  3. Changes
    - Removed sample data insertion to avoid auth.uid() issues during migration
    - Sample data will be handled by the application layer instead
*/

CREATE TABLE IF NOT EXISTS clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  store_type text NOT NULL,
  location text NOT NULL,
  contact_person text NOT NULL,
  phone text,
  email text NOT NULL,
  rep_id uuid NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read all clients"
  ON clients
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage clients"
  ON clients
  FOR ALL
  TO authenticated
  USING (true);

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_clients_rep_id ON clients(rep_id);
CREATE INDEX IF NOT EXISTS idx_clients_email ON clients(email);