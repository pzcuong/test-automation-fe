import React from 'react';
import MainLayout from '@/layouts/MainLayout/MainLayout';
import ReportDetailView from '@/views/ReportDetailView/ReportDetailView';

const ReportDetailPage: React.FC = () => {
  return (
    <MainLayout>
      <ReportDetailView />
    </MainLayout>
  );
};

export default ReportDetailPage;
