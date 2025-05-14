import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout/MainLayout';
import { Card, Input, Button, ActionButton } from '@/components/ui';
import { useProjectStore } from '@/store';

const NewProjectPage: React.FC = () => {
  const navigate = useNavigate();
  const { createProject } = useProjectStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Project name is required';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const newProjectId = createProject({
        name: formData.name,
        description: formData.description
      });
      
      // Navigate to the new project
      navigate(`/projects/${newProjectId}`);
    } catch (error) {
      console.error('Failed to create project:', error);
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <button
            onClick={() => navigate('/projects')}
            className="text-blue-600 hover:text-blue-800"
          >
            Projects
          </button>
          <span className="text-gray-400">/</span>
          <h1 className="text-2xl font-bold text-gray-900">Create New Project</h1>
        </div>
        
        <Card className="p-6">
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <Input
                id="name"
                name="name"
                label="Project Name"
                placeholder="Enter project name"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
                required
              />
              
              <Input
                id="description"
                name="description"
                label="Description"
                placeholder="Enter project description"
                value={formData.description}
                onChange={handleChange}
                error={errors.description}
              />
              
              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/projects')}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Creating...' : 'Create Project'}
                </Button>
              </div>
            </div>
          </form>
        </Card>
      </div>
    </MainLayout>
  );
};

export default NewProjectPage;
