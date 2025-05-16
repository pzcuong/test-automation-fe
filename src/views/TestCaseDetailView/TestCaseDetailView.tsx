import React, {useEffect, useState} from 'react'
import {useParams, useNavigate} from 'react-router-dom'
import {Button, Card, Badge} from '@/components/ui'
import CollapsibleTestCase from '@/components/CollapsibleTestCase/CollapsibleTestCase'
import TestDependencyGraph from '@/components/TestDependencyGraph/TestDependencyGraph'
import TestStepsList from '@/components/TestStepsList/TestStepsList'
import {useProjectStore, useReportStore} from '@/store'
import {formatDate, formatDateTime, formatDuration} from '@/utils/date'
import {
	TestCaseType,
	TestStatus,
	BrowserType,
	TestStep,
	TestCase,
} from '@/types/common.types'

const TestCaseDetailView: React.FC = () => {
	const {projectId, testCaseId} = useParams<{
		projectId: string
		testCaseId: string
	}>()
	const navigate = useNavigate()
	const {
		projects,
		fetchProjects,
		selectedProject,
		selectProject,
		selectedTestCase,
		selectTestCase,
		updateTestCase,
		addTestStep,
		updateTestStep,
		deleteTestStep,
		reorderTestSteps,
	} = useProjectStore()
	const {reports, fetchReportsByTestCase} = useReportStore()
	const [activeTab, setActiveTab] = useState<
		'steps' | 'reports' | 'dependencies'
	>('steps')
	const [isSubmitting, setIsSubmitting] = useState(false)

	// Fetch projects on component mount
	useEffect(() => {
		// Fetch projects data
		fetchProjects()
	}, [fetchProjects])

	// Select the project once projects are loaded
	useEffect(() => {
		if (projectId && projects.length > 0) {
			selectProject(projectId)
		}
	}, [projectId, selectProject, projects])

	// Select the test case once the project is selected
	useEffect(() => {
		if (testCaseId) {
			fetchReportsByTestCase(testCaseId)
			selectTestCase(testCaseId)
		}
	}, [testCaseId, fetchReportsByTestCase, selectTestCase])

	// Handler functions
	const handleUpdateTestCase = (
		updates: Partial<
			Omit<TestCase, 'id' | 'createdAt' | 'updatedAt' | 'testSuiteId' | 'steps'>
		>
	) => {
		if (!testCaseId) return

		setIsSubmitting(true)

		try {
			updateTestCase(testCaseId, updates)
		} catch (error) {
			console.error('Failed to update test case:', error)
		} finally {
			setIsSubmitting(false)
		}
	}

	const handleSubmitStep = (step: Omit<TestStep, 'id' | 'testCaseId'>) => {
		if (!testCaseId) return

		setIsSubmitting(true)

		try {
			addTestStep(testCaseId, step)
		} catch (error) {
			console.error('Failed to add test step:', error)
		} finally {
			setIsSubmitting(false)
		}
	}

	const handleUpdateStep = (
		stepId: string,
		updates: Partial<Omit<TestStep, 'id' | 'testCaseId'>>
	) => {
		if (!testCaseId) return

		setIsSubmitting(true)

		try {
			updateTestStep(testCaseId, stepId, updates)
		} catch (error) {
			console.error('Failed to update test step:', error)
		} finally {
			setIsSubmitting(false)
		}
	}

	const handleDeleteStep = (stepId: string) => {
		if (!testCaseId) return

		if (window.confirm('Are you sure you want to delete this step?')) {
			deleteTestStep(testCaseId, stepId)
		}
	}

	const handleReorderSteps = (reorderedSteps: TestStep[]) => {
		if (!testCaseId) return
		reorderTestSteps(testCaseId, reorderedSteps)
	}

	if (!selectedProject) {
		return (
			<div className='flex justify-center items-center h-64'>
				<p className='text-gray-500'>Loading project details...</p>
			</div>
		)
	}

	// Find the test case
	const testSuite = selectedProject.testSuites.find((suite) =>
		suite.testCases.some((tc) => tc.id === testCaseId)
	)

	const testCase = testSuite?.testCases.find((tc) => tc.id === testCaseId)

	if (!testCase) {
		return (
			<div className='flex justify-center items-center h-64'>
				<p className='text-gray-500'>Test case not found</p>
			</div>
		)
	}

	const getStatusBadgeVariant = (status: TestStatus) => {
		switch (status) {
			case TestStatus.PASSED:
				return 'success'
			case TestStatus.FAILED:
				return 'danger'
			case TestStatus.RUNNING:
				return 'warning'
			case TestStatus.BLOCKED:
				return 'danger'
			default:
				return 'secondary'
		}
	}

	const getBrowserIcon = (browser: BrowserType) => {
		switch (browser) {
			case BrowserType.CHROME:
				return '🌐'
			case BrowserType.FIREFOX:
				return '🦊'
			case BrowserType.SAFARI:
				return '🧭'
			case BrowserType.EDGE:
				return '📱'
			default:
				return '🌐'
		}
	}

	return (
		<div className='space-y-6'>
			<div className='flex justify-between items-center'>
				<div>
					<div className='flex items-center gap-2'>
						<button
							onClick={() => navigate('/projects')}
							className='text-blue-600 hover:text-blue-800'
						>
							Projects
						</button>
						<span className='text-gray-400'>/</span>
						<button
							onClick={() => navigate(`/projects/${selectedProject.id}`)}
							className='text-blue-600 hover:text-blue-800'
						>
							{selectedProject.name}
						</button>
						<span className='text-gray-400'>/</span>
						<h1 className='text-2xl font-bold text-gray-900'>
							{testCase.name}
						</h1>
					</div>
					<div className='flex items-center gap-2 mt-2'>
						<Badge variant={getStatusBadgeVariant(testCase.status)}>
							{testCase.status}
						</Badge>
					</div>
				</div>
				<div className='flex gap-2'>
					<Button>Run Test</Button>
				</div>
			</div>

			<div className='border-b border-gray-200'>
				<nav className='flex space-x-8'>
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
						onClick={() => setActiveTab('dependencies')}
						className={`py-4 px-1 border-b-2 font-medium text-sm relative ${
							activeTab === 'dependencies'
								? 'border-blue-500 text-blue-600'
								: 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
						}`}
					>
						Dependencies
						{testCase.dependencies && testCase.dependencies.length > 0 && (
							<span className='absolute -top-2 -right-2 bg-blue-500 text-white text-xs font-medium rounded-full w-6 h-6 flex items-center justify-center shadow-sm'>
								{testCase.dependencies.length}
							</span>
						)}
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
					<div className='p-4'>
						<div className='space-y-6'>
							{/* Keep the CollapsibleTestCase for now for adding steps */}
							<div className='mt-8' id='collapsible-test-case'>
								<CollapsibleTestCase
									testCase={testCase}
									onUpdateTestCase={handleUpdateTestCase}
									onAddStep={handleSubmitStep}
									onUpdateStep={handleUpdateStep}
									onDeleteStep={handleDeleteStep}
									onReorderSteps={handleReorderSteps}
									isSubmitting={isSubmitting}
								/>
							</div>
						</div>
					</div>
				</Card>
			)}

			{activeTab === 'dependencies' && (
				<Card>
					<div className='p-4'>
						<h2 className='text-lg font-semibold mb-4'>Test Dependencies</h2>

						{testCaseId && (
							<div className='space-y-6'>
								<TestDependencyGraph testCaseId={testCaseId} />

								<div className='mt-6'>
									<div className='flex justify-between items-center mb-4'>
										<h3 className='text-md font-medium'>Dependency Details</h3>
										{testCase.dependencies &&
											testCase.dependencies.length > 0 && (
												<div className='flex items-center gap-2'>
													<span className='bg-blue-500 text-white text-xs font-medium rounded-full w-6 h-6 flex items-center justify-center shadow-sm'>
														{testCase.dependencies.length}
													</span>
													<span className='text-sm text-blue-800 font-medium'>
														Dependencies
													</span>
												</div>
											)}
									</div>

									{testCase.dependencies && testCase.dependencies.length > 0 ? (
										<div className='space-y-4'>
											<div className='bg-gray-50 p-3 rounded-md'>
												<p className='text-sm text-gray-700'>
													<span className='font-medium'>
														Why Dependencies Matter:
													</span>{' '}
													Test dependencies ensure that tests run in the correct
													order and can share data between them. This test case
													relies on the following test cases to run
													successfully.
												</p>
											</div>

											<div className='space-y-4'>
												{testCase.dependencies.map((depId) => {
													// Find the dependent test case
													let depTestCase: TestCase | null = null
													projects.forEach((project) => {
														project.testSuites.forEach((suite) => {
															const tc = suite.testCases.find(
																(tc) => tc.id === depId
															)
															if (tc) depTestCase = tc
														})
													})

													return (
														<div
															key={depId}
															className='border border-gray-200 rounded-md p-4 hover:bg-gray-50'
														>
															{depTestCase ? (
																<>
																	<div className='flex items-center justify-between'>
																		<div className='flex items-center gap-2'>
																			<span className='font-medium text-blue-600'>
																				{depTestCase.name}
																			</span>
																			<span
																				className={`text-xs px-2 py-0.5 rounded-full ${
																					depTestCase.status === 'passed'
																						? 'bg-green-100 text-green-800'
																						: depTestCase.status === 'failed'
																							? 'bg-red-100 text-red-800'
																							: depTestCase.status === 'running'
																								? 'bg-yellow-100 text-yellow-800'
																								: 'bg-gray-100 text-gray-800'
																				}`}
																			>
																				{depTestCase.status}
																			</span>
																		</div>
																		<span className='text-xs text-gray-500'>
																			ID: {depTestCase.id}
																		</span>
																	</div>

																	<p className='text-gray-600 mt-2'>
																		{depTestCase.description}
																	</p>

																	<div className='grid grid-cols-2 gap-4 mt-3'>
																		<div>
																			<h4 className='text-xs font-medium text-gray-500'>
																				Requirement
																			</h4>
																			<p className='text-sm mt-1'>
																				{depTestCase.requirement}
																			</p>
																		</div>
																		<div>
																			<h4 className='text-xs font-medium text-gray-500'>
																				Target
																			</h4>
																			<p className='text-sm mt-1'>
																				{depTestCase.target}
																			</p>
																		</div>
																	</div>

																	{depTestCase.sharedData && (
																		<div className='mt-3 p-3 bg-blue-50 rounded-md'>
																			<div className='flex items-center justify-between'>
																				<p className='text-xs font-medium text-blue-700'>
																					Shared Data
																				</p>
																				<span className='text-xs text-blue-600'>
																					Used by this test case
																				</span>
																			</div>
																			<pre className='text-xs mt-2 overflow-x-auto bg-white p-2 rounded border border-blue-100'>
																				{JSON.stringify(
																					depTestCase.sharedData,
																					null,
																					2
																				)}
																			</pre>
																		</div>
																	)}
																</>
															) : (
																<div className='text-center py-4'>
																	<span className='text-gray-500'>
																		Unknown test case ({depId})
																	</span>
																</div>
															)}
														</div>
													)
												})}
											</div>
										</div>
									) : (
										<div className='text-center py-8 border border-dashed border-gray-300 rounded-md'>
											<p className='text-gray-500'>
												This test case has no dependencies.
											</p>
											<p className='text-sm text-gray-400 mt-2'>
												Dependencies help ensure tests run in the correct order.
											</p>
										</div>
									)}

									{testCase.sharedData && (
										<div className='mt-6'>
											<h3 className='text-md font-medium mb-3'>
												Shared Data from This Test
											</h3>
											<div className='p-4 bg-green-50 rounded-md'>
												<p className='text-sm text-green-700 mb-2'>
													This test case provides the following data that can be
													used by dependent tests:
												</p>
												<pre className='text-xs bg-white p-3 rounded border border-green-100 overflow-x-auto'>
													{JSON.stringify(testCase.sharedData, null, 2)}
												</pre>
											</div>
										</div>
									)}
								</div>
							</div>
						)}
					</div>
				</Card>
			)}

			{activeTab === 'reports' && (
				<Card>
					<div className='p-4'>
						<h2 className='text-lg font-semibold mb-4'>Test Reports</h2>

						{reports.length > 0 ? (
							<div className='space-y-4'>
								{reports.map((report) => (
									<div
										key={report.id}
										className='p-4 border border-gray-200 rounded-md hover:bg-gray-50'
									>
										<div className='flex justify-between'>
											<div className='flex items-center gap-2'>
												<Badge variant={getStatusBadgeVariant(report.status)}>
													{report.status}
												</Badge>
												<span className='text-gray-600'>
													{formatDateTime(report.startTime)}
												</span>
											</div>
											<div className='flex items-center gap-2'>
												<span className='text-gray-600'>
													{getBrowserIcon(report.browser)} {report.browser}
												</span>
												<span className='text-gray-600'>
													Duration: {formatDuration(report.duration)}
												</span>
											</div>
										</div>

										{report.errors && report.errors.length > 0 && (
											<div className='mt-3 p-3 bg-red-50 border border-red-100 rounded text-red-700 text-sm'>
												{report.errors.map((error, index) => (
													<div key={index}>{error}</div>
												))}
											</div>
										)}

										<div className='mt-3 flex justify-end'>
											<Button
												variant='outline'
												size='sm'
												onClick={() => navigate(`/reports/${report.id}`)}
											>
												View Details
											</Button>
										</div>
									</div>
								))}
							</div>
						) : (
							<div className='text-center py-8'>
								<p className='text-gray-500'>
									No test reports available for this test case.
								</p>
								<Button className='mt-4' variant='outline' size='sm'>
									Run Test
								</Button>
							</div>
						)}
					</div>
				</Card>
			)}
		</div>
	)
}

export default TestCaseDetailView
