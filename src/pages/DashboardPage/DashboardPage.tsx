import React from 'react';
import MainLayout from '@/layouts/MainLayout/MainLayout';
import DashboardView from '@/views/DashboardView/DashboardView';

const DashboardPage: React.FC = () => {
  return (
    <MainLayout>
      <DashboardView />
    </MainLayout>
  );
};

export default DashboardPage;
