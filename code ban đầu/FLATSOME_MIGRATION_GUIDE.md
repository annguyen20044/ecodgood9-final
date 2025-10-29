# Hướng dẫn Migration sang Flatsome

## Tổng quan

Hướng dẫn này giúp bạn migrate website EcoGood từ Next.js sang Flatsome (WordPress theme).

## Yêu cầu

- Hosting WordPress (tối thiểu PHP 7.4, MySQL 5.7)
- Theme Flatsome đã cài đặt
- Các plugin: WooCommerce, Elementor, Elementor Pro (tùy chọn)

## Bước 1: Chuẩn bị WordPress

### 1.1 Cài đặt WordPress
\`\`\`bash
# Tải WordPress từ wordpress.org
# Cài đặt trên hosting của bạn
# Hoàn thành setup wizard
\`\`\`

### 1.2 Cài đặt Theme Flatsome
1. Vào WordPress Admin Dashboard
2. Appearance → Themes
3. Upload Flatsome theme
4. Activate Flatsome

### 1.3 Cài đặt Plugins Cần Thiết
- WooCommerce (bắt buộc cho sản phẩm)
- Elementor (page builder)
- Elementor Pro (tùy chọn, để có thêm tính năng)
- Yoast SEO (SEO optimization)

## Bước 2: Import Dữ liệu

### 2.1 Import Sản phẩm (WooCommerce)

1. Vào WooCommerce → Products → Import
2. Chọn file `products-export.json` hoặc `products.csv`
3. Map các trường:
   - Name → Product Name
   - Price → Regular Price
   - Description → Product Description
   - Category → Product Category
   - SKU → SKU
   - Stock → Stock Quantity
   - Image → Product Image

4. Click Import

### 2.2 Import Bài viết Blog

1. Vào Tools → Import
2. Chọn WordPress Importer
3. Upload file `blog-export.json`
4. Map các trường:
   - title → Post Title
   - content → Post Content
   - excerpt → Post Excerpt
   - category → Post Category
   - date → Post Date
   - image → Featured Image

5. Click Import

### 2.3 Tạo Trang Tuyển dụng

1. Vào Pages → Add New
2. Tạo page "Tuyển dụng"
3. Sử dụng Elementor để thiết kế
4. Thêm job listings từ file `jobs-export.json`

## Bước 3: Thiết kế với Flatsome

### 3.1 Tùy chỉnh Header
1. Appearance → Customize
2. Header Settings
3. Thêm logo, menu, contact info

### 3.2 Tùy chỉnh Footer
1. Appearance → Customize
2. Footer Settings
3. Thêm thông tin liên hệ, social links

### 3.3 Tạo Homepage
1. Pages → Add New → Homepage
2. Sử dụng Elementor
3. Thêm các section:
   - Hero Banner
   - Featured Products
   - Blog Posts
   - Testimonials
   - Contact Form

## Bước 4: Cấu hình Chức năng

### 4.1 Thanh toán
1. WooCommerce → Settings → Payments
2. Cấu hình VNPay hoặc Stripe
3. Thêm API keys

### 4.2 Email Notifications
1. WooCommerce → Settings → Emails
2. Cấu hình email templates
3. Thêm SMTP settings

### 4.3 SEO
1. Yoast SEO → General
2. Cấu hình site settings
3. Thêm meta descriptions cho pages

## Bước 5: Kiểm tra & Tối ưu

### 5.1 Kiểm tra Chức năng
- [ ] Sản phẩm hiển thị đúng
- [ ] Giỏ hàng hoạt động
- [ ] Thanh toán hoạt động
- [ ] Blog posts hiển thị
- [ ] Contact form hoạt động
- [ ] Tuyển dụng hiển thị

### 5.2 Tối ưu Hiệu suất
1. Cài đặt caching plugin (WP Super Cache)
2. Tối ưu hình ảnh (Smush)
3. Minify CSS/JS (Autoptimize)
4. Cấu hình CDN (CloudFlare)

### 5.3 SEO Optimization
1. Thêm sitemap
2. Cấu hình robots.txt
3. Thêm structured data
4. Kiểm tra mobile responsiveness

## Bước 6: Go Live

### 6.1 Chuẩn bị
- [ ] Backup toàn bộ database
- [ ] Kiểm tra tất cả links
- [ ] Test trên mobile
- [ ] Kiểm tra performance

### 6.2 Chuyển Domain
1. Update DNS records
2. Cấu hình SSL certificate
3. Redirect old URLs (nếu có)

### 6.3 Monitoring
- Theo dõi traffic
- Kiểm tra error logs
- Monitor performance

## Lợi ích của Flatsome

- Dễ sử dụng, không cần code
- Hỗ trợ WooCommerce tốt
- Có sẵn nhiều template đẹp
- Cộng đồng lớn, hỗ trợ tốt
- Tích hợp Elementor page builder

## Lưu ý

- Một số tính năng custom sẽ cần cấu hình lại
- Hiệu suất có thể khác so với Next.js
- Chi phí hosting WordPress thường cao hơn
- Cần backup thường xuyên

## Hỗ trợ

Nếu gặp vấn đề:
1. Kiểm tra Flatsome documentation
2. Tìm kiếm trên WordPress forums
3. Liên hệ Flatsome support team
