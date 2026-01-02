import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import clsx from 'clsx';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface Inquiry {
  id: string;
  type: 'TOUR' | 'GENERAL';
  fullName: string;
  email: string;
  phone?: string;
  country?: string;
  travelDates?: string;
  travelersCount?: number;
  message: string;
  status: 'NEW' | 'CONTACTED' | 'CLOSED';
  adminNotes?: string;
  createdAt: string;
  tour?: { name: string };
}

const InquiryList: React.FC = () => {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchInquiries = async () => {
    try {
      const res = await api.get('/admin/inquiries');
      setInquiries(res.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await api.patch(`/admin/inquiries/${id}`, { status });
      setInquiries(inquiries.map(i => i.id === id ? { ...i, status: status as any } : i));
    } catch (error) {
      alert('Failed to update status');
    }
  };

  const handleNotesChange = async (id: string, notes: string) => {
     try {
      await api.patch(`/admin/inquiries/${id}`, { adminNotes: notes });
    } catch (error) {
       console.error('Failed to save notes');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Inquiries</h1>
      <div className="space-y-4">
        {inquiries.map((inquiry) => (
          <div key={inquiry.id} className="bg-white rounded-lg shadow overflow-hidden border">
            <div
              className="p-4 flex items-center justify-between cursor-pointer bg-gray-50 hover:bg-gray-100"
              onClick={() => setExpandedId(expandedId === inquiry.id ? null : inquiry.id)}
            >
               <div className="flex items-center space-x-4">
                 <span className={clsx(
                   'px-2 py-1 text-xs font-bold rounded',
                   inquiry.status === 'NEW' ? 'bg-blue-100 text-blue-800' :
                   inquiry.status === 'CONTACTED' ? 'bg-yellow-100 text-yellow-800' :
                   'bg-gray-200 text-gray-800'
                 )}>
                   {inquiry.status}
                 </span>
                 <div>
                   <div className="font-bold">{inquiry.fullName}</div>
                   <div className="text-sm text-gray-500">{inquiry.email} • {new Date(inquiry.createdAt).toLocaleDateString()}</div>
                 </div>
               </div>
               <div className="flex items-center space-x-4">
                  <div className="text-sm text-gray-500 text-right">
                    {inquiry.type === 'TOUR' ? `Tour: ${inquiry.tour?.name}` : 'General Inquiry'}
                  </div>
                  {expandedId === inquiry.id ? <ChevronUp className="w-5 h-5"/> : <ChevronDown className="w-5 h-5"/>}
               </div>
            </div>

            {expandedId === inquiry.id && (
              <div className="p-4 border-t bg-white">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-bold mb-2">Details</h4>
                    <p className="text-sm mb-1"><strong>Phone:</strong> {inquiry.phone || 'N/A'}</p>
                    <p className="text-sm mb-1"><strong>Country:</strong> {inquiry.country || 'N/A'}</p>
                    <p className="text-sm mb-1"><strong>Travel Dates:</strong> {inquiry.travelDates || 'N/A'}</p>
                    <p className="text-sm mb-1"><strong>Travelers:</strong> {inquiry.travelersCount || 'N/A'}</p>
                    <div className="mt-4">
                      <h5 className="font-bold text-sm mb-1">Message:</h5>
                      <p className="text-gray-700 whitespace-pre-wrap bg-gray-50 p-2 rounded">{inquiry.message}</p>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded">
                    <h4 className="font-bold mb-2">Admin Actions</h4>
                    <div className="mb-4">
                      <label className="block text-xs font-bold text-gray-500 mb-1">Status</label>
                      <select
                        value={inquiry.status}
                        onChange={(e) => handleStatusChange(inquiry.id, e.target.value)}
                        className="block w-full border p-2 rounded"
                      >
                        <option value="NEW">New</option>
                        <option value="CONTACTED">Contacted</option>
                        <option value="CLOSED">Closed</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1">Internal Notes</label>
                      <textarea
                        defaultValue={inquiry.adminNotes || ''}
                        onBlur={(e) => handleNotesChange(inquiry.id, e.target.value)}
                        className="block w-full border p-2 rounded"
                        rows={4}
                        placeholder="Add internal notes here..."
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default InquiryList;
