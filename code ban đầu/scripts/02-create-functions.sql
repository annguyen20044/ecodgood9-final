-- Function to reduce product stock
CREATE OR REPLACE FUNCTION reduce_product_stock(product_id INT, quantity INT)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE products
  SET stock = stock - quantity
  WHERE id = product_id AND stock >= quantity;
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- Function to get total orders count
CREATE OR REPLACE FUNCTION get_total_orders_count()
RETURNS INT AS $$
BEGIN
  RETURN (SELECT COUNT(*) FROM orders);
END;
$$ LANGUAGE plpgsql;

-- Function to get total revenue
CREATE OR REPLACE FUNCTION get_total_revenue()
RETURNS DECIMAL AS $$
BEGIN
  RETURN (SELECT COALESCE(SUM(total_amount), 0) FROM orders WHERE payment_status = 'confirmed');
END;
$$ LANGUAGE plpgsql;

-- Function to get monthly sales
CREATE OR REPLACE FUNCTION get_monthly_sales(year INT, month INT)
RETURNS DECIMAL AS $$
BEGIN
  RETURN (
    SELECT COALESCE(SUM(total_amount), 0)
    FROM orders
    WHERE EXTRACT(YEAR FROM created_at) = year
    AND EXTRACT(MONTH FROM created_at) = month
    AND payment_status = 'confirmed'
  );
END;
$$ LANGUAGE plpgsql;
