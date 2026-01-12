import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import api from '../../api/axios';
import { ArrowLeft, Plus, X } from 'lucide-react';
import MultiImageUpload from '../../components/MultiImageUpload';

interface ExperienceFormData {
  title: string;
  description: string;
  tourId: string | null;
  sortOrder: number;
}

const ExperienceEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;
  const { register, handleSubmit, reset } = useForm<ExperienceFormData>();
  const [images, setImages] = useState<{ imageUrl: string; caption?: string; sortOrder?: number }[]>([]);
  const [tours, setTours] = useState<{ id: string; name: string }[]>([]);
  const [adventureItems, setAdventureItems] = useState<string[]>([]);
  const [newItem, setNewItem] = useState('');

  useEffect(() => {
    fetchTours();
    if (isEdit) {
      fetchExperience();
    }
  }, [id]);

  const fetchTours = async () => {
    try {
      const res = await api.get('/admin/tours');
      setTours(res.data);
    } catch (e) { console.error(e); }
  };

  const fetchExperience = async () => {
    try {
      const res = await api.get(`/admin/experiences/${id}`);
      const { images: expImages, adventureItems: items, ...data } = res.data;
      reset(data);
      if (expImages) setImages(expImages);
      if (items && Array.isArray(items)) setAdventureItems(items);
    } catch (error) {
      alert('Failed to load');
    }
  };

  const addItem = () => {
      if (newItem.trim()) {
          setAdventureItems([...adventureItems, newItem.trim()]);
          setNewItem('');
      }
  };

  const removeItem = (index: number) => {
      const newItems = [...adventureItems];
      newItems.splice(index, 1);
      setAdventureItems(newItems);
  };

  const onSubmit = async (data: ExperienceFormData) => {
    try {
      const payload = {
          ...data,
          sortOrder: Number(data.sortOrder),
          images,
          adventureItems,
          tourId: data.tourId === '' ? null : data.tourId
      };

      if (isEdit) {
        await api.put(`/admin/experiences/${id}`, payload);
      } else {
        await api.post('/admin/experiences', payload);
      }
      navigate('/admin/experiences');
    } catch (error) {
      console.error(error);
      alert('Failed to save');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 flex items-center">
        <button onClick={() => navigate('/admin/experiences')} className="mr-4 text-gray-500 hover:text-gray-700">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">{isEdit ? 'Edit Experience' : 'New Experience'}</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-6 rounded-lg shadow">
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input {...register('title', { required: true })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-ocean focus:ring-ocean" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Linked Tour (Optional)</label>
          <select {...register('tourId')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-ocean focus:ring-ocean">
            <option value="">None</option>
            {tours.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea {...register('description')} rows={4} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-ocean focus:ring-ocean" />
        </div>

        {/* Adventure Items */}
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Adventure Items</label>
            <div className="flex space-x-2 mb-2">
                <input
                    type="text"
                    value={newItem}
                    onChange={e => setNewItem(e.target.value)}
                    className="flex-1 rounded-md border-gray-300 shadow-sm"
                    placeholder="Add item..."
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addItem(); } }}
                />
                <button type="button" onClick={addItem} className="bg-gray-200 px-3 rounded hover:bg-gray-300"><Plus className="w-4 h-4" /></button>
            </div>
            <ul className="space-y-1">
                {adventureItems.map((item, idx) => (
                    <li key={idx} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                        <span>{item}</span>
                        <button type="button" onClick={() => removeItem(idx)} className="text-red-500 hover:text-red-700"><X className="w-4 h-4" /></button>
                    </li>
                ))}
            </ul>
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700">Sort Order</label>
            <input type="number" {...register('sortOrder')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-ocean focus:ring-ocean" defaultValue={0} />
        </div>

        <div>
            <MultiImageUpload images={images} onChange={setImages} label="Images" />
        </div>

        <div className="flex justify-end">
          <button type="submit" className="bg-ocean text-white px-4 py-2 rounded-md hover:bg-blue-700">
            Save Experience
          </button>
        </div>
      </form>
    </div>
  );
};

export default ExperienceEditor;
