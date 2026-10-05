import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { Category, Product, CarouselSlide, SiteSettings } from '@/types';

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('display_order', { ascending: true });
      if (!error && data) setCategories(data);
      setLoading(false);
    })();
  }, []);

  return { categories, loading };
}

export function useProducts(categoryId?: string) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      let query = supabase
        .from('products')
        .select('*')
        .order('display_order', { ascending: true });
      if (categoryId) query = query.eq('category_id', categoryId);
      const { data, error } = await query;
      if (!error && data) setProducts(data);
      setLoading(false);
    })();
  }, [categoryId]);

  return { products, loading };
}

export function useAllProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*, category:categories(*)')
        .order('display_order', { ascending: true });
      if (!error && data) setProducts(data as unknown as Product[]);
      setLoading(false);
    })();
  }, []);

  return { products, loading };
}

export function useCarousel() {
  const [slides, setSlides] = useState<CarouselSlide[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from('carousel_slides')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });
      if (!error && data) setSlides(data);
      setLoading(false);
    })();
  }, []);

  return { slides, loading };
}

export function useSettings() {
  const [settings, setSettings] = useState<SiteSettings>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.from('site_settings').select('*');
      if (!error && data) {
        const map: SiteSettings = {};
        data.forEach((row: { key: string; value: string }) => {
          map[row.key] = row.value;
        });
        setSettings(map);
      }
      setLoading(false);
    })();
  }, []);

  return { settings, loading };
}
