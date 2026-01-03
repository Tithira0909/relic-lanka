import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import api from '../../api/axios';
import { ArrowLeft } from 'lucide-react';
import MultiImageUpload from '../../components/MultiImageUpload';

interface DestinationFormData {
  name: string;
  description: string;
  tourId: string | null;
  sortOrder: number;
}

const DestinationEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;
  const { register, handleSubmit, reset } = useForm<DestinationFormData>();
  const [images, setImages] = useState<{ imageUrl: string; caption?: string; sortOrder?: number }[]>([]);
  const [tours, setTours] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    fetchTours();
    if (isEdit) {
      fetchDestination();
    }
  }, [id]);

  const fetchTours = async () => {
    try {
      const res = await api.get('/admin/tours'); // Assuming this endpoint exists and returns list
      setTours(res.data);
    } catch (e) { console.error(e); }
  };

  const fetchDestination = async () => {
    try {
      const res = await api.get(`/admin/destinations/${id}`);
      const { images: destImages, ...data } = res.data;
      reset(data);
      if (destImages) setImages(destImages);
    } catch (error) {
      alert('Failed to load');
    }
  };

  const onSubmit = async (data: DestinationFormData) => {
    try {
      const payload = {
          ...data,
          sortOrder: Number(data.sortOrder),
          images,
          tourId: data.tourId === '' ? null : data.tourId
      };

      if (isEdit) {
        await api.put(`/admin/destinations/${id}`, payload);
      } else {
        await api.post('/admin/destinations', payload);
      }
      navigate('/admin/destinations');
    } catch (error) {
      console.error(error);
      alert('Failed to save');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 flex items-center">
        <button onClick={() => navigate('/admin/destinations')} className="mr-4 text-gray-500 hover:text-gray-700">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">{isEdit ? 'Edit Destination' : 'New Destination'}</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-6 rounded-lg shadow">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input {...register('name', { required: true })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-ocean focus:ring-ocean" />
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

        <div>
            <label className="block text-sm font-medium text-gray-700">Sort Order</label>
            <input type="number" {...register('sortOrder')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-ocean focus:ring-ocean" defaultValue={0} />
        </div>

        <div>
            <MultiImageUpload images={images} onChange={setImages} label="Images" />
        </div>

        <div className="flex justify-end">
          <button type="submit" className="bg-ocean text-white px-4 py-2 rounded-md hover:bg-blue-700">
            Save Destination
          </button>
        </div>
      </form>
    </div>
  );
};

export default DestinationEditor;
