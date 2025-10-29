-- Enable Realtime for EcoGood Tables
-- Run this script in Supabase SQL Editor to enable real-time updates

-- Enable Realtime for products table
ALTER PUBLICATION supabase_realtime ADD TABLE products;

-- Enable Realtime for blog_posts table
ALTER PUBLICATION supabase_realtime ADD TABLE blog_posts;

-- Enable Realtime for orders table
ALTER PUBLICATION supabase_realtime ADD TABLE orders;

-- Enable Realtime for cart_items table
ALTER PUBLICATION supabase_realtime ADD TABLE cart_items;

-- Enable Realtime for shopping_carts table
ALTER PUBLICATION supabase_realtime ADD TABLE shopping_carts;

-- Enable Realtime for jobs table (if exists)
ALTER PUBLICATION supabase_realtime ADD TABLE jobs;

-- Verify realtime is enabled
SELECT schemaname, tablename 
FROM pg_publication_tables 
WHERE pubname = 'supabase_realtime'
ORDER BY tablename;

-- Expected output should include:
-- products
-- blog_posts
-- orders
-- cart_items
-- shopping_carts

