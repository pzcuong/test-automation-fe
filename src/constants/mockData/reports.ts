import { BrowserType, LogLevel, TestReport, TestStatus } from '@/types/common.types';

export const mockReports: TestReport[] = [
  {
    id: '1',
    testCaseId: '1001',
    status: TestStatus.PASSED,
    startTime: '2023-05-10T10:00:00Z',
    endTime: '2023-05-10T10:01:30Z',
    duration: 90, // seconds
    browser: BrowserType.CHROME,
    screenshots: [
      {
        id: '1001',
        testReportId: '1',
        stepId: '10001',
        timestamp: '2023-05-10T10:00:05Z',
        imageUrl: '/screenshots/login-page.png'
      },
      {
        id: '1002',
        testReportId: '1',
        stepId: '10005',
        timestamp: '2023-05-10T10:01:25Z',
        imageUrl: '/screenshots/dashboard-welcome.png'
      }
    ],
    logs: [
      {
        id: '10001',
        testReportId: '1',
        timestamp: '2023-05-10T10:00:00Z',
        level: LogLevel.INFO,
        message: 'Starting test: Valid User Login'
      },
      {
        id: '10002',
        testReportId: '1',
        timestamp: '2023-05-10T10:00:05Z',
        level: LogLevel.INFO,
        message: 'Navigating to https://example.com/login'
      },
      {
        id: '10003',
        testReportId: '1',
        timestamp: '2023-05-10T10:00:10Z',
        level: LogLevel.INFO,
        message: 'Filling email field with test@example.com'
      },
      {
        id: '10004',
        testReportId: '1',
        timestamp: '2023-05-10T10:00:15Z',
        level: LogLevel.INFO,
        message: 'Filling password field with ********'
      },
      {
        id: '10005',
        testReportId: '1',
        timestamp: '2023-05-10T10:00:20Z',
        level: LogLevel.INFO,
        message: 'Clicking submit button'
      },
      {
        id: '10006',
        testReportId: '1',
        timestamp: '2023-05-10T10:01:25Z',
        level: LogLevel.INFO,
        message: 'Assertion passed: Welcome message found'
      },
      {
        id: '10007',
        testReportId: '1',
        timestamp: '2023-05-10T10:01:30Z',
        level: LogLevel.INFO,
        message: 'Test completed successfully'
      }
    ]
  },
  {
    id: '2',
    testCaseId: '1002',
    status: TestStatus.PASSED,
    startTime: '2023-05-10T11:00:00Z',
    endTime: '2023-05-10T11:01:15Z',
    duration: 75, // seconds
    browser: BrowserType.FIREFOX,
    screenshots: [
      {
        id: '2001',
        testReportId: '2',
        stepId: '10006',
        timestamp: '2023-05-10T11:00:05Z',
        imageUrl: '/screenshots/login-page-firefox.png'
      },
      {
        id: '2002',
        testReportId: '2',
        stepId: '10010',
        timestamp: '2023-05-10T11:01:10Z',
        imageUrl: '/screenshots/login-error.png'
      }
    ],
    logs: [
      {
        id: '20001',
        testReportId: '2',
        timestamp: '2023-05-10T11:00:00Z',
        level: LogLevel.INFO,
        message: 'Starting test: Invalid User Login'
      },
      {
        id: '20002',
        testReportId: '2',
        timestamp: '2023-05-10T11:00:05Z',
        level: LogLevel.INFO,
        message: 'Navigating to https://example.com/login'
      },
      {
        id: '20003',
        testReportId: '2',
        timestamp: '2023-05-10T11:00:10Z',
        level: LogLevel.INFO,
        message: 'Filling email field with wrong@example.com'
      },
      {
        id: '20004',
        testReportId: '2',
        timestamp: '2023-05-10T11:00:15Z',
        level: LogLevel.INFO,
        message: 'Filling password field with ********'
      },
      {
        id: '20005',
        testReportId: '2',
        timestamp: '2023-05-10T11:00:20Z',
        level: LogLevel.INFO,
        message: 'Clicking submit button'
      },
      {
        id: '20006',
        testReportId: '2',
        timestamp: '2023-05-10T11:01:10Z',
        level: LogLevel.INFO,
        message: 'Assertion passed: Error message found'
      },
      {
        id: '20007',
        testReportId: '2',
        timestamp: '2023-05-10T11:01:15Z',
        level: LogLevel.INFO,
        message: 'Test completed successfully'
      }
    ]
  },
  {
    id: '3',
    testCaseId: '1003',
    status: TestStatus.FAILED,
    startTime: '2023-05-11T09:00:00Z',
    endTime: '2023-05-11T09:01:45Z',
    duration: 105, // seconds
    browser: BrowserType.CHROME,
    screenshots: [
      {
        id: '3001',
        testReportId: '3',
        stepId: '10011',
        timestamp: '2023-05-11T09:00:05Z',
        imageUrl: '/screenshots/products-page.png'
      },
      {
        id: '3002',
        testReportId: '3',
        stepId: '10013',
        timestamp: '2023-05-11T09:01:40Z',
        imageUrl: '/screenshots/cart-error.png'
      }
    ],
    logs: [
      {
        id: '30001',
        testReportId: '3',
        timestamp: '2023-05-11T09:00:00Z',
        level: LogLevel.INFO,
        message: 'Starting test: Add Product to Cart'
      },
      {
        id: '30002',
        testReportId: '3',
        timestamp: '2023-05-11T09:00:05Z',
        level: LogLevel.INFO,
        message: 'Navigating to https://example.com/products'
      },
      {
        id: '30003',
        testReportId: '3',
        timestamp: '2023-05-11T09:00:20Z',
        level: LogLevel.INFO,
        message: 'Clicking add to cart button'
      },
      {
        id: '30004',
        testReportId: '3',
        timestamp: '2023-05-11T09:01:40Z',
        level: LogLevel.ERROR,
        message: 'Assertion failed: Expected cart count to be "1" but found "0"'
      },
      {
        id: '30005',
        testReportId: '3',
        timestamp: '2023-05-11T09:01:45Z',
        level: LogLevel.INFO,
        message: 'Test failed'
      }
    ],
    errors: [
      'Assertion failed: Expected cart count to be "1" but found "0"'
    ]
  }
];
