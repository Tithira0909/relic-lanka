import React, { useState } from 'react';
import api from '../api/axios';
import { X } from 'lucide-react';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  className?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ value, onChange, label, className }) => {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    try {
      const res = await api.post('/admin/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      onChange(res.data.url);
    } catch (error) {
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={className}>
      {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
      <div className="flex items-center space-x-4">
        {value ? (
          <div className="relative w-32 h-20 bg-gray-100 rounded overflow-hidden border">
            <img src={value} alt="Uploaded" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => onChange('')}
              className="absolute top-1 right-1 bg-white rounded-full p-1 shadow hover:bg-red-50"
            >
              <X className="w-3 h-3 text-red-600" />
            </button>
          </div>
        ) : (
          <div className="w-32 h-20 bg-gray-50 border-2 border-dashed border-gray-300 rounded flex items-center justify-center text-gray-400">
            <span className="text-xs">No Image</span>
          </div>
        )}

        <div>
           <label className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none">
             <span>{uploading ? 'Uploading...' : 'Upload Image'}</span>
             <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} disabled={uploading} />
           </label>
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;
