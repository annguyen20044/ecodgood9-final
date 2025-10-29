-- Thêm sản phẩm mẫu với ảnh đẹp vào Supabase

-- Xóa sản phẩm cũ nếu có (optional)
-- DELETE FROM products;

-- Thêm sản phẩm mới
INSERT INTO products (name, description, price, image, category, is_published, created_at) VALUES
(
  'Túi Tote Vải Canvas Eco',
  'Túi tote thân thiện môi trường làm từ vải canvas tự nhiên, bền đẹp và có thể tái sử dụng nhiều lần. Kích thước 40x35cm, chịu tải tốt.',
  45000,
  '/reusable-eco-bag.jpg',
  'Túi & Bao bì',
  true,
  NOW()
),
(
  'Bình Nước Thủy Tinh 500ml',
  'Bình nước thủy tinh cao cấp, thiết kế nhỏ gọn tiện lợi. An toàn tuyệt đối cho sức khỏe, không chứa BPA.',
  89000,
  '/bamboo-water-bottle.jpg',
  'Chai & Ly',
  true,
  NOW()
),
(
  'Set Đũa Tre Cao Cấp',
  'Bộ 5 đôi đũa tre tự nhiên, thân thiện môi trường. Bền, đẹp và an toàn cho sức khỏe.',
  65000,
  '/wooden-cutlery-set.jpg',
  'Đồ gia dụng',
  true,
  NOW()
),
(
  'Xà Phòng Handmade Thiên Nhiên',
  'Xà phòng thủ công từ thành phần tự nhiên 100%, dịu nhẹ cho da, không hóa chất độc hại.',
  55000,
  '/handmade-soap.jpg',
  'Chăm sóc cá nhân',
  true,
  NOW()
),
(
  'Bàn Chải Đánh Răng Tre',
  'Bàn chải đánh răng làm từ tre tự nhiên, lông bàn chải mềm mại. Thay thế hoàn hảo cho bàn chải nhựa.',
  35000,
  '/bamboo-toothbrush.jpg',
  'Chăm sóc cá nhân',
  true,
  NOW()
),
(
  'Kem Đánh Răng Tự Nhiên',
  'Kem đánh răng từ thành phần thiên nhiên, không fluoride, an toàn cho cả gia đình.',
  75000,
  '/natural-toothpaste.jpg',
  'Chăm sóc cá nhân',
  true,
  NOW()
);

-- Kiểm tra kết quả
SELECT * FROM products ORDER BY created_at DESC;

