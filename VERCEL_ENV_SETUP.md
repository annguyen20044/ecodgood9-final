# Hướng dẫn cấu hình Environment Variables trên Vercel

## ⚠️ Lưu ý quan trọng

File `.env` **KHÔNG** được commit lên Git vì lý do bảo mật. Thay vào đó, bạn cần cấu hình các biến môi trường trực tiếp trên Vercel Dashboard.

## Các bước cấu hình

### Bước 1: Lấy thông tin từ Supabase

1. Truy cập: https://supabase.com/dashboard/project/_/settings/api
2. Đăng nhập vào Supabase Dashboard
3. Chọn project của bạn
4. Vào **Settings** → **API**
5. Copy 3 giá trị sau:
   - **Project URL** (ví dụ: `https://xxxxx.supabase.co`)
   - **anon public** key (key bắt đầu với `eyJ...`)
   - **service_role** key (key bắt đầu với `eyJ...` - **LƯU Ý: Key này rất nhạy cảm, không chia sẻ!**)

### Bước 2: Cấu hình trên Vercel

1. Truy cập Vercel Dashboard: https://vercel.com/dashboard
2. Chọn project **ecodgood9** (hoặc project của bạn)
3. Vào tab **Settings** (bên trái)
4. Chọn **Environment Variables** (trong menu Settings)
5. Thêm từng biến môi trường sau:

#### Biến 1: NEXT_PUBLIC_SUPABASE_URL
- **Name:** `NEXT_PUBLIC_SUPABASE_URL`
- **Value:** Dán Project URL từ Supabase (ví dụ: `https://xxxxx.supabase.co`)
- **Environment:** Chọn tất cả (Production, Preview, Development)

#### Biến 2: NEXT_PUBLIC_SUPABASE_ANON_KEY
- **Name:** `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Value:** Dán anon public key từ Supabase
- **Environment:** Chọn tất cả (Production, Preview, Development)

#### Biến 3: SUPABASE_SERVICE_ROLE_KEY
- **Name:** `SUPABASE_SERVICE_ROLE_KEY`
- **Value:** Dán service_role key từ Supabase
- **Environment:** Chọn tất cả (Production, Preview, Development)

### Bước 3: Redeploy

Sau khi thêm tất cả biến môi trường:

1. Vào tab **Deployments**
2. Tìm deployment mới nhất
3. Click vào menu **...** (3 chấm)
4. Chọn **Redeploy**
5. Hoặc Vercel sẽ tự động redeploy khi bạn thêm biến môi trường

### Bước 4: Kiểm tra

Sau khi redeploy xong, truy cập:
- https://ecodgood9-p2uqg80sq-baoannguyen8036-2066s-projects.vercel.app
- Thử upload ảnh để kiểm tra xem lỗi đã được khắc phục chưa

## Các biến môi trường cần thiết

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

## Lỗi thường gặp

### Lỗi: "Your project's URL and Key are required to create a Supabase client!"
→ **Nguyên nhân:** Chưa cấu hình biến môi trường trên Vercel
→ **Giải pháp:** Làm theo các bước trên

### Lỗi: Upload ảnh thất bại
→ **Nguyên nhân:** Thiếu biến môi trường hoặc giá trị sai
→ **Giải pháp:** 
  1. Kiểm tra lại các biến môi trường trên Vercel
  2. Đảm bảo đã chọn đúng Environment (Production, Preview, Development)
  3. Redeploy lại project

## Video hướng dẫn (nếu có)

Nếu cần, bạn có thể xem hướng dẫn chi tiết tại:
- Vercel Docs: https://vercel.com/docs/concepts/projects/environment-variables
- Supabase Docs: https://supabase.com/docs/guides/getting-started/quickstarts/nextjs

