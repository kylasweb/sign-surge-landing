
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import PageEditor from '@/components/admin/PageEditor';

const AdminDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      navigate('/admin');
    }
  }, [navigate]);

  return (
    <AdminLayout>
      <PageEditor />
    </AdminLayout>
  );
};

export default AdminDashboard;
