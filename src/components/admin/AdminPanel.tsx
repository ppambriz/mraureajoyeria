import { useState } from 'react';
import { useAdmin } from '@/context/AdminContext';
import { LogOut, Image, FolderTree, Package } from 'lucide-react';
import AdminLogin from './AdminLogin';
import CarouselManager from './CarouselManager';
import CategoryManager from './CategoryManager';
import ProductManager from './ProductManager';

type Tab = 'carousel' | 'categories' | 'products';

export default function AdminPanel() {
  const { isAuthenticated, logout } = useAdmin();
  const [tab, setTab] = useState<Tab>('carousel');

  if (!isAuthenticated) return <AdminLogin />;

  const tabs: { id: Tab; label: string; icon: typeof Image }[] = [
    { id: 'carousel', label: 'Carrusel', icon: Image },
    { id: 'categories', label: 'Categorías', icon: FolderTree },
    { id: 'products', label: 'Productos', icon: Package },
  ];

  return (
    <div className="min-h-screen bg-rose-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-serif text-rose-950">Panel de Administración</h2>
          <button
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 text-sm font-medium rounded-lg transition-all"
          >
            <LogOut className="w-4 h-4" />
            Cerrar Sesión
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-white rounded-xl p-1.5 border border-rose-100 w-fit flex-wrap">
          {tabs.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  tab === t.id
                    ? 'bg-rose-600 text-white shadow-md'
                    : 'text-rose-600 hover:bg-rose-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {t.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl border border-rose-100 p-6 shadow-sm">
          {tab === 'carousel' && <CarouselManager />}
          {tab === 'categories' && <CategoryManager />}
          {tab === 'products' && <ProductManager />}
        </div>
      </div>
    </div>
  );
}
