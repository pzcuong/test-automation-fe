import React from 'react';
import TestsView from '@/views/TestsView/TestsView';
import MainLayout from '@/layouts/MainLayout/MainLayout';

const TestsPage: React.FC = () => {
  return (
    <MainLayout>
      <TestsView />
    </MainLayout>
  );
};

export default TestsPage;
