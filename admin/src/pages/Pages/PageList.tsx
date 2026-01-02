import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { Edit } from 'lucide-react';

interface Page {
  id: string;
  key: string;
  title: string;
  updatedAt: string;
}

const PageList: React.FC = () => {
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/pages').then(res => {
      setPages(res.data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Pages</h1>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Page Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Key</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {pages.map((page) => (
              <tr key={page.id}>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{page.title}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{page.key}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{new Date(page.updatedAt).toLocaleDateString()}</td>
                <td className="px-6 py-4 text-right">
                  <a href={`/admin/pages/${page.id}/edit`} className="text-indigo-600 hover:text-indigo-900 flex items-center justify-end">
                    <Edit className="w-4 h-4 mr-1" /> Edit
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PageList;
