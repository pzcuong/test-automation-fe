import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Badge, Select, Input } from '@/components/ui';
import { useReportStore, useProjectStore } from '@/store';
import { formatDateTime, formatDuration } from '@/utils/date';
import { TestStatus, BrowserType } from '@/types/common.types';

const ReportsView: React.FC = () => {
  const navigate = useNavigate();
  const { reports, fetchReports } = useReportStore();
  const { projects, fetchProjects } = useProjectStore();

  useEffect(() => {
    fetchReports();
    fetchProjects();
  }, [fetchReports, fetchProjects]);

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

  // Find test case names for each report
  const getTestCaseName = (testCaseId: string) => {
    for (const project of projects) {
      for (const suite of project.testSuites) {
        const testCase = suite.testCases.find(tc => tc.id === testCaseId);
        if (testCase) {
          return testCase.name;
        }
      }
    }
    return 'Unknown Test Case';
  };

  // Find project name for each test case
  const getProjectName = (testCaseId: string) => {
    for (const project of projects) {
      for (const suite of project.testSuites) {
        const testCase = suite.testCases.find(tc => tc.id === testCaseId);
        if (testCase) {
          return project.name;
        }
      }
    }
    return 'Unknown Project';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Test Reports</h1>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow">
            <Input
              id="search"
              placeholder="Search reports..."
              type="search"
            />
          </div>
          <div className="flex gap-2">
            <Select
              id="status-filter"
              placeholder="Filter by status"
              options={[
                { label: 'All Statuses', value: 'all' },
                { label: 'Passed', value: TestStatus.PASSED },
                { label: 'Failed', value: TestStatus.FAILED },
                { label: 'Running', value: TestStatus.RUNNING },
              ]}
            />
            <Select
              id="browser-filter"
              placeholder="Filter by browser"
              options={[
                { label: 'All Browsers', value: 'all' },
                { label: 'Chrome', value: BrowserType.CHROME },
                { label: 'Firefox', value: BrowserType.FIREFOX },
                { label: 'Safari', value: BrowserType.SAFARI },
                { label: 'Edge', value: BrowserType.EDGE },
              ]}
            />
          </div>
        </div>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Test Case
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Project
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Browser
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duration
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reports.map((report) => (
                <tr key={report.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant={getStatusBadgeVariant(report.status)}>
                      {report.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {getTestCaseName(report.testCaseId)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {getProjectName(report.testCaseId)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {getBrowserIcon(report.browser)} {report.browser}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {formatDateTime(report.startTime)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {formatDuration(report.duration)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Button 
                      variant="link" 
                      size="sm"
                      onClick={() => navigate(`/reports/${report.id}`)}
                    >
                      View
                    </Button>
                  </td>
                </tr>
              ))}
              
              {reports.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-gray-500">
                    No reports found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default ReportsView;
