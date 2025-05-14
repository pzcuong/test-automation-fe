import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Badge, ActionButton, PlusIcon, AIIcon, RunIcon, SlidePanel } from '@/components/ui';
import { useProjectStore } from '@/store';
import { formatDate } from '@/utils/date';
import { TestStatus, TestCaseType } from '@/types/common.types';
import TestCaseForm from '@/components/TestCaseForm/TestCaseForm';
import AITestGeneratorForm from '@/components/AITestGeneratorForm/AITestGeneratorForm';

const TestsView: React.FC = () => {
  const navigate = useNavigate();
  const { projects, fetchProjects, createTestCase, generateTestCaseWithAI } = useProjectStore();
  
  // State for slide panels
  const [isCreatePanelOpen, setIsCreatePanelOpen] = useState(false);
  const [isAIPanelOpen, setIsAIPanelOpen] = useState(false);
  const [selectedSuiteId, setSelectedSuiteId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Filter state
  const [statusFilter, setStatusFilter] = useState<TestStatus | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<TestCaseType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Get all test cases from all projects
  const allTestCases = projects.flatMap(project => 
    project.testSuites.flatMap(suite => 
      suite.testCases.map(testCase => ({
        ...testCase,
        projectId: project.id,
        projectName: project.name,
        suiteName: suite.name
      }))
    )
  );
  
  // Apply filters
  const filteredTestCases = allTestCases.filter(testCase => {
    const matchesStatus = statusFilter === 'all' || testCase.status === statusFilter;
    const matchesType = typeFilter === 'all' || testCase.type === typeFilter;
    const matchesSearch = searchQuery === '' || 
      testCase.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      testCase.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesStatus && matchesType && matchesSearch;
  });

  const handleCreateTestCase = (testCase: any) => {
    if (!selectedSuiteId) return;
    
    setIsSubmitting(true);
    
    try {
      createTestCase(selectedSuiteId, testCase);
      setIsCreatePanelOpen(false);
    } catch (error) {
      console.error('Failed to create test case:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGenerateWithAI = async (prompt: string) => {
    if (!selectedSuiteId) return;
    
    setIsSubmitting(true);
    
    try {
      await generateTestCaseWithAI(selectedSuiteId, prompt);
      setIsAIPanelOpen(false);
    } catch (error) {
      console.error('Failed to generate test case with AI:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

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

  const getTypeBadgeVariant = (type: TestCaseType) => {
    switch (type) {
      case TestCaseType.POSITIVE:
        return 'success';
      case TestCaseType.NEGATIVE:
        return 'warning';
      case TestCaseType.EDGE_CASE:
        return 'secondary';
      default:
        return 'default';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Test Cases</h1>
        <div className="flex gap-2">
          <ActionButton 
            icon={<AIIcon />}
            variant="outline"
            onClick={() => {
              // Find the first test suite to use as default
              if (projects.length > 0 && projects[0].testSuites.length > 0) {
                setSelectedSuiteId(projects[0].testSuites[0].id);
                setIsAIPanelOpen(true);
              }
            }}
          >
            Generate with AI
          </ActionButton>
          <ActionButton 
            icon={<PlusIcon />}
            onClick={() => {
              // Find the first test suite to use as default
              if (projects.length > 0 && projects[0].testSuites.length > 0) {
                setSelectedSuiteId(projects[0].testSuites[0].id);
                setIsCreatePanelOpen(true);
              }
            }}
          >
            Create Test Case
          </ActionButton>
        </div>
      </div>

      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-grow">
            <input
              type="text"
              placeholder="Search test cases..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <select
              className="px-3 py-2 border border-gray-300 rounded-md"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as TestStatus | 'all')}
            >
              <option value="all">All Statuses</option>
              <option value={TestStatus.PASSED}>Passed</option>
              <option value={TestStatus.FAILED}>Failed</option>
              <option value={TestStatus.RUNNING}>Running</option>
              <option value={TestStatus.BLOCKED}>Blocked</option>
              <option value={TestStatus.DRAFT}>Draft</option>
              <option value={TestStatus.READY}>Ready</option>
            </select>
            <select
              className="px-3 py-2 border border-gray-300 rounded-md"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as TestCaseType | 'all')}
            >
              <option value="all">All Types</option>
              <option value={TestCaseType.POSITIVE}>Positive</option>
              <option value={TestCaseType.NEGATIVE}>Negative</option>
              <option value={TestCaseType.EDGE_CASE}>Edge Case</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Project / Suite
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Updated
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTestCases.map((testCase) => (
                <tr key={testCase.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {testCase.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {testCase.description.substring(0, 60)}
                      {testCase.description.length > 60 ? '...' : ''}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {testCase.projectName}
                    </div>
                    <div className="text-sm text-gray-500">
                      {testCase.suiteName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant={getStatusBadgeVariant(testCase.status)}>
                      {testCase.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant={getTypeBadgeVariant(testCase.type)}>
                      {testCase.type}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(testCase.updatedAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <ActionButton
                        icon={<RunIcon />}
                        variant="outline"
                        size="sm"
                        onClick={() => {}}
                      >
                        Run
                      </ActionButton>
                      <ActionButton
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/projects/${testCase.projectId}/test-cases/${testCase.id}`)}
                      >
                        View
                      </ActionButton>
                    </div>
                  </td>
                </tr>
              ))}
              
              {filteredTestCases.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                    No test cases found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Create Test Case Panel */}
      <SlidePanel
        isOpen={isCreatePanelOpen}
        onClose={() => setIsCreatePanelOpen(false)}
        title="Create New Test Case"
        size="md"
      >
        <TestCaseForm
          onSubmit={handleCreateTestCase}
          onCancel={() => setIsCreatePanelOpen(false)}
          isSubmitting={isSubmitting}
        />
      </SlidePanel>
      
      {/* AI Test Generator Panel */}
      <SlidePanel
        isOpen={isAIPanelOpen}
        onClose={() => setIsAIPanelOpen(false)}
        title="Generate Test Case with AI"
        size="md"
      >
        <AITestGeneratorForm
          onSubmit={handleGenerateWithAI}
          onCancel={() => setIsAIPanelOpen(false)}
          isSubmitting={isSubmitting}
        />
      </SlidePanel>
    </div>
  );
};

export default TestsView;
