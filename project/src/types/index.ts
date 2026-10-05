export interface Category {
  id: string;
  name: string;
  slug: string;
  image_url: string;
  display_order: number;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category_id: string;
  display_order: number;
  created_at: string;
}

export interface ProductWithCategory extends Product {
  category?: Category;
}

export interface CarouselSlide {
  id: string;
  title: string;
  subtitle: string;
  image_url: string;
  link_url: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
}

export interface SiteSettings {
  [key: string]: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
