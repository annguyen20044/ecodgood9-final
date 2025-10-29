-- Migration: Fix Database Relationships and Add Missing Tables
-- Version: 2.0
-- Date: 2025-10-26

-- 1. Add missing columns to shopping_carts
ALTER TABLE shopping_carts 
ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'active',
ADD COLUMN IF NOT EXISTS abandoned_at TIMESTAMP;

-- 2. Create payment_settings table
CREATE TABLE IF NOT EXISTS payment_settings (
  id SERIAL PRIMARY KEY,
  key VARCHAR(255) NOT NULL UNIQUE,
  value JSONB NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_shopping_carts_user_id ON shopping_carts(user_id);
CREATE INDEX IF NOT EXISTS idx_shopping_carts_status ON shopping_carts(status);
CREATE INDEX IF NOT EXISTS idx_cart_items_cart_id ON cart_items(cart_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_product_id ON cart_items(product_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(order_status);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_author_id ON blog_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(is_published);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_order_id ON payment_transactions(order_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- 4. Add foreign key constraints if they don't exist
ALTER TABLE blog_posts
ADD CONSTRAINT IF NOT EXISTS fk_blog_posts_author_id 
FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL;

ALTER TABLE shopping_carts
ADD CONSTRAINT IF NOT EXISTS fk_shopping_carts_user_id 
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE cart_items
ADD CONSTRAINT IF NOT EXISTS fk_cart_items_cart_id 
FOREIGN KEY (cart_id) REFERENCES shopping_carts(id) ON DELETE CASCADE;

ALTER TABLE cart_items
ADD CONSTRAINT IF NOT EXISTS fk_cart_items_product_id 
FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT;

ALTER TABLE orders
ADD CONSTRAINT IF NOT EXISTS fk_orders_user_id 
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL;

ALTER TABLE order_items
ADD CONSTRAINT IF NOT EXISTS fk_order_items_order_id 
FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE;

ALTER TABLE order_items
ADD CONSTRAINT IF NOT EXISTS fk_order_items_product_id 
FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT;

ALTER TABLE product_images
ADD CONSTRAINT IF NOT EXISTS fk_product_images_product_id 
FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE;

ALTER TABLE payment_transactions
ADD CONSTRAINT IF NOT EXISTS fk_payment_transactions_order_id 
FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE;

-- 5. Insert default payment settings
INSERT INTO payment_settings (key, value, is_active) VALUES
('vnpay', '{"merchant_id": "", "hash_secret": "", "api_url": "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html"}', false),
('stripe', '{"publishable_key": "", "secret_key": ""}', false),
('bank_transfer', '{"account_name": "", "account_number": "", "bank_name": ""}', false)
ON CONFLICT (key) DO NOTHING;

-- 6. Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables with updated_at
CREATE TRIGGER update_shopping_carts_updated_at BEFORE UPDATE ON shopping_carts
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cart_items_updated_at BEFORE UPDATE ON cart_items
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payment_settings_updated_at BEFORE UPDATE ON payment_settings
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 7. Add RLS policies for payment_settings (admin only)
ALTER TABLE payment_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can view payment settings" ON payment_settings
FOR SELECT USING (
  EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.is_admin = true)
);

CREATE POLICY "Only admins can update payment settings" ON payment_settings
FOR UPDATE USING (
  EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.is_admin = true)
);

-- 8. Create view for active carts
CREATE OR REPLACE VIEW active_shopping_carts AS
SELECT * FROM shopping_carts
WHERE status = 'active' AND abandoned_at IS NULL;

-- 9. Create view for abandoned carts (older than 30 days)
CREATE OR REPLACE VIEW abandoned_shopping_carts AS
SELECT * FROM shopping_carts
WHERE status = 'abandoned' 
  OR (abandoned_at IS NOT NULL AND abandoned_at < NOW() - INTERVAL '30 days');
