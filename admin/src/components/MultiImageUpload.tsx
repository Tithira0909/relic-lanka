import React, { useState } from 'react';
import api from '../api/axios';
import { X, Plus } from 'lucide-react';

interface MultiImageUploadProps {
  images: { imageUrl: string; caption?: string; sortOrder?: number }[];
  onChange: (images: { imageUrl: string; caption?: string; sortOrder?: number }[]) => void;
  label?: string;
}

const MultiImageUpload: React.FC<MultiImageUploadProps> = ({ images, onChange, label }) => {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const newImages = [...images];

    try {
      // Upload sequentially to keep order or parallel? Parallel is faster.
      const uploadPromises = Array.from(files).map(async (file) => {
          const formData = new FormData();
          formData.append('file', file);
          const res = await api.post('/admin/upload', formData, {
              headers: { 'Content-Type': 'multipart/form-data' }
          });
          return { imageUrl: res.data.url, caption: '', sortOrder: 0 };
      });

      const uploaded = await Promise.all(uploadPromises);
      onChange([...newImages, ...uploaded]);
    } catch (error) {
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
      const newImages = [...images];
      newImages.splice(index, 1);
      onChange(newImages);
  };

  const updateCaption = (index: number, caption: string) => {
      const newImages = [...images];
      newImages[index].caption = caption;
      onChange(newImages);
  };

  return (
    <div className="mb-4">
      {label && <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        {images.map((img, idx) => (
            <div key={idx} className="relative group border rounded p-2 bg-gray-50">
                <div className="aspect-video bg-gray-200 mb-2 overflow-hidden rounded relative">
                    <img src={img.imageUrl} alt="" className="w-full h-full object-cover" />
                    <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute top-1 right-1 bg-white rounded-full p-1 shadow hover:bg-red-50"
                    >
                        <X className="w-3 h-3 text-red-600" />
                    </button>
                </div>
                <input
                    type="text"
                    placeholder="Caption"
                    value={img.caption || ''}
                    onChange={(e) => updateCaption(idx, e.target.value)}
                    className="w-full text-xs border rounded p-1"
                />
            </div>
        ))}

        <label className="border-2 border-dashed border-gray-300 rounded flex flex-col items-center justify-center p-4 cursor-pointer hover:bg-gray-50 h-full min-h-[150px]">
             {uploading ? (
                 <span className="text-sm text-gray-500">Uploading...</span>
             ) : (
                 <>
                    <Plus className="w-6 h-6 text-gray-400 mb-1" />
                    <span className="text-sm text-gray-500">Add Images</span>
                 </>
             )}
             <input type="file" className="hidden" accept="image/*" multiple onChange={handleFileChange} disabled={uploading} />
        </label>
      </div>
    </div>
  );
};

export default MultiImageUpload;
