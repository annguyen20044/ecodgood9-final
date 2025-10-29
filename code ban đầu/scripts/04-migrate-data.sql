-- This SQL script can be used to verify migration status
-- Run these queries to check if data was successfully migrated

-- Check products count
SELECT COUNT(*) as products_count FROM products;

-- Check orders count
SELECT COUNT(*) as orders_count FROM orders;

-- Check order items count
SELECT COUNT(*) as order_items_count FROM order_items;

-- Check blog posts count
SELECT COUNT(*) as blog_posts_count FROM blog_posts;

-- Check contacts count
SELECT COUNT(*) as contacts_count FROM contacts;

-- Check job applications count
SELECT COUNT(*) as applications_count FROM job_applications;

-- Check jobs count
SELECT COUNT(*) as jobs_count FROM jobs;

-- View recent orders with items
SELECT 
  o.id,
  o.order_number,
  o.customer_name,
  o.total_amount,
  o.order_status,
  COUNT(oi.id) as item_count
FROM orders o
LEFT JOIN order_items oi ON o.id = oi.order_id
GROUP BY o.id
ORDER BY o.created_at DESC
LIMIT 10;
