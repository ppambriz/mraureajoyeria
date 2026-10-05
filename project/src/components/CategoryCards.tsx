import { Link } from 'lucide-react';
import type { Category } from '@/types';

interface CategoryCardsProps {
  categories: Category[];
  onNavigate: (view: string) => void;
}

export default function CategoryCards({ categories, onNavigate }: CategoryCardsProps) {
  return (
    <section className="py-12 md:py-16 bg-gradient-to-b from-white to-rose-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-serif text-rose-950 mb-2">Nuestras Categorías</h2>
          <p className="text-rose-400 text-lg">Explora nuestra colección por categoría</p>
          <div className="mt-4 w-20 h-0.5 bg-rose-300 mx-auto" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onNavigate(`category:${cat.slug}`)}
              className="group relative aspect-square rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
            >
              <img
                src={cat.image_url}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-rose-950/70 via-rose-950/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 text-center">
                <h3 className="text-white font-serif text-lg md:text-xl mb-1">{cat.name}</h3>
                <span className="inline-flex items-center gap-1 text-rose-100 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Ver productos <Link className="w-3 h-3" />
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
