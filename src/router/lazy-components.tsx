import {lazy} from 'react'

export const HomePageLazy = lazy(() => import('@/pages/HomePage/HomePage'))
export const DashboardPageLazy = lazy(
	() => import('@/pages/DashboardPage/DashboardPage')
)
export const ProjectsPageLazy = lazy(
	() => import('@/pages/ProjectsPage/ProjectsPage')
)
export const NewProjectPageLazy = lazy(
	() => import('@/pages/NewProjectPage/NewProjectPage')
)
export const ProjectDetailPageLazy = lazy(
	() => import('@/pages/ProjectDetailPage/ProjectDetailPage')
)
export const TestCaseDetailPageLazy = lazy(
	() => import('@/pages/TestCaseDetailPage/TestCaseDetailPage')
)
export const ReportsPageLazy = lazy(
	() => import('@/pages/ReportsPage/ReportsPage')
)
export const ReportDetailPageLazy = lazy(
	() => import('@/pages/ReportDetailPage/ReportDetailPage')
)
export const TestsPageLazy = lazy(() => import('@/pages/TestsPage/TestsPage'))
