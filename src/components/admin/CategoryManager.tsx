import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { Category } from '@/types';
import { slugify } from '@/lib/format';
import { Plus, Trash2, Edit3, X, ArrowUp, ArrowDown } from 'lucide-react';

export default function CategoryManager() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Category | null>(null);
  const [showForm, setShowForm] = useState(false);

  const load = async () => {
    const { data } = await supabase.from('categories').select('*').order('display_order', { ascending: true });
    if (data) setCategories(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar esta categoría? Se eliminarán también sus productos.')) return;
    await supabase.from('categories').delete().eq('id', id);
    load();
  };

  const moveCategory = async (cat: Category, direction: 'up' | 'down') => {
    const sorted = [...categories].sort((a, b) => a.display_order - b.display_order);
    const index = sorted.findIndex((c) => c.id === cat.id);
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sorted.length) return;
    const target = sorted[targetIndex];
    await supabase.from('categories').update({ display_order: target.display_order }).eq('id', cat.id);
    await supabase.from('categories').update({ display_order: cat.display_order }).eq('id', target.id);
    load();
  };

  if (loading) return <div className="text-center py-8 text-rose-400">Cargando...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-serif text-rose-950">Categorías</h3>
        <button
          onClick={() => { setEditing(null); setShowForm(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-sm font-medium rounded-lg transition-all"
        >
          <Plus className="w-4 h-4" /> Agregar
        </button>
      </div>

      {showForm && (
        <CategoryForm category={editing} onClose={() => { setShowForm(false); setEditing(null); }}
          onSaved={() => { load(); setShowForm(false); setEditing(null); }} />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat, index) => (
          <div key={cat.id} className="bg-white rounded-xl border border-rose-100 overflow-hidden shadow-sm">
            <div className="relative h-28 bg-rose-50">
              <img src={cat.image_url} alt={cat.name} className="w-full h-full object-cover" />
            </div>
            <div className="p-4">
              <h4 className="font-serif text-rose-950">{cat.name}</h4>
              <p className="text-xs text-rose-400 mt-0.5">/{cat.slug}</p>
              <div className="flex gap-2 mt-3">
                <button onClick={() => moveCategory(cat, 'up')} disabled={index === 0}
                  className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-all disabled:opacity-30">
                  <ArrowUp className="w-4 h-4" />
                </button>
                <button onClick={() => moveCategory(cat, 'down')} disabled={index === categories.length - 1}
                  className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-all disabled:opacity-30">
                  <ArrowDown className="w-4 h-4" />
                </button>
                <button onClick={() => { setEditing(cat); setShowForm(true); }}
                  className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-all">
                  <Edit3 className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(cat.id)}
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

function CategoryForm({ category, onClose, onSaved }: { category: Category | null; onClose: () => void; onSaved: () => void }) {
  const [name, setName] = useState(category?.name || '');
  const [imageUrl, setImageUrl] = useState(category?.image_url || '');
  const [displayOrder, setDisplayOrder] = useState(category?.display_order || 0);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const slug = slugify(name);
    const payload = { name, slug, image_url: imageUrl, display_order: displayOrder };
    if (category) {
      await supabase.from('categories').update(payload).eq('id', category.id);
    } else {
      await supabase.from('categories').insert(payload);
    }
    setSaving(false);
    onSaved();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-rose-950/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-serif text-rose-950">{category ? 'Editar' : 'Nueva'} Categoría</h3>
          <button onClick={onClose} className="p-2 text-rose-400 hover:bg-rose-50 rounded-lg"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-rose-950 mb-1">Nombre</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required
              className="w-full px-4 py-2.5 bg-rose-50 border border-rose-200 rounded-lg text-rose-950 focus:outline-none focus:ring-2 focus:ring-rose-500" />
            <p className="text-xs text-rose-400 mt-1">Slug: {slugify(name) || '...'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-rose-950 mb-1">URL de Imagen</label>
            <input type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} required
              className="w-full px-4 py-2.5 bg-rose-50 border border-rose-200 rounded-lg text-rose-950 focus:outline-none focus:ring-2 focus:ring-rose-500" />
          </div>
          {imageUrl && <img src={imageUrl} alt="Preview" className="w-full h-28 object-cover rounded-lg" />}
          <div>
            <label className="block text-sm font-medium text-rose-950 mb-1">Orden</label>
            <input type="number" value={displayOrder} onChange={(e) => setDisplayOrder(Number(e.target.value))}
              className="w-full px-4 py-2.5 bg-rose-50 border border-rose-200 rounded-lg text-rose-950 focus:outline-none focus:ring-2 focus:ring-rose-500" />
          </div>
          <button type="submit" disabled={saving}
            className="w-full px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white font-medium rounded-xl transition-all disabled:opacity-50">
            {saving ? 'Guardando...' : 'Guardar'}
          </button>
        </form>
      </div>
    </div>
  );
}
