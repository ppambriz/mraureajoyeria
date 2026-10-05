import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { CarouselSlide } from '@/types';
import { Plus, Trash2, Edit3, X, ArrowUp, ArrowDown, Check } from 'lucide-react';

export default function CarouselManager() {
  const [slides, setSlides] = useState<CarouselSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<CarouselSlide | null>(null);
  const [showForm, setShowForm] = useState(false);

  const loadSlides = async () => {
    const { data } = await supabase
      .from('carousel_slides')
      .select('*')
      .order('display_order', { ascending: true });
    if (data) setSlides(data);
    setLoading(false);
  };

  useEffect(() => {
    loadSlides();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar esta diapositiva del carrusel?')) return;
    await supabase.from('carousel_slides').delete().eq('id', id);
    loadSlides();
  };

  const moveSlide = async (slide: CarouselSlide, direction: 'up' | 'down') => {
    const sorted = [...slides].sort((a, b) => a.display_order - b.display_order);
    const index = sorted.findIndex((s) => s.id === slide.id);
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sorted.length) return;

    const target = sorted[targetIndex];
    await supabase.from('carousel_slides').update({ display_order: target.display_order }).eq('id', slide.id);
    await supabase.from('carousel_slides').update({ display_order: slide.display_order }).eq('id', target.id);
    loadSlides();
  };

  const toggleActive = async (slide: CarouselSlide) => {
    await supabase.from('carousel_slides').update({ is_active: !slide.is_active }).eq('id', slide.id);
    loadSlides();
  };

  if (loading) return <div className="text-center py-8 text-rose-400">Cargando...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-serif text-rose-950">Diapositivas del Carrusel</h3>
        <button
          onClick={() => { setEditing(null); setShowForm(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-sm font-medium rounded-lg transition-all"
        >
          <Plus className="w-4 h-4" /> Agregar
        </button>
      </div>

      {showForm && (
        <CarouselForm
          slide={editing}
          onClose={() => { setShowForm(false); setEditing(null); }}
          onSaved={() => { loadSlides(); setShowForm(false); setEditing(null); }}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {slides.map((slide, index) => (
          <div key={slide.id} className="bg-white rounded-xl border border-rose-100 overflow-hidden shadow-sm">
            <div className="relative h-32 bg-rose-50">
              <img src={slide.image_url} alt={slide.title} className="w-full h-full object-cover" />
              <div className="absolute top-2 right-2 flex gap-1">
                <button
                  onClick={() => toggleActive(slide)}
                  className={`p-1.5 rounded-lg transition-all ${slide.is_active ? 'bg-green-500 text-white' : 'bg-gray-400 text-white'}`}
                  title={slide.is_active ? 'Activo' : 'Inactivo'}
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <div className="p-4">
              <h4 className="font-serif text-rose-950">{slide.title}</h4>
              <p className="text-sm text-rose-400 mt-1">{slide.subtitle}</p>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => moveSlide(slide, 'up')}
                  disabled={index === 0}
                  className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-all disabled:opacity-30"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
                <button
                  onClick={() => moveSlide(slide, 'down')}
                  disabled={index === slides.length - 1}
                  className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-all disabled:opacity-30"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>
                <button
                  onClick={() => { setEditing(slide); setShowForm(true); }}
                  className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(slide.id)}
                  className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-all ml-auto"
                >
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

function CarouselForm({ slide, onClose, onSaved }: { slide: CarouselSlide | null; onClose: () => void; onSaved: () => void }) {
  const [title, setTitle] = useState(slide?.title || '');
  const [subtitle, setSubtitle] = useState(slide?.subtitle || '');
  const [imageUrl, setImageUrl] = useState(slide?.image_url || '');
  const [linkUrl, setLinkUrl] = useState(slide?.link_url || '');
  const [displayOrder, setDisplayOrder] = useState(slide?.display_order || 0);
  const [isActive, setIsActive] = useState(slide?.is_active ?? true);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = { title, subtitle, image_url: imageUrl, link_url: linkUrl || '#', display_order: displayOrder, is_active: isActive };
    if (slide) {
      await supabase.from('carousel_slides').update(payload).eq('id', slide.id);
    } else {
      await supabase.from('carousel_slides').insert(payload);
    }
    setSaving(false);
    onSaved();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-rose-950/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-serif text-rose-950">{slide ? 'Editar' : 'Nueva'} Diapositiva</h3>
          <button onClick={onClose} className="p-2 text-rose-400 hover:bg-rose-50 rounded-lg"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-rose-950 mb-1">Título</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required
              className="w-full px-4 py-2.5 bg-rose-50 border border-rose-200 rounded-lg text-rose-950 focus:outline-none focus:ring-2 focus:ring-rose-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-rose-950 mb-1">Subtítulo</label>
            <input type="text" value={subtitle} onChange={(e) => setSubtitle(e.target.value)}
              className="w-full px-4 py-2.5 bg-rose-50 border border-rose-200 rounded-lg text-rose-950 focus:outline-none focus:ring-2 focus:ring-rose-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-rose-950 mb-1">URL de Imagen</label>
            <input type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} required
              className="w-full px-4 py-2.5 bg-rose-50 border border-rose-200 rounded-lg text-rose-950 focus:outline-none focus:ring-2 focus:ring-rose-500" />
          </div>
          {imageUrl && <img src={imageUrl} alt="Preview" className="w-full h-32 object-cover rounded-lg" />}
          <div>
            <label className="block text-sm font-medium text-rose-950 mb-1">Enlace (ej: #collares)</label>
            <input type="text" value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)}
              className="w-full px-4 py-2.5 bg-rose-50 border border-rose-200 rounded-lg text-rose-950 focus:outline-none focus:ring-2 focus:ring-rose-500" />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-rose-950 mb-1">Orden</label>
              <input type="number" value={displayOrder} onChange={(e) => setDisplayOrder(Number(e.target.value))}
                className="w-full px-4 py-2.5 bg-rose-50 border border-rose-200 rounded-lg text-rose-950 focus:outline-none focus:ring-2 focus:ring-rose-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-rose-950 mb-1">Activo</label>
              <button type="button" onClick={() => setIsActive(!isActive)}
                className={`px-4 py-2.5 rounded-lg font-medium transition-all ${isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                {isActive ? 'Sí' : 'No'}
              </button>
            </div>
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
