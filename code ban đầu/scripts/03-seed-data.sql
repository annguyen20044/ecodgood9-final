-- Insert categories
INSERT INTO categories (name, slug, description) VALUES
('Túi xách', 'tui-xach', 'Các loại túi tái sử dụng thân thiện với môi trường'),
('Đồ uống', 'do-uong', 'Chai nước và các sản phẩm đồ uống bền vững'),
('Bộ ăn', 'bo-an', 'Bộ đũa, muỗng, nĩa từ vật liệu tự nhiên'),
('Sản phẩm khác', 'san-pham-khac', 'Các sản phẩm eco-friendly khác')
ON CONFLICT DO NOTHING;

-- Insert products
INSERT INTO products (name, description, price, sku, category, image_url, stock, is_active) VALUES
('Túi Tái Sử Dụng Eco', 'Túi vải bền vững, có thể tái sử dụng hàng trăm lần. Chất liệu 100% cotton hữu cơ.', 89000, 'ECO-BAG-001', 'Túi xách', '/reusable-eco-bag.jpg', 50, true),
('Chai Nước Bamboo', 'Chai nước từ tre tự nhiên, không chứa BPA. Giữ nước lạnh đến 24 giờ.', 129000, 'ECO-BOTTLE-001', 'Đồ uống', '/bamboo-water-bottle.jpg', 35, true),
('Bộ Ăn Cơm Gỗ', 'Bộ đũa gỗ tự nhiên, thân thiện với môi trường. Bao gồm đũa, muỗng, nĩa.', 159000, 'ECO-CUTLERY-001', 'Bộ ăn', '/wooden-cutlery-set.jpg', 40, true),
('Hộp Cơm Bamboo', 'Hộp cơm từ sợi tre, không chứa hóa chất độc hại. Dung tích 1000ml.', 79000, 'ECO-LUNCH-001', 'Bộ ăn', '/bamboo-lunch-box.jpg', 60, true),
('Túi Đựng Rác Phân Hủy', 'Túi rác có thể phân hủy sinh học, an toàn cho môi trường.', 49000, 'ECO-TRASH-001', 'Túi xách', '/biodegradable-trash-bag.jpg', 100, true)
ON CONFLICT (sku) DO NOTHING;

-- Insert blog posts
INSERT INTO blog_posts (title, slug, excerpt, content, image_url, category, is_published, published_at) VALUES
('Tại sao bền vững lại quan trọng', 'tai-sao-ben-vung-quan-trong', 'Khám phá tác động của các sản phẩm bền vững đối với môi trường và sức khỏe', '<h2>Tại sao bền vững lại quan trọng</h2><p>Bền vững không chỉ là một từ khóa, mà là một cách sống. Khi chúng ta chọn các sản phẩm bền vững, chúng ta đang đầu tư vào tương lai của hành tinh.</p>', '/sustainable-living.jpg', 'Bền vững', true, NOW()),
('Cách sống xanh hơn mỗi ngày', 'cach-song-xanh-hon', 'Những mẹo đơn giản để giảm lượng rác thải và bảo vệ hành tinh', '<h2>Cách sống xanh hơn</h2><p>Có nhiều cách đơn giản để bắt đầu cuộc sống xanh hơn. Từ việc sử dụng túi tái sử dụng đến việc chọn các sản phẩm không chứa hóa chất độc hại.</p>', '/green-living-tips.jpg', 'Cuộc sống xanh', true, NOW()),
('Sản phẩm Eco-friendly là gì', 'san-pham-eco-friendly', 'Tìm hiểu về các sản phẩm thân thiện với môi trường và lợi ích của chúng', '<h2>Sản phẩm Eco-friendly</h2><p>Sản phẩm eco-friendly được thiết kế để giảm thiểu tác động tiêu cực đến môi trường. Chúng được làm từ các vật liệu bền vững và có thể tái chế.</p>', '/eco-products.jpg', 'Sản phẩm', true, NOW())
ON CONFLICT (slug) DO NOTHING;

-- Insert jobs
INSERT INTO jobs (title, department, location, job_type, salary, description, requirements, is_active) VALUES
('Nhân viên Bán hàng', 'Bán hàng', 'TP.HCM', 'Toàn thời gian', '8.000.000 - 12.000.000 đ', 'Chúng tôi tìm kiếm nhân viên bán hàng nhiệt tình để phục vụ khách hàng tại cửa hàng.', 'Tốt nghiệp THPT trở lên,Có kinh nghiệm bán hàng là lợi thế,Kỹ năng giao tiếp tốt,Đam mê sản phẩm eco-friendly', true),
('Chuyên viên Marketing', 'Marketing', 'TP.HCM', 'Toàn thời gian', '12.000.000 - 18.000.000 đ', 'Tham gia xây dựng chiến lược marketing và quản lý các chiến dịch quảng cáo.', 'Tốt nghiệp Đại học chuyên ngành Marketing,2+ năm kinh nghiệm trong marketing,Kỹ năng sáng tạo và phân tích dữ liệu,Thành thạo các công cụ marketing digital', true),
('Lập trình viên Full Stack', 'Công nghệ', 'TP.HCM', 'Toàn thời gian', '15.000.000 - 25.000.000 đ', 'Phát triển và bảo trì các ứng dụng web và mobile cho EcoGood.', 'Tốt nghiệp Đại học chuyên ngành Công nghệ Thông tin,3+ năm kinh nghiệm lập trình,Thành thạo React, Node.js, và các công nghệ web hiện đại,Kinh nghiệm với cơ sở dữ liệu SQL/NoSQL', true)
ON CONFLICT DO NOTHING;
