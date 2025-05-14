import React from 'react';
import { Project } from '@/types/common.types';
import { Card, Badge, Button } from '@/components/ui';
import { formatDate } from '@/utils/date';

interface ProjectCardProps {
  project: Project;
  onClick?: (project: Project) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick }) => {
  const totalTestCases = project.testSuites.reduce(
    (acc, suite) => acc + suite.testCases.length,
    0
  );

  return (
    <Card className="h-full flex flex-col">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
        <Badge variant="secondary">
          {project.testSuites.length} Suites
        </Badge>
      </div>
      
      <p className="text-sm text-gray-600 mb-4 flex-grow">{project.description}</p>
      
      <div className="flex flex-col space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Test Suites:</span>
          <span className="font-medium">{project.testSuites.length}</span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Test Cases:</span>
          <span className="font-medium">{totalTestCases}</span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Last Updated:</span>
          <span className="font-medium">{formatDate(project.updatedAt)}</span>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-100">
        <Button 
          variant="primary" 
          className="w-full"
          onClick={() => onClick?.(project)}
        >
          View Project
        </Button>
      </div>
    </Card>
  );
};

export default ProjectCard;
