import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import ImageUpload from '../../components/ImageUpload';
import { Trash } from 'lucide-react';

interface GalleryItem {
  id: string;
  title?: string;
  caption?: string;
  imageUrl: string;
  sortOrder: number;
  isActive: boolean;
}

const GalleryList: React.FC = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchGallery = async () => {
    try {
      const res = await api.get('/admin/gallery');
      setItems(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const handleAdd = async (url: string) => {
    if (!url) return;
    try {
      await api.post('/admin/gallery', {
        imageUrl: url,
        sortOrder: items.length,
        isActive: true
      });
      fetchGallery();
    } catch (error) {
      alert('Failed to add item');
    }
  };

  const handleUpdate = async (id: string, data: Partial<GalleryItem>) => {
    try {
      await api.put(`/admin/gallery/${id}`, data);
      // Optimistic update
      setItems(items.map(i => i.id === id ? { ...i, ...data } : i));
    } catch (error) {
      alert('Update failed');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this image?')) {
      try {
        await api.delete(`/admin/gallery/${id}`);
        setItems(items.filter(i => i.id !== id));
      } catch (error) {
        alert('Delete failed');
      }
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Home Gallery</h1>

      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h3 className="text-lg font-medium mb-4">Add New Image</h3>
        <ImageUpload onChange={handleAdd} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow overflow-hidden group">
            <div className="aspect-w-16 aspect-h-9 bg-gray-200 h-48 overflow-hidden relative">
              <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
              <button
                onClick={() => handleDelete(item.id)}
                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 space-y-3">
              <input
                value={item.title || ''}
                onChange={(e) => handleUpdate(item.id, { title: e.target.value })}
                placeholder="Title"
                className="w-full border p-1 rounded text-sm font-medium"
              />
              <input
                value={item.caption || ''}
                onChange={(e) => handleUpdate(item.id, { caption: e.target.value })}
                placeholder="Caption"
                className="w-full border p-1 rounded text-sm text-gray-500"
              />
              <div className="flex items-center justify-between">
                 <div className="flex items-center space-x-2">
                   <span className="text-xs text-gray-500">Order:</span>
                   <input
                      type="number"
                      value={item.sortOrder}
                      onChange={(e) => handleUpdate(item.id, { sortOrder: Number(e.target.value) })}
                      className="w-12 border p-1 rounded text-sm"
                    />
                 </div>
                 <div className="flex items-center">
                   <input
                     type="checkbox"
                     checked={item.isActive}
                     onChange={(e) => handleUpdate(item.id, { isActive: e.target.checked })}
                     className="h-4 w-4 text-ocean rounded"
                   />
                   <span className="ml-2 text-xs text-gray-500">Active</span>
                 </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GalleryList;
