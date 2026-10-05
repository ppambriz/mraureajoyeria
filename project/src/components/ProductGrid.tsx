import { ProductCard } from '@/components';
import type { Product } from '@/types';
import { Loader2 } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  loading: boolean;
  title?: string;
  subtitle?: string;
}

export default function ProductGrid({ products, loading, title, subtitle }: ProductGridProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-rose-500 animate-spin" />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-rose-400 text-lg">No se encontraron productos.</p>
      </div>
    );
  }

  return (
    <section className="py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {title && (
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-serif text-rose-950 mb-2">{title}</h2>
            {subtitle && <p className="text-rose-400 text-lg">{subtitle}</p>}
            <div className="mt-4 w-20 h-0.5 bg-rose-300 mx-auto" />
          </div>
        )}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
