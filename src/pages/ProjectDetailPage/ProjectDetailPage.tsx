import React from 'react';
import MainLayout from '@/layouts/MainLayout/MainLayout';
import ProjectDetailView from '@/views/ProjectDetailView/ProjectDetailView';

const ProjectDetailPage: React.FC = () => {
  return (
    <MainLayout>
      <ProjectDetailView />
    </MainLayout>
  );
};

export default ProjectDetailPage;
