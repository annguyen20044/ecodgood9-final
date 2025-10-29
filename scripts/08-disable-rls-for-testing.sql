-- Tạm thời disable RLS cho products và blog_posts để test CRUD
-- (Trong production nên dùng policies đúng cách)

-- Disable RLS cho products
ALTER TABLE products DISABLE ROW LEVEL SECURITY;

-- Disable RLS cho blog_posts  
ALTER TABLE blog_posts DISABLE ROW LEVEL SECURITY;

-- Hoặc nếu muốn giữ RLS nhưng cho phép tất cả:
-- CREATE POLICY "Allow all for products" ON products FOR ALL USING (true);
-- CREATE POLICY "Allow all for blog_posts" ON blog_posts FOR ALL USING (true);

