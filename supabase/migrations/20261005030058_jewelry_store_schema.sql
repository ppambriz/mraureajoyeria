/*
# Jewelry Store Schema

1. New Tables
- `categories` — product categories (necklaces, earrings, bracelets, rings, charms, etc.)
  - id (uuid, PK), name (text), slug (text, unique), image_url (text), display_order (int), created_at
- `products` — jewelry items belonging to a category
  - id (uuid, PK), name, description, price (numeric), image_url, category_id (FK), display_order, created_at
- `carousel_slides` — images shown in the auto-rotating home carousel
  - id (uuid, PK), title, subtitle, image_url, link_url, display_order, is_active, created_at
- `site_settings` — key-value store for site-wide settings (whatsapp number, hero text, etc.)
  - id (uuid, PK), key (text, unique), value (text), updated_at

2. Security
- RLS enabled on all tables.
- Public read access (anon + authenticated) for all tables — this is a storefront.
- Public write access for admin management through the anon key (admin auth is handled client-side per user request: user admin / pass admin123).
*/

CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  image_url text NOT NULL DEFAULT '',
  display_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_select_categories" ON categories;
CREATE POLICY "public_select_categories" ON categories FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "public_insert_categories" ON categories;
CREATE POLICY "public_insert_categories" ON categories FOR INSERT
TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "public_update_categories" ON categories;
CREATE POLICY "public_update_categories" ON categories FOR UPDATE
TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "public_delete_categories" ON categories;
CREATE POLICY "public_delete_categories" ON categories FOR DELETE
TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  price numeric(10,2) NOT NULL DEFAULT 0,
  image_url text NOT NULL DEFAULT '',
  category_id uuid REFERENCES categories(id) ON DELETE CASCADE,
  display_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_select_products" ON products;
CREATE POLICY "public_select_products" ON products FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "public_insert_products" ON products;
CREATE POLICY "public_insert_products" ON products FOR INSERT
TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "public_update_products" ON products;
CREATE POLICY "public_update_products" ON products FOR UPDATE
TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "public_delete_products" ON products;
CREATE POLICY "public_delete_products" ON products FOR DELETE
TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS carousel_slides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL DEFAULT '',
  subtitle text NOT NULL DEFAULT '',
  image_url text NOT NULL DEFAULT '',
  link_url text NOT NULL DEFAULT '',
  display_order int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE carousel_slides ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_select_carousel" ON carousel_slides;
CREATE POLICY "public_select_carousel" ON carousel_slides FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "public_insert_carousel" ON carousel_slides;
CREATE POLICY "public_insert_carousel" ON carousel_slides FOR INSERT
TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "public_update_carousel" ON carousel_slides;
CREATE POLICY "public_update_carousel" ON carousel_slides FOR UPDATE
TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "public_delete_carousel" ON carousel_slides;
CREATE POLICY "public_delete_carousel" ON carousel_slides FOR DELETE
TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value text NOT NULL DEFAULT '',
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_select_settings" ON site_settings;
CREATE POLICY "public_select_settings" ON site_settings FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "public_insert_settings" ON site_settings;
CREATE POLICY "public_insert_settings" ON site_settings FOR INSERT
TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "public_update_settings" ON site_settings;
CREATE POLICY "public_update_settings" ON site_settings FOR UPDATE
TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "public_delete_settings" ON site_settings;
CREATE POLICY "public_delete_settings" ON site_settings FOR DELETE
TO anon, authenticated USING (true);
