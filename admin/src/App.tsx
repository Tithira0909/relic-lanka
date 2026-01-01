import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import DashboardLayout from './layouts/DashboardLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ToursList from './pages/Tours/ToursList';
import TourEditor from './pages/Tours/TourEditor';
import GalleryList from './pages/Gallery/GalleryList';
import PageList from './pages/Pages/PageList';
import PageEditor from './pages/Pages/PageEditor';
import InquiryList from './pages/Inquiries/InquiryList';
import Settings from './pages/Settings/Settings';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();
  if (isLoading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/admin/login" />;
  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/admin/login" element={<Login />} />

          <Route path="/admin" element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />

            <Route path="tours" element={<ToursList />} />
            <Route path="tours/new" element={<TourEditor />} />
            <Route path="tours/:id/edit" element={<TourEditor />} />

            <Route path="gallery" element={<GalleryList />} />

            <Route path="pages" element={<PageList />} />
            <Route path="pages/:id/edit" element={<PageEditor />} />

            <Route path="inquiries" element={<InquiryList />} />

            <Route path="settings" element={<Settings />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/admin/login" />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
