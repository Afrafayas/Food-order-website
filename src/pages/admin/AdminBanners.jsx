import React, { useEffect, useState } from 'react';
import { getBanners } from '../../services/api';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Plus, Trash2, Image } from 'lucide-react';

const AdminBanners = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', subtitle: '', imageUrl: '', isActive: true });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const res = await getBanners();
      setBanners(res.data);
    } catch (err) {
      toast.error('Failed to load banners');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const auth = JSON.parse(localStorage.getItem('auth'));
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/banners`,
        form,
        { headers: { Authorization: `Bearer ${auth?.token}` } }
      );
      setBanners(prev => [res.data, ...prev]);
      setForm({ title: '', subtitle: '', imageUrl: '', isActive: true });
      setShowForm(false);
      toast.success('Banner added!');
    } catch (err) {
      toast.error('Failed to add banner');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const auth = JSON.parse(localStorage.getItem('auth'));
      await axios.delete(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/banners/${id}`,
        { headers: { Authorization: `Bearer ${auth?.token}` } }
      );
      setBanners(prev => prev.filter(b => b._id !== id));
      toast.success('Banner deleted!');
    } catch (err) {
      toast.error('Failed to delete banner');
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <p className="text-orange-500 text-xl font-bold">Loading...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">🖼️ Manage Banners</h1>
            <p className="text-gray-500 mt-1">Add and manage homepage banners</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-xl hover:bg-orange-600 transition font-semibold"
          >
            <Plus size={18} />
            Add Banner
          </button>
        </div>

        {/* Add Banner Form */}
        {showForm && (
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">New Banner</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-600 mb-1 block">Title *</label>
                  <input
                    required
                    value={form.title}
                    onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                    placeholder="Banner title"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600 mb-1 block">Subtitle</label>
                  <input
                    value={form.subtitle}
                    onChange={e => setForm(p => ({ ...p, subtitle: e.target.value }))}
                    placeholder="Banner subtitle"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-600 mb-1 block">Image URL *</label>
                <input
                  required
                  value={form.imageUrl}
                  onChange={e => setForm(p => ({ ...p, imageUrl: e.target.value }))}
                  placeholder="https://example.com/banner.jpg"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={form.isActive}
                  onChange={e => setForm(p => ({ ...p, isActive: e.target.checked }))}
                  className="w-4 h-4 accent-orange-500"
                />
                <label htmlFor="isActive" className="text-sm text-gray-600">Active</label>
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-orange-500 text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-orange-600 transition"
                >
                  {saving ? 'Saving...' : 'Add Banner'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="border border-gray-200 text-gray-600 px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Banners Grid */}
        {banners.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <Image size={48} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-400 text-lg">No banners yet</p>
            <p className="text-gray-400 text-sm">Add your first banner!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {banners.map(banner => (
              <div key={banner._id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="h-40 bg-gray-100 relative">
                  {banner.imageUrl ? (
                    <img
                      src={banner.imageUrl}
                      alt={banner.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Image size={32} className="text-gray-300" />
                    </div>
                  )}
                  <span className={`absolute top-3 right-3 text-xs px-2 py-1 rounded-full font-semibold ${
                    banner.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {banner.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-gray-800">{banner.title}</p>
                    {banner.subtitle && (
                      <p className="text-sm text-gray-500">{banner.subtitle}</p>
                    )}
                  </div>
                  <button
                    onClick={() => handleDelete(banner._id)}
                    className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminBanners;