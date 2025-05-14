import React from 'react';
import MainLayout from '@/layouts/MainLayout/MainLayout';
import TestCaseDetailView from '@/views/TestCaseDetailView/TestCaseDetailView';

const TestCaseDetailPage: React.FC = () => {
  return (
    <MainLayout>
      <TestCaseDetailView />
    </MainLayout>
  );
};

export default TestCaseDetailPage;
