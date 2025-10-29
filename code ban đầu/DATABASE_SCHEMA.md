# EcoGood Database Schema & Entity Relationship Diagram

## Overview
This document outlines the complete database structure for the EcoGood e-commerce platform with proper relationships and constraints.

## Entity Relationship Diagram (ERD)

\`\`\`
┌─────────────────────────────────────────────────────────────────────────────┐
│                          ECOGOOD DATABASE SCHEMA                             │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────────────┐
│     USERS        │
├──────────────────┤
│ id (PK, UUID)    │
│ email            │◄─────────────────────────────────────────┐
│ password_hash    │                                          │
│ full_name        │                                          │
│ phone            │                                          │
│ avatar_url       │                                          │
│ address          │                                          │
│ city             │                                          │
│ district         │                                          │
│ is_admin         │                                          │
│ created_at       │                                          │
│ updated_at       │                                          │
└──────────────────┘                                          │
         ▲                                                    │
         │                                                    │
         │ 1:N                                               │
         │                                                    │
    ┌────┴──────────────────┐                                │
    │                       │                                │
    │                       │                                │
┌───┴──────────────┐  ┌─────┴──────────────┐                │
│  SHOPPING_CARTS  │  │   ORDERS           │                │
├──────────────────┤  ├────────────────────┤                │
│ id (PK)          │  │ id (PK)            │                │
│ user_id (FK)     │  │ user_id (FK)       │◄───────────────┘
│ created_at       │  │ order_number       │
│ updated_at       │  │ customer_name      │
│ status (NEW)     │  │ customer_email     │
│ abandoned_at     │  │ customer_phone     │
└──────────────────┘  │ customer_address   │
         │            │ total_amount       │
         │ 1:N        │ order_status       │
         │            │ payment_status     │
         │            │ payment_method     │
    ┌────┴────────┐   │ notes              │
    │             │   │ created_at         │
┌───┴──────────────────┐ updated_at         │
│   CART_ITEMS   │   └────────────────────┘
├──────────────────┤         │
│ id (PK)          │         │ 1:N
│ cart_id (FK)     │         │
│ product_id (FK)  │    ┌────┴──────────────┐
│ quantity         │    │  ORDER_ITEMS      │
│ price_at_time    │    ├───────────────────┤
│ created_at       │    │ id (PK)           │
│ updated_at       │    │ order_id (FK)     │
└──────────────────┘    │ product_id (FK)   │
         │              │ product_name      │
         │              │ quantity          │
         │              │ price             │
         │              │ created_at        │
         │              └───────────────────┘
         │
         └──────────────────────────────────┐
                                            │
                                            ▼
                                    ┌──────────────────┐
                                    │    PRODUCTS      │
                                    ├──────────────────┤
                                    │ id (PK)          │
                                    │ name             │
                                    │ sku              │
                                    │ description      │
                                    │ price            │
                                    │ stock            │
                                    │ category (FK)    │
                                    │ image_url        │
                                    │ is_active        │
                                    │ created_at       │
                                    │ updated_at       │
                                    └──────────────────┘
                                            │
                                            │ 1:N
                                            │
                                    ┌───────┴──────────┐
                                    │ PRODUCT_IMAGES   │
                                    ├───────────────────┤
                                    │ id (PK)           │
                                    │ product_id (FK)   │
                                    │ image_url         │
                                    │ alt_text          │
                                    │ display_order     │
                                    │ created_at        │
                                    └───────────────────┘

┌──────────────────┐
│  CATEGORIES      │
├──────────────────┤
│ id (PK)          │
│ name             │
│ slug             │
│ description      │
│ image_url        │
│ created_at       │
└──────────────────┘

┌──────────────────────┐
│  BLOG_POSTS          │
├──────────────────────┤
│ id (PK)              │
│ author_id (FK)       │◄─── USERS.id
│ title                │
│ slug                 │
│ excerpt              │
│ content              │
│ image_url            │
│ category             │
│ is_published         │
│ published_at         │
│ created_at           │
│ updated_at           │
└──────────────────────┘

┌──────────────────────────┐
│  PAYMENT_TRANSACTIONS    │
├──────────────────────────┤
│ id (PK)                  │
│ order_id (FK)            │
│ transaction_id           │
│ amount                   │
│ payment_method           │
│ status                   │
│ response_data (JSONB)    │
│ created_at               │
│ updated_at               │
└──────────────────────────┘

┌──────────────────────┐
│  PAYMENT_SETTINGS    │ (NEW)
├──────────────────────┤
│ id (PK)              │
│ key                  │
│ value (JSONB)        │
│ is_active            │
│ created_at           │
│ updated_at           │
└──────────────────────┘
\`\`\`

## Key Relationships

### 1. Users → Shopping Carts (1:N)
- One user can have one active shopping cart
- Cart status: 'active' or 'abandoned'
- Abandoned carts tracked via `abandoned_at` timestamp

### 2. Shopping Carts → Cart Items (1:N)
- Cart contains multiple items
- Each item references a product
- Price stored at time of addition (for historical accuracy)

### 3. Users → Orders (1:N)
- One user can have multiple orders
- Order contains customer info (denormalized for historical records)

### 4. Orders → Order Items (1:N)
- Each order contains multiple items
- Product info denormalized for historical accuracy

### 5. Products → Product Images (1:N)
- One product can have multiple images
- Images ordered by `display_order`

### 6. Products → Categories (N:1)
- Multiple products belong to one category

### 7. Orders → Payment Transactions (1:N)
- One order can have multiple payment attempts
- Tracks all payment history

### 8. Blog Posts → Users (N:1)
- Blog posts authored by users
- Proper foreign key relationship

## New Tables

### PAYMENT_SETTINGS
Stores payment configuration (VNPay, Stripe, etc.)
- Replaces hardcoded settings
- Allows admin to update without code changes
- Stores sensitive data securely

## Constraints & Indexes

### Foreign Keys
- All FK relationships have ON DELETE CASCADE or ON DELETE RESTRICT
- Ensures referential integrity

### Indexes
- `users(email)` - UNIQUE for login
- `products(sku)` - UNIQUE for inventory
- `orders(order_number)` - UNIQUE
- `shopping_carts(user_id)` - For quick lookup
- `blog_posts(slug)` - For URL routing
- `blog_posts(author_id)` - For author queries

### Timestamps
- All tables have `created_at` and `updated_at`
- Enables audit trails and sorting

## Data Integrity Rules

1. **Cart Status Management**
   - Active carts: `status = 'active'` and `abandoned_at IS NULL`
   - Abandoned carts: `status = 'abandoned'` and `abandoned_at IS NOT NULL`
   - Carts older than 30 days without activity → mark as abandoned

2. **Product Editing**
   - When product is updated, `updated_at` is set
   - Product images are versioned via `display_order`
   - Old images can be archived instead of deleted

3. **Order Management**
   - Order status flow: pending → processing → shipped → delivered
   - Payment status: pending → completed/failed
   - Cannot modify completed orders

4. **Media Storage**
   - Images stored in Supabase Storage bucket: `ecogood-files`
   - Naming convention: `{type}/{id}/{timestamp}-{filename}`
   - Example: `products/123/1699564800-main-image.jpg`
   - Automatic cleanup of orphaned files via scheduled job

5. **Blog Post Relationships**
   - Author must exist in users table
   - Slug must be unique
   - Published posts have `published_at` timestamp
\`\`\`

Now let me create the migration scripts:
