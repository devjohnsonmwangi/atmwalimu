import React from 'react';
import CategoryManager from '../../../../components/admin/CategoryManager';

const AdminDashboardPage: React.FC = () => {
  return (
    <div className="bg-gray-100 min-h-screen py-12">
      <div className="w-full mx-auto px-0 sm:px-6 lg:px-8">
        <header className="mb-10 px-4 sm:px-0">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900">
            Admin Dashboard
          </h1>
        </header>

        <div className="w-full mx-auto px-4 sm:px-0">
          <CategoryManager />
          {/* You can add other admin components here in the future */}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;