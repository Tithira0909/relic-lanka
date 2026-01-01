import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';

const PageEditor: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    // Since we don't have getPageById, we fetch all and find or add getPageById.
    // Actually getPageByKey is public. Admin should have getPageById?
    // Let's just use the list and find it or adding a specific endpoint is better.
    // I'll fetch list and find for now as it's small data.
    api.get('/admin/pages').then(res => {
      const page = res.data.find((p: any) => p.id === id);
      if (page) reset(page);
    });
  }, [id, reset]);

  const onSubmit = async (data: any) => {
    try {
      await api.put(`/admin/pages/${id}`, data);
      navigate('/admin/pages');
    } catch (error) {
      alert('Failed to update page');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Edit Page</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-lg shadow space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Page Title</label>
          <input {...register('title')} className="mt-1 block w-full border p-2 rounded" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Content (HTML)</label>
          <p className="text-xs text-gray-500 mb-2">Use standard HTML tags.</p>
          <textarea {...register('contentHtml')} rows={15} className="mt-1 block w-full border p-2 rounded font-mono text-sm" />
        </div>

        <div className="border-t pt-4">
          <h3 className="font-medium mb-4">SEO</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">SEO Title</label>
              <input {...register('seoTitle')} className="mt-1 block w-full border p-2 rounded" />
            </div>
             <div>
              <label className="block text-sm font-medium text-gray-700">SEO Description</label>
              <textarea {...register('seoDescription')} rows={3} className="mt-1 block w-full border p-2 rounded" />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button type="submit" className="bg-ocean text-white px-6 py-2 rounded hover:bg-blue-700">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default PageEditor;
