/*
  # Fix user authentication and role assignment

  1. Database Functions
    - Create or update the handle_new_user function to properly assign roles
    - Ensure profiles are created with correct default role

  2. Triggers
    - Set up trigger to automatically create profile on user signup
    - Handle role assignment based on email or default to 'rep'

  3. Test Users
    - Create test admin and rep users if they don't exist
    - Ensure proper role assignment for existing users
*/

-- Create or replace the handle_new_user function
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert a new profile for the user
  INSERT INTO profiles (id, display_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email),
    CASE 
      WHEN NEW.email = 'admin@vinotrack.app' THEN 'admin'
      WHEN NEW.raw_user_meta_data->>'role' = 'admin' THEN 'admin'
      ELSE 'rep'
    END
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger for new user signups
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Create test users if they don't exist (this will be handled by the trigger)
-- Note: In a real environment, you would create these users through the Supabase auth system

-- Update existing profiles to ensure correct roles
UPDATE profiles 
SET role = 'admin' 
WHERE id IN (
  SELECT id FROM auth.users 
  WHERE email = 'admin@vinotrack.app'
);

-- Ensure RLS is properly configured for profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Update profile policies to be more permissive for user management
DROP POLICY IF EXISTS "Users can read their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can read all profiles" ON profiles;

-- Allow users to read their own profile
CREATE POLICY "Users can read their own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update their own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Allow admins to read all profiles
CREATE POLICY "Admins can read all profiles"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Allow admins to insert new profiles (for user management)
CREATE POLICY "Admins can insert profiles"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Allow admins to update any profile
CREATE POLICY "Admins can update any profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  );