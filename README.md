# EcoGood 2

*Automatically synced with your [v0.app](https://v0.app) deployments*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/annguyen081004-5863s-projects/v0-eco-good-2)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/projects/wEaBKQ7zTEa)

## Overview

This repository will stay in sync with your deployed chats on [v0.app](https://v0.app).
Any changes you make to your deployed app will be automatically pushed to this repository from [v0.app](https://v0.app).

## Deployment

Your project is live at:

**[https://vercel.com/annguyen081004-5863s-projects/v0-eco-good-2](https://vercel.com/annguyen081004-5863s-projects/v0-eco-good-2)**

## Build your app

Continue building your app on:

**[https://v0.app/chat/projects/wEaBKQ7zTEa](https://v0.app/chat/projects/wEaBKQ7zTEa)**

## How It Works

1. Create and modify your project using [v0.app](https://v0.app)
2. Deploy your chats from the v0 interface
3. Changes are automatically pushed to this repository
4. Vercel deploys the latest version from this repository

## Environment Variables Configuration

### ⚠️ Quan trọng: Cấu hình biến môi trường trên Vercel

Khi deploy lên Vercel, bạn **PHẢI** cấu hình các biến môi trường sau trong Vercel Dashboard:

1. **Truy cập Vercel Dashboard:**
   - Vào project của bạn trên Vercel
   - Chọn tab **Settings** → **Environment Variables**

2. **Thêm các biến môi trường sau:**

   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   ```

3. **Lấy các giá trị từ Supabase:**
   - Truy cập: https://supabase.com/dashboard/project/_/settings/api
   - Copy các giá trị:
     - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
     - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY`

4. **Sau khi thêm biến môi trường:**
   - Vercel sẽ tự động trigger một deployment mới
   - Hoặc bạn có thể vào tab **Deployments** và chọn **Redeploy** để áp dụng ngay

### Lỗi thường gặp

Nếu gặp lỗi: **"Your project's URL and Key are required to create a Supabase client!"**

→ Điều này có nghĩa là các biến môi trường chưa được cấu hình trên Vercel. Hãy làm theo các bước trên.
