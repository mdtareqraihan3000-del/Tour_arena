import React, { useState } from 'react';
import { Image, Plus, Edit2, Trash2, Check, X, Eye } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PromoBanner } from '../../types';

export const AdminBannerManager: React.FC = () => {
  const { banners, createBanner, updateBanner, deleteBanner, showToast } = useApp();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBannerId, setEditingBannerId] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [targetUrl, setTargetUrl] = useState('');
  const [active, setActive] = useState(true);

  const handleOpenCreate = () => {
    setEditingBannerId(null);
    setTitle('🔥 GRAND LONE WOLF SEASON TOURNAMENT');
    setSubtitle('Join 1v1 Custom Rooms & Win Huge Cash Prizes Daily!');
    setImageUrl('https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80');
    setTargetUrl('');
    setActive(true);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (b: PromoBanner) => {
    setEditingBannerId(b.id);
    setTitle(b.title);
    setSubtitle(b.subtitle);
    setImageUrl(b.imageUrl);
    setTargetUrl(b.targetUrl || '');
    setActive(b.active);
    setIsFormOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !imageUrl.trim()) {
      showToast('Please enter title and image URL!');
      return;
    }

    if (editingBannerId) {
      updateBanner(editingBannerId, { title, subtitle, imageUrl, targetUrl, active });
    } else {
      createBanner({ title, subtitle, imageUrl, targetUrl, active });
    }

    setIsFormOpen(false);
  };

  return (
    <div className="space-y-4 pb-20 pt-2 px-3 sm:px-4 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-[#121722] rounded-2xl p-4 border border-amber-500/40 shadow-md flex justify-between items-center">
        <div>
          <h2 className="text-xl font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
            <Image className="w-5 h-5 text-amber-400" /> PROMO BANNERS SLIDER
          </h2>
          <p className="text-xs text-gray-400">Add, edit, or delete home screen promotional slider banners.</p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2 bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-extrabold text-xs rounded-xl uppercase tracking-wider shadow-lg transition-all cursor-pointer flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Add Promo Banner
        </button>
      </div>

      {/* Form Drawer */}
      {isFormOpen && (
        <form onSubmit={handleSubmit} className="bg-[#121722] p-5 rounded-2xl border-2 border-red-500/60 space-y-3 shadow-xl">
          <div className="flex justify-between items-center pb-2 border-b border-gray-800">
            <h3 className="font-extrabold text-white text-sm">
              {editingBannerId ? 'Edit Promo Banner' : 'Create New Promo Banner'}
            </h3>
            <button type="button" onClick={() => setIsFormOpen(false)} className="text-gray-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-gray-300 font-semibold mb-1">Banner Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Banner Heading"
                className="w-full bg-[#182030] border border-gray-700 rounded-xl px-3 py-2 text-white"
                required
              />
            </div>

            <div>
              <label className="block text-gray-300 font-semibold mb-1">Subtitle / Tagline</label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="Subheading description"
                className="w-full bg-[#182030] border border-gray-700 rounded-xl px-3 py-2 text-white"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-gray-300 font-semibold mb-1">Image URL</label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://..."
                className="w-full bg-[#182030] border border-gray-700 rounded-xl px-3 py-2 text-white"
                required
              />
            </div>
          </div>

          <div className="flex justify-between items-center pt-2">
            <label className="flex items-center gap-2 text-xs text-gray-300 font-bold cursor-pointer">
              <input
                type="checkbox"
                checked={active}
                onChange={(e) => setActive(e.target.checked)}
                className="w-4 h-4 text-red-600 rounded"
              />
              <span>Active in Home Slider</span>
            </label>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="px-4 py-2 bg-gray-800 text-gray-300 font-bold text-xs rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-gradient-to-r from-red-600 to-amber-500 text-white font-extrabold text-xs rounded-xl uppercase tracking-wider cursor-pointer"
              >
                Save Banner ✅
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Banner Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {banners.map((b) => (
          <div
            key={b.id}
            className="bg-[#121722] rounded-2xl overflow-hidden border border-gray-800 hover:border-amber-500/50 transition-all shadow-md flex flex-col justify-between"
          >
            <div className="h-40 relative">
              <img src={b.imageUrl} alt={b.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#121722] via-transparent to-transparent p-3 flex flex-col justify-end">
                <h3 className="text-base font-extrabold text-white">{b.title}</h3>
                <p className="text-xs text-amber-300 font-semibold">{b.subtitle}</p>
              </div>
            </div>

            <div className="p-3 flex items-center justify-between border-t border-gray-800 bg-[#182030]/50 text-xs">
              <span className={`font-extrabold ${b.active ? 'text-emerald-400' : 'text-gray-500'}`}>
                {b.active ? '● Active in Slider' : '○ Disabled'}
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleOpenEdit(b)}
                  className="p-1.5 bg-gray-800 hover:bg-gray-700 text-amber-400 rounded-lg cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => deleteBanner(b.id)}
                  className="p-1.5 bg-gray-800 hover:bg-red-950 text-red-400 rounded-lg cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
