import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Card, Badge } from '@/components/ui';
import { useReportStore, useProjectStore } from '@/store';
import { formatDateTime, formatDuration } from '@/utils/date';
import { TestStatus, BrowserType, LogLevel } from '@/types/common.types';

const ReportDetailView: React.FC = () => {
  const { reportId } = useParams<{ reportId: string }>();
  const navigate = useNavigate();
  const { reports, selectedReport, selectReport, fetchReports } = useReportStore();
  const { projects, fetchProjects } = useProjectStore();

  useEffect(() => {
    fetchReports();
    fetchProjects();
    
    if (reportId) {
      selectReport(reportId);
    }
  }, [reportId, selectReport, fetchReports, fetchProjects]);

  if (!selectedReport) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Loading report details...</p>
      </div>
    );
  }

  // Find test case for this report
  const getTestCase = () => {
    for (const project of projects) {
      for (const suite of project.testSuites) {
        const testCase = suite.testCases.find(tc => tc.id === selectedReport.testCaseId);
        if (testCase) {
          return {
            testCase,
            project,
            testSuite: suite
          };
        }
      }
    }
    return null;
  };

  const testCaseInfo = getTestCase();

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

  const getLogLevelBadgeVariant = (level: LogLevel) => {
    switch (level) {
      case LogLevel.INFO:
        return 'default';
      case LogLevel.WARNING:
        return 'warning';
      case LogLevel.ERROR:
        return 'danger';
      case LogLevel.DEBUG:
        return 'secondary';
      default:
        return 'default';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => navigate('/reports')}
              className="text-blue-600 hover:text-blue-800"
            >
              Reports
            </button>
            <span className="text-gray-400">/</span>
            <h1 className="text-2xl font-bold text-gray-900">
              Test Report {selectedReport.id}
            </h1>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant={getStatusBadgeVariant(selectedReport.status)}>
              {selectedReport.status}
            </Badge>
            <span className="text-gray-600">
              {formatDateTime(selectedReport.startTime)}
            </span>
            <span className="text-gray-600">
              Duration: {formatDuration(selectedReport.duration)}
            </span>
          </div>
        </div>
        {testCaseInfo && (
          <Button 
            variant="outline"
            onClick={() => navigate(`/projects/${testCaseInfo.project.id}/test-cases/${testCaseInfo.testCase.id}`)}
          >
            View Test Case
          </Button>
        )}
      </div>

      {testCaseInfo && (
        <Card>
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-2">Test Information</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Test Case</p>
                <p className="font-medium">{testCaseInfo.testCase.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Project</p>
                <p className="font-medium">{testCaseInfo.project.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Test Suite</p>
                <p className="font-medium">{testCaseInfo.testSuite.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Browser</p>
                <p className="font-medium">{selectedReport.browser}</p>
              </div>
            </div>
          </div>
        </Card>
      )}

      {selectedReport.errors && selectedReport.errors.length > 0 && (
        <Card>
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-2 text-red-600">Errors</h2>
            
            <div className="space-y-2">
              {selectedReport.errors.map((error, index) => (
                <div 
                  key={index} 
                  className="p-3 bg-red-50 border border-red-100 rounded text-red-700"
                >
                  {error}
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      <Card>
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-4">Screenshots</h2>
          
          {selectedReport.screenshots.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedReport.screenshots.map((screenshot) => (
                <div key={screenshot.id} className="border border-gray-200 rounded-md overflow-hidden">
                  <div className="p-2 bg-gray-50 border-b border-gray-200">
                    <p className="text-sm font-medium">
                      {formatDateTime(screenshot.timestamp)}
                    </p>
                  </div>
                  <div className="p-4">
                    <div className="aspect-video bg-gray-100 flex items-center justify-center">
                      <p className="text-gray-500">
                        [Screenshot: {screenshot.imageUrl}]
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No screenshots available</p>
          )}
        </div>
      </Card>

      <Card>
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-4">Logs</h2>
          
          {selectedReport.logs.length > 0 ? (
            <div className="space-y-2">
              {selectedReport.logs.map((log) => (
                <div 
                  key={log.id} 
                  className="p-3 border border-gray-200 rounded-md flex items-start gap-3"
                >
                  <Badge variant={getLogLevelBadgeVariant(log.level)}>
                    {log.level}
                  </Badge>
                  <div className="flex-grow">
                    <p className="text-gray-900">{log.message}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDateTime(log.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No logs available</p>
          )}
        </div>
      </Card>
    </div>
  );
};

export default ReportDetailView;
