import React from 'react';
import { TestCase, TestCaseType, TestStatus } from '@/types/common.types';
import { Card, Badge, Button } from '@/components/ui';
import { formatDate } from '@/utils/date';

interface TestCaseCardProps {
  testCase: TestCase;
  onClick?: (testCase: TestCase) => void;
}

const TestCaseCard: React.FC<TestCaseCardProps> = ({ testCase, onClick }) => {
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
    <Card className="h-full flex flex-col">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-md font-semibold text-gray-900">{testCase.name}</h3>
        <Badge variant={getStatusBadgeVariant(testCase.status)}>
          {testCase.status}
        </Badge>
      </div>
      
      <div className="mb-3">
        <Badge variant={getTypeBadgeVariant(testCase.type)}>
          {testCase.type}
        </Badge>
      </div>
      
      <p className="text-sm text-gray-600 mb-4 flex-grow">{testCase.description}</p>
      
      <div className="flex flex-col space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Steps:</span>
          <span className="font-medium">{testCase.steps.length}</span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Last Updated:</span>
          <span className="font-medium">{formatDate(testCase.updatedAt)}</span>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-100">
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => onClick?.(testCase)}
        >
          View Details
        </Button>
      </div>
    </Card>
  );
};

export default TestCaseCard;
