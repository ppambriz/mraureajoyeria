import { useState, useEffect, useMemo } from 'react';
import { CartProvider, useCart } from '@/context/CartContext';
import { AdminProvider } from '@/context/AdminContext';
import { useCategories, useProducts, useAllProducts, useCarousel, useSettings } from '@/hooks/useData';
import Navbar from '@/components/Navbar';
import Carousel from '@/components/Carousel';
import CategoryCards from '@/components/CategoryCards';
import ProductGrid from '@/components/ProductGrid';
import CartDrawer from '@/components/CartDrawer';
import WhatsAppModal from '@/components/WhatsAppModal';
import Footer from '@/components/Footer';
import AdminPanel from '@/components/admin/AdminPanel';

function StoreFront() {
  const { categories, loading: catLoading } = useCategories();
  const { slides, loading: slideLoading } = useCarousel();
  const { settings } = useSettings();
  const [view, setView] = useState<string>('home');
  const [searchQuery, setSearchQuery] = useState('');

  const storeName = settings.store_name || 'MR Áurea';
  const whatsappNumber = settings.whatsapp_number || '1234567890';

  const activeCategorySlug = view.startsWith('category:') ? view.split(':')[1] : null;
  const activeCategory = categories.find((c) => c.slug === activeCategorySlug);
  const { products: categoryProducts, loading: prodLoading } = useProducts(
    activeCategory?.id || undefined
  );
  const { products: allProducts, loading: allProdLoading } = useAllProducts();

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const q = searchQuery.toLowerCase();
    return allProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }, [searchQuery, allProducts]);

  const isAdmin = view === 'admin';

  const handleNavigate = (newView: string) => {
    setView(newView);
    setSearchQuery('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isAdmin) {
    return (
      <>
        <Navbar
          categories={categories}
          onNavigate={handleNavigate}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          storeName={storeName}
        />
        <AdminPanel />
        <Footer storeName={storeName} whatsappNumber={whatsappNumber} />
      </>
    );
  }

  const showSearch = searchQuery.trim().length > 0 && searchResults;

  return (
    <>
      <Navbar
        categories={categories}
        onNavigate={handleNavigate}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        storeName={storeName}
      />

      {showSearch ? (
        <ProductGrid
          products={searchResults}
          loading={allProdLoading}
          title={`Resultados para "${searchQuery}"`}
          subtitle={`${searchResults.length} producto(s) encontrado(s)`}
        />
      ) : activeCategory ? (
        <ProductGrid
          products={categoryProducts}
          loading={prodLoading}
          title={activeCategory.name}
          subtitle="Descubre nuestra selección exclusiva"
        />
      ) : (
        <>
          {!slideLoading && <Carousel slides={slides} onNavigate={handleNavigate} />}
          {!catLoading && <CategoryCards categories={categories} onNavigate={handleNavigate} />}
          <ProductGrid
            products={allProducts}
            loading={allProdLoading}
            title="Nuestros Productos"
            subtitle="Piezas únicas para cada ocasión"
          />
        </>
      )}

      <Footer storeName={storeName} whatsappNumber={whatsappNumber} />
    </>
  );
}

function AppInner() {
  const { isCartOpen, closeCart } = useCart();
  const { settings } = useSettings();
  const whatsappNumber = settings.whatsapp_number || '1234567890';

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <StoreFront />
      <CartDrawer whatsappNumber={whatsappNumber} />
      <WhatsAppModal whatsappNumber={whatsappNumber} />
    </div>
  );
}

export default function App() {
  return (
    <AdminProvider>
      <CartProvider>
        <AppInner />
      </CartProvider>
    </AdminProvider>
  );
}
