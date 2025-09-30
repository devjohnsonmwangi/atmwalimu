import React from 'react';
import CategoryManager from '../../../../components/admin/CategoryManager';

const AdminDashboardPage: React.FC = () => {
  return (
    <div className="bg-gray-100 min-h-screen py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900">
            Admin Dashboard
          </h1>
        </header>

        <div className="max-w-2xl mx-auto">
          <CategoryManager />
          {/* You can add other admin components here in the future */}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;