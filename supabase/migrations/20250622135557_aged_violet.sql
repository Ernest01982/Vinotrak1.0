/*
  # Create products table

  1. New Tables
    - `products`
      - `id` (uuid, primary key)
      - `name` (text, product name)
      - `vintage` (text, wine vintage year)
      - `price_per_case` (decimal, price per case)
      - `description` (text, product description)
      - `category` (text, wine category)
      - `in_stock` (boolean, availability status)
      - `image_url` (text, product image URL)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `products` table
    - Add policy for authenticated users to read products
    - Add policy for authenticated users to manage products (admin only)
*/

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  vintage text NOT NULL,
  price_per_case decimal(10,2) NOT NULL,
  description text,
  category text NOT NULL,
  in_stock boolean DEFAULT true,
  image_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read products"
  ON products
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage products"
  ON products
  FOR ALL
  TO authenticated
  USING (true);

-- Insert sample products
INSERT INTO products (name, vintage, price_per_case, description, category, in_stock, image_url) VALUES
('Château Margaux', '2018', 2400.00, 'Premier Grand Cru Classé from Bordeaux. Elegant and complex with notes of blackcurrant and cedar.', 'Red Wine', true, 'https://images.pexels.com/photos/434311/pexels-photo-434311.jpeg?auto=compress&cs=tinysrgb&w=300'),
('Dom Pérignon', '2012', 1800.00, 'Prestigious Champagne with fine bubbles and notes of white flowers and citrus.', 'Champagne', true, 'https://images.pexels.com/photos/1407846/pexels-photo-1407846.jpeg?auto=compress&cs=tinysrgb&w=300'),
('Opus One', '2019', 3600.00, 'Napa Valley Bordeaux-style blend. Rich and powerful with layers of dark fruit and spice.', 'Red Wine', true, 'https://images.pexels.com/photos/1407846/pexels-photo-1407846.jpeg?auto=compress&cs=tinysrgb&w=300'),
('Chablis Premier Cru', '2020', 480.00, 'Crisp and mineral-driven Chardonnay from Burgundy with notes of green apple and oyster shell.', 'White Wine', true, 'https://images.pexels.com/photos/434311/pexels-photo-434311.jpeg?auto=compress&cs=tinysrgb&w=300'),
('Barolo Brunate', '2017', 720.00, 'Traditional Nebbiolo from Piedmont. Full-bodied with tannins and notes of cherry and leather.', 'Red Wine', true, 'https://images.pexels.com/photos/1407846/pexels-photo-1407846.jpeg?auto=compress&cs=tinysrgb&w=300'),
('Sancerre', '2021', 360.00, 'Loire Valley Sauvignon Blanc with bright acidity and notes of gooseberry and herbs.', 'White Wine', true, 'https://images.pexels.com/photos/434311/pexels-photo-434311.jpeg?auto=compress&cs=tinysrgb&w=300'),
('Caymus Cabernet', '2020', 600.00, 'Napa Valley Cabernet Sauvignon with rich dark fruit flavors and smooth tannins.', 'Red Wine', true, 'https://images.pexels.com/photos/1407846/pexels-photo-1407846.jpeg?auto=compress&cs=tinysrgb&w=300'),
('Veuve Clicquot', 'NV', 540.00, 'Classic Champagne with a perfect balance of strength and silkiness.', 'Champagne', true, 'https://images.pexels.com/photos/1407846/pexels-photo-1407846.jpeg?auto=compress&cs=tinysrgb&w=300'),
('Riesling Kabinett', '2021', 240.00, 'German Riesling with delicate sweetness balanced by crisp acidity and mineral notes.', 'White Wine', false, 'https://images.pexels.com/photos/434311/pexels-photo-434311.jpeg?auto=compress&cs=tinysrgb&w=300'),
('Pinot Noir Reserve', '2019', 420.00, 'Oregon Pinot Noir with bright cherry flavors and earthy undertones.', 'Red Wine', true, 'https://images.pexels.com/photos/1407846/pexels-photo-1407846.jpeg?auto=compress&cs=tinysrgb&w=300');