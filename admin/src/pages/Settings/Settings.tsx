import React, { useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import api from '../../api/axios';
import { Trash, Plus } from 'lucide-react';

const Settings: React.FC = () => {
  const { register, control, handleSubmit, reset } = useForm({
    defaultValues: {
      siteName: '',
      logoUrl: '',
      contactEmail: '',
      phone: '',
      whatsapp: '',
      address: '',
      socials: [] as { platform: string; url: string }[]
    }
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'socials' });

  useEffect(() => {
    api.get('/admin/settings').then(res => {
      // Ensure socials is array if null
      const data = { ...res.data, socials: res.data.socials || [] };
      reset(data);
    });
  }, [reset]);

  const onSubmit = async (data: any) => {
    try {
      await api.put('/admin/settings', data);
      alert('Settings saved');
    } catch (error) {
      alert('Failed to save settings');
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Site Settings</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-lg shadow space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <div>
              <label className="block text-sm font-medium text-gray-700">Site Name</label>
              <input {...register('siteName')} className="mt-1 block w-full border p-2 rounded" />
           </div>
           <div>
              <label className="block text-sm font-medium text-gray-700">Contact Email</label>
              <input {...register('contactEmail')} className="mt-1 block w-full border p-2 rounded" />
           </div>
           <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input {...register('phone')} className="mt-1 block w-full border p-2 rounded" />
           </div>
           <div>
              <label className="block text-sm font-medium text-gray-700">WhatsApp</label>
              <input {...register('whatsapp')} className="mt-1 block w-full border p-2 rounded" />
           </div>
        </div>

        <div>
           <label className="block text-sm font-medium text-gray-700">Address</label>
           <textarea {...register('address')} rows={3} className="mt-1 block w-full border p-2 rounded" />
        </div>

        {/* Logo Upload would go here using Controller if needed, let's just use URL input or ImageUpload */}
        {/* Simplified for brevity, assume simple input or enhance later */}

        <div>
           <label className="block text-sm font-medium text-gray-700 mb-2">Social Media Links</label>
           {fields.map((field, index) => (
             <div key={field.id} className="flex items-center space-x-2 mb-2">
               <input {...register(`socials.${index}.platform`)} placeholder="Platform (e.g. Facebook)" className="w-1/3 border p-2 rounded" />
               <input {...register(`socials.${index}.url`)} placeholder="URL" className="flex-1 border p-2 rounded" />
               <button type="button" onClick={() => remove(index)} className="text-red-500"><Trash className="w-4 h-4"/></button>
             </div>
           ))}
           <button type="button" onClick={() => append({ platform: '', url: '' })} className="text-sm text-ocean flex items-center">
             <Plus className="w-4 h-4 mr-1"/> Add Social Link
           </button>
        </div>

        <div className="flex justify-end">
          <button type="submit" className="bg-ocean text-white px-6 py-2 rounded hover:bg-blue-700">
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
