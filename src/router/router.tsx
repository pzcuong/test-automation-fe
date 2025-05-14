import {createBrowserRouter} from 'react-router-dom'
import {APP_URL} from '@/configs/app-url.config'
import {
	HomePageLazy,
	DashboardPageLazy,
	ProjectsPageLazy,
	NewProjectPageLazy,
	ProjectDetailPageLazy,
	TestCaseDetailPageLazy,
	ReportsPageLazy,
	ReportDetailPageLazy,
	TestsPageLazy,
} from './lazy-components'

const router = createBrowserRouter([
	{
		path: APP_URL.HOME,
		element: <DashboardPageLazy />,
	},
	{
		path: APP_URL.PROJECTS,
		element: <ProjectsPageLazy />,
	},
	{
		path: APP_URL.NEW_PROJECT,
		element: <NewProjectPageLazy />,
	},
	{
		path: APP_URL.PROJECT_DETAIL,
		element: <ProjectDetailPageLazy />,
	},
	{
		path: APP_URL.TEST_CASE_DETAIL,
		element: <TestCaseDetailPageLazy />,
	},
	{
		path: APP_URL.REPORTS,
		element: <ReportsPageLazy />,
	},
	{
		path: APP_URL.REPORT_DETAIL,
		element: <ReportDetailPageLazy />,
	},
	{
		path: APP_URL.TESTS,
		element: <TestsPageLazy />,
	},
])

export default router
