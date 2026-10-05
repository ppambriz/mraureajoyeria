import { useState } from 'react';
import { Search, ShoppingBag, Menu, X, Gem } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import type { Category } from '@/types';

interface NavbarProps {
  categories: Category[];
  onNavigate: (view: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  storeName: string;
}

export default function Navbar({ categories, onNavigate, searchQuery, onSearchChange, storeName }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { totalItems, openCart } = useCart();

  const handleNav = (view: string) => {
    onNavigate(view);
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-rose-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <button onClick={() => handleNav('home')} className="flex items-center gap-2 group">
            <Gem className="w-7 h-7 md:w-8 md:h-8 text-rose-600 group-hover:rotate-12 transition-transform duration-300" />
            <span className="text-xl md:text-2xl font-serif tracking-wide text-rose-950">
              {storeName}
            </span>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            <button
              onClick={() => handleNav('home')}
              className="px-4 py-2 text-sm font-medium text-rose-950 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all duration-200"
            >
              Inicio
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleNav(`category:${cat.slug}`)}
                className="px-4 py-2 text-sm font-medium text-rose-950 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all duration-200"
              >
                {cat.name}
              </button>
            ))}
            <button
              onClick={() => handleNav('admin')}
              className="px-4 py-2 text-sm font-medium text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all duration-200"
            >
              Admin
            </button>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2 md:gap-3">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-rose-950 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all duration-200"
              aria-label="Buscar"
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              onClick={openCart}
              className="relative p-2 text-rose-950 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all duration-200"
              aria-label="Carrito"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                  {totalItems}
                </span>
              )}
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 text-rose-950 hover:bg-rose-50 rounded-lg transition-all"
              aria-label="Menú"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Search bar */}
        {searchOpen && (
          <div className="pb-4 animate-fadeIn">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-rose-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Buscar collares, aretes, pulseras..."
                className="w-full pl-11 pr-4 py-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-950 placeholder-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                autoFocus
              />
            </div>
          </div>
        )}
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <nav className="lg:hidden bg-white border-t border-rose-100 px-4 py-3 space-y-1 animate-fadeIn">
          <button
            onClick={() => handleNav('home')}
            className="block w-full text-left px-4 py-3 text-sm font-medium text-rose-950 hover:bg-rose-50 rounded-lg transition-all"
          >
            Inicio
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleNav(`category:${cat.slug}`)}
              className="block w-full text-left px-4 py-3 text-sm font-medium text-rose-950 hover:bg-rose-50 rounded-lg transition-all"
            >
              {cat.name}
            </button>
          ))}
          <button
            onClick={() => handleNav('admin')}
            className="block w-full text-left px-4 py-3 text-sm font-medium text-rose-400 hover:bg-rose-50 rounded-lg transition-all"
          >
            Administración
          </button>
        </nav>
      )}
    </header>
  );
}
