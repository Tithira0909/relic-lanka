import React, { useEffect, useState } from 'react';
import api from '../api/axios';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    tours: 0,
    inquiries: 0,
    gallery: 0
  });

  useEffect(() => {
    // In a real app, I'd have a specific /stats endpoint
    // For now, let's just make parallel calls to lists to count
    const fetchStats = async () => {
      try {
        const [tours, inquiries, gallery] = await Promise.all([
            api.get('/admin/tours'),
            api.get('/admin/inquiries?limit=1'), // just get meta
            api.get('/admin/gallery')
        ]);
        setStats({
          tours: tours.data.length,
          inquiries: inquiries.data.meta.total,
          gallery: gallery.data.length
        });
      } catch (error) {
        console.error('Failed to fetch stats');
      }
    };
    fetchStats();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-gray-500 text-sm font-medium">Total Tours</h3>
          <p className="text-3xl font-bold mt-2">{stats.tours}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-gray-500 text-sm font-medium">Total Inquiries</h3>
          <p className="text-3xl font-bold mt-2">{stats.inquiries}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-gray-500 text-sm font-medium">Gallery Images</h3>
          <p className="text-3xl font-bold mt-2">{stats.gallery}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
