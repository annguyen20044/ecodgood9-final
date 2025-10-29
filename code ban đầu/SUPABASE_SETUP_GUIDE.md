# Supabase Database Setup Guide for EcoGood

## Overview

This guide walks you through setting up the Supabase PostgreSQL database for the EcoGood e-commerce platform.

## Prerequisites

- Supabase account (free tier available at https://supabase.com)
- Access to the Vercel project environment variables
- Node.js 18+ installed locally

## Step 1: Create Supabase Project

1. Go to https://supabase.com and sign in
2. Click "New Project"
3. Fill in project details:
   - **Name**: EcoGood
   - **Database Password**: Create a strong password
   - **Region**: Choose closest to your users
4. Wait for project to initialize (2-3 minutes)

## Step 2: Get Connection Credentials

1. In Supabase dashboard, go to **Settings > Database**
2. Copy these values:
   - `NEXT_PUBLIC_SUPABASE_URL` - Project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Anon public key
   - `SUPABASE_SERVICE_ROLE_KEY` - Service role key (keep secret!)

## Step 3: Add Environment Variables

In your Vercel project, add these environment variables in the **Settings > Environment Variables** section:

\`\`\`
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
\`\`\`

## Step 4: Create Database Schema

1. In Supabase dashboard, go to **SQL Editor**
2. Create a new query
3. Copy and paste the contents of `scripts/01-create-tables.sql`
4. Click "Run"
5. Repeat for `scripts/02-create-functions.sql`
6. Repeat for `scripts/03-seed-data.sql`

## Step 5: Migrate Existing Data (Optional)

If you have existing data in Blob storage:

1. Run the migration script:
   \`\`\`bash
   npx ts-node scripts/migrate-to-supabase.ts
   \`\`\`

2. Verify migration with `scripts/04-migrate-data.sql` queries

## Step 6: Set Up Row Level Security (RLS)

For production security, enable RLS policies:

\`\`\`sql
-- Users can only see their own data
CREATE POLICY "Users can view own data"
ON users FOR SELECT
USING (auth.uid() = id);

-- Users can only see their own orders
CREATE POLICY "Users can view own orders"
ON orders FOR SELECT
USING (auth.uid() = user_id OR auth.uid() IS NULL);

-- Users can only see their own cart
CREATE POLICY "Users can view own cart"
ON shopping_carts FOR SELECT
USING (auth.uid() = user_id);
\`\`\`

## Step 7: Test Connection

1. Deploy your project to Vercel
2. Check the logs for any connection errors
3. Test API endpoints:
   - GET `/api/products` - Should return products
   - GET `/api/orders` - Should return orders (admin only)

## Database Schema Overview

### Core Tables

- **users** - User accounts and profiles
- **products** - Product catalog
- **categories** - Product categories
- **shopping_carts** - User shopping carts
- **cart_items** - Items in shopping carts
- **orders** - Customer orders
- **order_items** - Items in orders
- **blog_posts** - Blog articles
- **contacts** - Contact form submissions
- **job_applications** - Job applications
- **jobs** - Job listings
- **payment_transactions** - Payment records

### Key Features

✅ Automatic timestamps (created_at, updated_at)
✅ Optimized indexes for fast queries
✅ Foreign key relationships
✅ Row Level Security support
✅ Built-in functions for common operations

## API Endpoints

### Products
- `GET /api/products` - List all products
- `GET /api/products/[id]` - Get product details
- `POST /api/products` - Create product (admin)
- `PATCH /api/products/[id]` - Update product (admin)
- `DELETE /api/products/[id]` - Delete product (admin)

### Orders
- `GET /api/orders` - List orders (admin)
- `GET /api/orders/[id]` - Get order details
- `POST /api/orders` - Create order
- `PATCH /api/orders/[id]` - Update order status (admin)

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart/items` - Add item to cart
- `PATCH /api/cart/items/[id]` - Update cart item
- `DELETE /api/cart/items/[id]` - Remove from cart

## Troubleshooting

### Connection Issues
- Verify environment variables are set correctly
- Check Supabase project is active
- Ensure IP whitelist allows your server

### Migration Errors
- Check data format matches schema
- Verify foreign key relationships
- Review error logs in Supabase dashboard

### Performance Issues
- Check indexes are created
- Monitor query performance in Supabase
- Consider caching frequently accessed data

## Next Steps

1. Set up authentication with Supabase Auth
2. Implement Row Level Security policies
3. Add real-time subscriptions for live updates
4. Set up automated backups
5. Monitor database performance

## Support

For issues, check:
- Supabase documentation: https://supabase.com/docs
- Project logs in Supabase dashboard
- API error responses for detailed messages
