import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Card, Badge } from '@/components/ui';
import CollapsibleTestCase from '@/components/CollapsibleTestCase/CollapsibleTestCase';
import { useProjectStore, useReportStore } from '@/store';
import { formatDate, formatDateTime, formatDuration } from '@/utils/date';
import { TestCaseType, TestStatus, BrowserType, TestStep, TestCase } from '@/types/common.types';

const TestCaseDetailView: React.FC = () => {
  const { projectId, testCaseId } = useParams<{ projectId: string; testCaseId: string }>();
  const navigate = useNavigate();
  const { 
    projects, 
    selectedProject, 
    selectProject, 
    selectedTestCase,
    selectTestCase,
    updateTestCase,
    addTestStep,
    updateTestStep,
    deleteTestStep
  } = useProjectStore();
  const { reports, fetchReportsByTestCase } = useReportStore();
  const [activeTab, setActiveTab] = useState<'steps' | 'reports'>('steps');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (projectId) {
      selectProject(projectId);
    }
  }, [projectId, selectProject]);

  useEffect(() => {
    if (testCaseId) {
      fetchReportsByTestCase(testCaseId);
      selectTestCase(testCaseId);
    }
  }, [testCaseId, fetchReportsByTestCase, selectTestCase]);

  // Handler functions
  const handleUpdateTestCase = (updates: Partial<Omit<TestCase, 'id' | 'createdAt' | 'updatedAt' | 'testSuiteId' | 'steps'>>) => {
    if (!testCaseId) return;
    
    setIsSubmitting(true);
    
    try {
      updateTestCase(testCaseId, updates);
    } catch (error) {
      console.error('Failed to update test case:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleSubmitStep = (step: Omit<TestStep, 'id' | 'testCaseId'>) => {
    if (!testCaseId) return;
    
    setIsSubmitting(true);
    
    try {
      addTestStep(testCaseId, step);
    } catch (error) {
      console.error('Failed to add test step:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleUpdateStep = (stepId: string, updates: Partial<Omit<TestStep, 'id' | 'testCaseId'>>) => {
    if (!testCaseId) return;
    
    setIsSubmitting(true);
    
    try {
      updateTestStep(testCaseId, stepId, updates);
    } catch (error) {
      console.error('Failed to update test step:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDeleteStep = (stepId: string) => {
    if (!testCaseId) return;
    
    if (window.confirm('Are you sure you want to delete this step?')) {
      deleteTestStep(testCaseId, stepId);
    }
  };

  if (!selectedProject) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Loading project details...</p>
      </div>
    );
  }

  // Find the test case
  const testSuite = selectedProject.testSuites.find(suite => 
    suite.testCases.some(tc => tc.id === testCaseId)
  );
  
  const testCase = testSuite?.testCases.find(tc => tc.id === testCaseId);

  if (!testCase) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Test case not found</p>
      </div>
    );
  }

  const getStatusBadgeVariant = (status: TestStatus) => {
    switch (status) {
      case TestStatus.PASSED:
        return 'success';
      case TestStatus.FAILED:
        return 'danger';
      case TestStatus.RUNNING:
        return 'warning';
      case TestStatus.BLOCKED:
        return 'danger';
      default:
        return 'secondary';
    }
  };

  const getBrowserIcon = (browser: BrowserType) => {
    switch (browser) {
      case BrowserType.CHROME:
        return '🌐';
      case BrowserType.FIREFOX:
        return '🦊';
      case BrowserType.SAFARI:
        return '🧭';
      case BrowserType.EDGE:
        return '📱';
      default:
        return '🌐';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => navigate('/projects')}
              className="text-blue-600 hover:text-blue-800"
            >
              Projects
            </button>
            <span className="text-gray-400">/</span>
            <button 
              onClick={() => navigate(`/projects/${selectedProject.id}`)}
              className="text-blue-600 hover:text-blue-800"
            >
              {selectedProject.name}
            </button>
            <span className="text-gray-400">/</span>
            <h1 className="text-2xl font-bold text-gray-900">{testCase.name}</h1>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant={getStatusBadgeVariant(testCase.status)}>
              {testCase.status}
            </Badge>
          </div>
        </div>
        <div className="flex gap-2">
          <Button>Run Test</Button>
        </div>
      </div>

      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('steps')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'steps'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Test Steps
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'reports'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Test Reports
          </button>
        </nav>
      </div>

      {activeTab === 'steps' && (
        <Card>
          <div className="p-4">
            <CollapsibleTestCase
              testCase={testCase}
              onUpdateTestCase={handleUpdateTestCase}
              onAddStep={handleSubmitStep}
              onUpdateStep={handleUpdateStep}
              onDeleteStep={handleDeleteStep}
              isSubmitting={isSubmitting}
            />
          </div>
        </Card>
      )}

      {activeTab === 'reports' && (
        <Card>
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-4">Test Reports</h2>
            
            {reports.length > 0 ? (
              <div className="space-y-4">
                {reports.map((report) => (
                  <div 
                    key={report.id} 
                    className="p-4 border border-gray-200 rounded-md hover:bg-gray-50"
                  >
                    <div className="flex justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant={getStatusBadgeVariant(report.status)}>
                          {report.status}
                        </Badge>
                        <span className="text-gray-600">
                          {formatDateTime(report.startTime)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-600">
                          {getBrowserIcon(report.browser)} {report.browser}
                        </span>
                        <span className="text-gray-600">
                          Duration: {formatDuration(report.duration)}
                        </span>
                      </div>
                    </div>
                    
                    {report.errors && report.errors.length > 0 && (
                      <div className="mt-3 p-3 bg-red-50 border border-red-100 rounded text-red-700 text-sm">
                        {report.errors.map((error, index) => (
                          <div key={index}>{error}</div>
                        ))}
                      </div>
                    )}
                    
                    <div className="mt-3 flex justify-end">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate(`/reports/${report.id}`)}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No test reports available for this test case.</p>
                <Button className="mt-4" variant="outline" size="sm">
                  Run Test
                </Button>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};

export default TestCaseDetailView;
