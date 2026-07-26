import React, { useState } from 'react';
import { Layers, Plus, Edit2, Trash2, Image, Check, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Category } from '../../types';

export const AdminCategoryManager: React.FC = () => {
  const { categories, createCategory, updateCategory, deleteCategory, showToast } = useApp();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCatId, setEditingCatId] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [type, setType] = useState<'1v1' | '2v2' | 'weekly' | 'special'>('1v1');

  const handleOpenCreate = () => {
    setEditingCatId(null);
    setName('');
    setImageUrl('https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80');
    setType('1v1');
    setIsFormOpen(true);
  };

  const handleOpenEdit = (cat: Category) => {
    setEditingCatId(cat.id);
    setName(cat.name);
    setImageUrl(cat.imageUrl);
    setType(cat.type);
    setIsFormOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !imageUrl.trim()) {
      showToast('Please enter category name and image URL!');
      return;
    }

    if (editingCatId) {
      updateCategory(editingCatId, { name, imageUrl, type });
    } else {
      createCategory({ name, imageUrl, type });
    }

    setIsFormOpen(false);
  };

  return (
    <div className="space-y-4 pb-20 pt-2 px-3 sm:px-4 max-w-5xl mx-auto">
      <div className="bg-[#121722] rounded-2xl p-4 border border-amber-500/40 shadow-md flex justify-between items-center">
        <div>
          <h2 className="text-xl font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-5 h-5 text-amber-400" /> CATEGORY MANAGER
          </h2>
          <p className="text-xs text-gray-400">Create, edit, or delete Lone Wolf tournament categories.</p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2 bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-extrabold text-xs rounded-xl uppercase tracking-wider shadow-lg transition-all cursor-pointer flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Add New Category
        </button>
      </div>

      {/* Add / Edit Form Drawer */}
      {isFormOpen && (
        <form onSubmit={handleSubmit} className="bg-[#121722] p-5 rounded-2xl border-2 border-red-500/60 space-y-3 shadow-xl">
          <div className="flex justify-between items-center pb-2 border-b border-gray-800">
            <h3 className="font-extrabold text-white text-sm">
              {editingCatId ? 'Edit Category' : 'Create New Category'}
            </h3>
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="p-1 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="block text-gray-300 font-semibold mb-1">Category Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Lone Wolf 1v1 Solo"
                className="w-full bg-[#182030] border border-gray-700 rounded-xl px-3 py-2 text-white"
                required
              />
            </div>

            <div>
              <label className="block text-gray-300 font-semibold mb-1">Category Format Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full bg-[#182030] border border-gray-700 rounded-xl px-3 py-2 text-white"
              >
                <option value="1v1">Lone Wolf 1v1</option>
                <option value="2v2">Lone Wolf 2v2</option>
                <option value="weekly">Weekly Tournament</option>
                <option value="special">Special Event</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-300 font-semibold mb-1">Category Image URL</label>
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

          <div className="flex justify-end gap-2 pt-2">
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
              Save Category ✅
            </button>
          </div>
        </form>
      )}

      {/* Category List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="bg-[#121722] rounded-2xl overflow-hidden border border-gray-800 hover:border-amber-500/50 transition-all shadow-md flex flex-col justify-between"
          >
            <div className="h-32 relative">
              <img src={cat.imageUrl} alt={cat.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#121722] via-transparent to-transparent p-3 flex flex-col justify-end">
                <span className="px-2 py-0.5 bg-red-600 text-white font-black text-[9px] rounded uppercase w-fit">
                  {cat.type}
                </span>
                <h3 className="text-sm font-extrabold text-white mt-1">{cat.name}</h3>
              </div>
            </div>

            <div className="p-3 flex items-center justify-between border-t border-gray-800 bg-[#182030]/50 text-xs">
              <span className="text-gray-400 font-bold">{cat.activeMatchesCount || 0} Matches</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleOpenEdit(cat)}
                  className="p-1.5 bg-gray-800 hover:bg-gray-700 text-amber-400 rounded-lg cursor-pointer"
                  title="Edit"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => deleteCategory(cat.id)}
                  className="p-1.5 bg-gray-800 hover:bg-red-950 text-red-400 rounded-lg cursor-pointer"
                  title="Delete"
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
