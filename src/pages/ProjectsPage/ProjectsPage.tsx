import React from 'react';
import MainLayout from '@/layouts/MainLayout/MainLayout';
import ProjectsView from '@/views/ProjectsView/ProjectsView';

const ProjectsPage: React.FC = () => {
  return (
    <MainLayout>
      <ProjectsView />
    </MainLayout>
  );
};

export default ProjectsPage;
