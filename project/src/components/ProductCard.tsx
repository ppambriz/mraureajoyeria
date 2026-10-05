import { Plus } from 'lucide-react';
import type { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/format';

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-rose-100 hover:shadow-xl hover:border-rose-200 transition-all duration-300 hover:-translate-y-1">
      <div className="relative aspect-[4/5] overflow-hidden bg-rose-50">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-rose-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <div className="p-4 md:p-5">
        <h3 className="font-serif text-lg text-rose-950 mb-1 truncate">{product.name}</h3>
        <p className="text-sm text-rose-400 mb-3 line-clamp-2 h-10">{product.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-xl font-semibold text-rose-700">{formatPrice(product.price)}</span>
          <button
            onClick={() => addItem(product)}
            className="flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-sm font-medium rounded-full transition-all duration-200 hover:scale-105 shadow-sm hover:shadow-md"
          >
            <Plus className="w-4 h-4" />
            Agregar
          </button>
        </div>
      </div>
    </div>
  );
}
