import { create } from 'zustand';
import { TestReport } from '@/types/common.types';
import { mockReports } from '@/constants/mockData';

interface ReportState {
  reports: TestReport[];
  selectedReport: TestReport | null;
  
  // Actions
  fetchReports: () => void;
  fetchReportsByTestCase: (testCaseId: string) => void;
  selectReport: (reportId: string) => void;
  clearSelectedReport: () => void;
}

export const useReportStore = create<ReportState>((set, get) => ({
  reports: [],
  selectedReport: null,
  
  fetchReports: () => {
    // In a real app, this would be an API call
    set({ reports: mockReports });
  },
  
  fetchReportsByTestCase: (testCaseId: string) => {
    // In a real app, this would be an API call with filtering
    const filteredReports = mockReports.filter(report => report.testCaseId === testCaseId);
    set({ reports: filteredReports });
  },
  
  selectReport: (reportId: string) => {
    const { reports } = get();
    const report = reports.find(r => r.id === reportId) || null;
    set({ selectedReport: report });
  },
  
  clearSelectedReport: () => {
    set({ selectedReport: null });
  }
}));
