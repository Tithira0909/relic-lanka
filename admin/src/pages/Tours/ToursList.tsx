import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { Plus, Edit, Trash } from 'lucide-react';

interface Tour {
  id: string;
  name: string;
  slug: string;
  isPublished: boolean;
  days: number;
  nights: number;
}

const ToursList: React.FC = () => {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTours = async () => {
    try {
      const res = await api.get('/admin/tours');
      setTours(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTours();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this tour?')) {
      try {
        await api.delete(`/admin/tours/${id}`);
        fetchTours();
      } catch (error) {
        alert('Failed to delete tour');
      }
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Tours</h1>
        <Link to="/admin/tours/new" className="bg-ocean text-white px-4 py-2 rounded-md flex items-center hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Tour
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tours.map((tour) => (
              <tr key={tour.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{tour.name}</div>
                  <div className="text-sm text-gray-500">/{tour.slug}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {tour.days} Days / {tour.nights} Nights
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${tour.isPublished ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {tour.isPublished ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link to={`/admin/tours/${tour.id}/edit`} className="text-indigo-600 hover:text-indigo-900 mr-4 inline-flex items-center">
                    <Edit className="w-4 h-4 mr-1" /> Edit
                  </Link>
                  <button onClick={() => handleDelete(tour.id)} className="text-red-600 hover:text-red-900 inline-flex items-center">
                    <Trash className="w-4 h-4 mr-1" /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ToursList;
