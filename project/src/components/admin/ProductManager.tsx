import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { Product, Category } from '@/types';
import { formatPrice } from '@/lib/format';
import { Plus, Trash2, Edit3, X, ArrowUp, ArrowDown, Filter } from 'lucide-react';

export default function ProductManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [filterCat, setFilterCat] = useState<string>('all');

  const load = async () => {
    const [{ data: p }, { data: c }] = await Promise.all([
      supabase.from('products').select('*').order('display_order', { ascending: true }),
      supabase.from('categories').select('*').order('display_order', { ascending: true }),
    ]);
    if (p) setProducts(p);
    if (c) setCategories(c);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este producto?')) return;
    await supabase.from('products').delete().eq('id', id);
    load();
  };

  const moveProduct = async (prod: Product, direction: 'up' | 'down') => {
    const filtered = filteredProducts;
    const index = filtered.findIndex((p) => p.id === prod.id);
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= filtered.length) return;
    const target = filtered[targetIndex];
    await supabase.from('products').update({ display_order: target.display_order }).eq('id', prod.id);
    await supabase.from('products').update({ display_order: prod.display_order }).eq('id', target.id);
    load();
  };

  const filteredProducts = filterCat === 'all' ? products : products.filter((p) => p.category_id === filterCat);

  const catName = (id: string) => categories.find((c) => c.id === id)?.name || 'Sin categoría';

  if (loading) return <div className="text-center py-8 text-rose-400">Cargando...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <h3 className="text-xl font-serif text-rose-950">Productos</h3>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-rose-400" />
            <select
              value={filterCat}
              onChange={(e) => setFilterCat(e.target.value)}
              className="px-3 py-2 bg-rose-50 border border-rose-200 rounded-lg text-rose-950 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
            >
              <option value="all">Todas las categorías</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <button
            onClick={() => { setEditing(null); setShowForm(true); }}
            className="flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-sm font-medium rounded-lg transition-all"
          >
            <Plus className="w-4 h-4" /> Agregar
          </button>
        </div>
      </div>

      {showForm && (
        <ProductForm product={editing} categories={categories} onClose={() => { setShowForm(false); setEditing(null); }}
          onSaved={() => { load(); setShowForm(false); setEditing(null); }} />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts.map((prod, index) => (
          <div key={prod.id} className="bg-white rounded-xl border border-rose-100 overflow-hidden shadow-sm">
            <div className="relative h-32 bg-rose-50">
              <img src={prod.image_url} alt={prod.name} className="w-full h-full object-cover" />
              <span className="absolute top-2 left-2 px-2 py-0.5 bg-rose-950/70 text-white text-xs rounded-full">
                {catName(prod.category_id)}
              </span>
            </div>
            <div className="p-4">
              <h4 className="font-serif text-rose-950 text-sm">{prod.name}</h4>
              <p className="text-rose-600 font-semibold text-sm mt-1">{formatPrice(prod.price)}</p>
              <div className="flex gap-2 mt-3">
                <button onClick={() => moveProduct(prod, 'up')} disabled={index === 0}
                  className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-all disabled:opacity-30">
                  <ArrowUp className="w-4 h-4" />
                </button>
                <button onClick={() => moveProduct(prod, 'down')} disabled={index === filteredProducts.length - 1}
                  className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-all disabled:opacity-30">
                  <ArrowDown className="w-4 h-4" />
                </button>
                <button onClick={() => { setEditing(prod); setShowForm(true); }}
                  className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-all">
                  <Edit3 className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(prod.id)}
                  className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-all ml-auto">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProductForm({ product, categories, onClose, onSaved }: {
  product: Product | null;
  categories: Category[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const [name, setName] = useState(product?.name || '');
  const [description, setDescription] = useState(product?.description || '');
  const [price, setPrice] = useState(product?.price || 0);
  const [imageUrl, setImageUrl] = useState(product?.image_url || '');
  const [categoryId, setCategoryId] = useState(product?.category_id || (categories[0]?.id || ''));
  const [displayOrder, setDisplayOrder] = useState(product?.display_order || 0);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = { name, description, price: Number(price), image_url: imageUrl, category_id: categoryId, display_order: displayOrder };
    if (product) {
      await supabase.from('products').update(payload).eq('id', product.id);
    } else {
      await supabase.from('products').insert(payload);
    }
    setSaving(false);
    onSaved();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-rose-950/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-serif text-rose-950">{product ? 'Editar' : 'Nuevo'} Producto</h3>
          <button onClick={onClose} className="p-2 text-rose-400 hover:bg-rose-50 rounded-lg"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-rose-950 mb-1">Nombre</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required
              className="w-full px-4 py-2.5 bg-rose-50 border border-rose-200 rounded-lg text-rose-950 focus:outline-none focus:ring-2 focus:ring-rose-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-rose-950 mb-1">Descripción</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2}
              className="w-full px-4 py-2.5 bg-rose-50 border border-rose-200 rounded-lg text-rose-950 focus:outline-none focus:ring-2 focus:ring-rose-500 resize-none" />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-rose-950 mb-1">Precio (MXN)</label>
              <input type="number" step="0.01" value={price} onChange={(e) => setPrice(Number(e.target.value))} required
                className="w-full px-4 py-2.5 bg-rose-50 border border-rose-200 rounded-lg text-rose-950 focus:outline-none focus:ring-2 focus:ring-rose-500" />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-rose-950 mb-1">Orden</label>
              <input type="number" value={displayOrder} onChange={(e) => setDisplayOrder(Number(e.target.value))}
                className="w-full px-4 py-2.5 bg-rose-50 border border-rose-200 rounded-lg text-rose-950 focus:outline-none focus:ring-2 focus:ring-rose-500" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-rose-950 mb-1">Categoría</label>
            <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required
              className="w-full px-4 py-2.5 bg-rose-50 border border-rose-200 rounded-lg text-rose-950 focus:outline-none focus:ring-2 focus:ring-rose-500">
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-rose-950 mb-1">URL de Imagen</label>
            <input type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} required
              className="w-full px-4 py-2.5 bg-rose-50 border border-rose-200 rounded-lg text-rose-950 focus:outline-none focus:ring-2 focus:ring-rose-500" />
          </div>
          {imageUrl && <img src={imageUrl} alt="Preview" className="w-full h-32 object-cover rounded-lg" />}
          <button type="submit" disabled={saving}
            className="w-full px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white font-medium rounded-xl transition-all disabled:opacity-50">
            {saving ? 'Guardando...' : 'Guardar'}
          </button>
        </form>
      </div>
    </div>
  );
}
