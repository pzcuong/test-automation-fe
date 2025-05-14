import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button } from '@/components/ui';
import ProjectCard from '@/components/ProjectCard/ProjectCard';
import { useProjectStore, useUserStore } from '@/store';
import { TestStatus } from '@/types/common.types';

const DashboardView: React.FC = () => {
  const navigate = useNavigate();
  const { projects, fetchProjects } = useProjectStore();
  const { currentUser, fetchCurrentUser } = useUserStore();

  useEffect(() => {
    fetchProjects();
    fetchCurrentUser();
  }, [fetchProjects, fetchCurrentUser]);

  // Calculate statistics
  const totalProjects = projects.length;
  const totalTestSuites = projects.reduce((acc, project) => acc + project.testSuites.length, 0);
  const totalTestCases = projects.reduce((acc, project) => {
    return acc + project.testSuites.reduce((suiteAcc, suite) => suiteAcc + suite.testCases.length, 0);
  }, 0);
  
  // Get recent projects (last 3)
  const recentProjects = [...projects]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 3);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <Button onClick={() => navigate('/projects/new')}>Create New Project</Button>
      </div>

      {currentUser && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Welcome back, {currentUser.username}!</h2>
          <p className="text-gray-600">
            You have {totalProjects} projects with {totalTestSuites} test suites and {totalTestCases} test cases.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-blue-50 border-blue-100">
          <div className="flex flex-col items-center p-4">
            <span className="text-3xl font-bold text-blue-600">{totalProjects}</span>
            <span className="text-sm text-gray-600">Total Projects</span>
          </div>
        </Card>
        
        <Card className="bg-green-50 border-green-100">
          <div className="flex flex-col items-center p-4">
            <span className="text-3xl font-bold text-green-600">{totalTestSuites}</span>
            <span className="text-sm text-gray-600">Test Suites</span>
          </div>
        </Card>
        
        <Card className="bg-purple-50 border-purple-100">
          <div className="flex flex-col items-center p-4">
            <span className="text-3xl font-bold text-purple-600">{totalTestCases}</span>
            <span className="text-sm text-gray-600">Test Cases</span>
          </div>
        </Card>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Recent Projects</h2>
          <Button variant="link" onClick={() => navigate('/projects')}>
            View All Projects
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recentProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onClick={(project) => navigate(`/projects/${project.id}`)}
            />
          ))}
          
          {recentProjects.length === 0 && (
            <div className="col-span-3 text-center py-12">
              <p className="text-gray-500">No projects found. Create your first project to get started.</p>
              <Button className="mt-4" onClick={() => navigate('/projects/new')}>
                Create New Project
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
