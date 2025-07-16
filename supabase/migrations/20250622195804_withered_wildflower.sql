/*
  # Add sample products to catalog

  1. New Data
    - Sample wine products with realistic pricing and descriptions
    - Products across different categories: Red Wine, White Wine, Champagne
    - Mix of in-stock and out-of-stock items for testing

  2. Data Safety
    - Uses INSERT with WHERE NOT EXISTS to prevent duplicates
    - Safe to run multiple times without creating duplicate entries
*/

-- Insert sample products only if they don't already exist
INSERT INTO products (name, vintage, price_per_case, description, category, in_stock, image_url)
SELECT * FROM (VALUES 
  ('Château Margaux', '2018', 2400.00, 'Premier Grand Cru Classé from Bordeaux. Elegant and complex with notes of blackcurrant and cedar.', 'Red Wine', true, 'https://images.pexels.com/photos/434311/pexels-photo-434311.jpeg?auto=compress&cs=tinysrgb&w=300'),
  ('Dom Pérignon', '2012', 1800.00, 'Prestigious Champagne with fine bubbles and notes of white flowers and citrus.', 'Champagne', true, 'https://images.pexels.com/photos/1407846/pexels-photo-1407846.jpeg?auto=compress&cs=tinysrgb&w=300'),
  ('Opus One', '2019', 3600.00, 'Napa Valley Bordeaux-style blend. Rich and powerful with layers of dark fruit and spice.', 'Red Wine', true, 'https://images.pexels.com/photos/1407846/pexels-photo-1407846.jpeg?auto=compress&cs=tinysrgb&w=300'),
  ('Chablis Premier Cru', '2020', 480.00, 'Crisp and mineral-driven Chardonnay from Burgundy with notes of green apple and oyster shell.', 'White Wine', true, 'https://images.pexels.com/photos/434311/pexels-photo-434311.jpeg?auto=compress&cs=tinysrgb&w=300'),
  ('Barolo Brunate', '2017', 720.00, 'Traditional Nebbiolo from Piedmont. Full-bodied with tannins and notes of cherry and leather.', 'Red Wine', true, 'https://images.pexels.com/photos/1407846/pexels-photo-1407846.jpeg?auto=compress&cs=tinysrgb&w=300'),
  ('Sancerre', '2021', 360.00, 'Loire Valley Sauvignon Blanc with bright acidity and notes of gooseberry and herbs.', 'White Wine', true, 'https://images.pexels.com/photos/434311/pexels-photo-434311.jpeg?auto=compress&cs=tinysrgb&w=300'),
  ('Caymus Cabernet', '2020', 600.00, 'Napa Valley Cabernet Sauvignon with rich dark fruit flavors and smooth tannins.', 'Red Wine', true, 'https://images.pexels.com/photos/1407846/pexels-photo-1407846.jpeg?auto=compress&cs=tinysrgb&w=300'),
  ('Veuve Clicquot', 'NV', 540.00, 'Classic Champagne with a perfect balance of strength and silkiness.', 'Champagne', true, 'https://images.pexels.com/photos/1407846/pexels-photo-1407846.jpeg?auto=compress&cs=tinysrgb&w=300'),
  ('Riesling Kabinett', '2021', 240.00, 'German Riesling with delicate sweetness balanced by crisp acidity and mineral notes.', 'White Wine', false, 'https://images.pexels.com/photos/434311/pexels-photo-434311.jpeg?auto=compress&cs=tinysrgb&w=300'),
  ('Pinot Noir Reserve', '2019', 420.00, 'Oregon Pinot Noir with bright cherry flavors and earthy undertones.', 'Red Wine', true, 'https://images.pexels.com/photos/1407846/pexels-photo-1407846.jpeg?auto=compress&cs=tinysrgb&w=300')
) AS new_products(name, vintage, price_per_case, description, category, in_stock, image_url)
WHERE NOT EXISTS (
  SELECT 1 FROM products 
  WHERE products.name = new_products.name 
  AND products.vintage = new_products.vintage
);