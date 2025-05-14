import React, {useEffect, useState} from 'react'
import {useParams, useNavigate} from 'react-router-dom'
import {
	Button,
	Card,
	SlidePanel,
	ActionButton,
	PlusIcon,
	AIIcon,
	EditIcon,
	RunIcon,
	Input,
} from '@/components/ui'
import TestCaseCard from '@/components/TestCaseCard/TestCaseCard'
import TestCaseForm from '@/components/TestCaseForm/TestCaseForm'
import AITestGeneratorForm from '@/components/AITestGeneratorForm/AITestGeneratorForm'
import FeatureSection from '@/components/FeatureSection/FeatureSection'
import {useProjectStore} from '@/store'
import {formatDate} from '@/utils/date'
import {
	TestCase,
	TestCaseType,
	TestStatus,
	TestSuite,
} from '@/types/common.types'

const ProjectDetailView: React.FC = () => {
	const {projectId} = useParams<{projectId: string}>()
	const navigate = useNavigate()
	const {
		projects,
		selectedProject,
		selectProject,
		createTestCase,
		generateTestCaseWithAI,
	} = useProjectStore()

	// Panel states
	const [isCreatePanelOpen, setIsCreatePanelOpen] = useState(false)
	const [isAIPanelOpen, setIsAIPanelOpen] = useState(false)
	const [isEditProjectPanelOpen, setIsEditProjectPanelOpen] = useState(false)
	const [currentTestSuiteId, setCurrentTestSuiteId] = useState<string | null>(
		null
	)
	const [isSubmitting, setIsSubmitting] = useState(false)

	// State for features
	const [features, setFeatures] = useState<
		{id: string; name: string; description: string}[]
	>([])
	const [nextFeatureId, setNextFeatureId] = useState(1)

	useEffect(() => {
		if (projectId) {
			selectProject(projectId)
		}
	}, [projectId, selectProject])

	const handleOpenCreatePanel = (testSuiteId: string) => {
		setCurrentTestSuiteId(testSuiteId)
		setIsCreatePanelOpen(true)
	}

	const handleOpenAIPanel = (testSuiteId: string) => {
		setCurrentTestSuiteId(testSuiteId)
		setIsAIPanelOpen(true)
	}

	const handleEditProject = () => {
		setIsEditProjectPanelOpen(true)
	}

	const handleCreateTestCase = (
		testCase: Omit<
			TestCase,
			'id' | 'createdAt' | 'updatedAt' | 'testSuiteId' | 'steps'
		>
	) => {
		if (!currentTestSuiteId) return

		setIsSubmitting(true)

		try {
			const newTestCaseId = createTestCase(currentTestSuiteId, testCase)
			setIsCreatePanelOpen(false)
			// Optionally navigate to the new test case
			// navigate(`/projects/${projectId}/test-cases/${newTestCaseId}`);
		} catch (error) {
			console.error('Failed to create test case:', error)
		} finally {
			setIsSubmitting(false)
		}
	}

	const handleGenerateWithAI = async (prompt: string) => {
		if (!currentTestSuiteId) return

		setIsSubmitting(true)

		try {
			const newTestCaseId = await generateTestCaseWithAI(
				currentTestSuiteId,
				prompt
			)
			setIsAIPanelOpen(false)
			// Optionally navigate to the new test case
			// navigate(`/projects/${projectId}/test-cases/${newTestCaseId}`);
		} catch (error) {
			console.error('Failed to generate test case with AI:', error)
		} finally {
			setIsSubmitting(false)
		}
	}

	const handleAddFeature = (featureName: string, description: string) => {
		const newFeature = {
			id: `feature-${nextFeatureId}`,
			name: featureName,
			description: description,
		}

		setFeatures([...features, newFeature])
		setNextFeatureId(nextFeatureId + 1)
	}

	const handleUpdateProject = (projectData: any) => {
		// This would update the project details
		console.log('Updating project with data:', projectData)
		setIsEditProjectPanelOpen(false)
	}

	if (!selectedProject) {
		return (
			<div className='flex justify-center items-center h-64'>
				<p className='text-gray-500'>Loading project details...</p>
			</div>
		)
	}

	// Calculate test case statistics
	const allTestCases = selectedProject.testSuites.flatMap(
		(suite) => suite.testCases
	)
	const passedTests = allTestCases.filter(
		(tc) => tc.status === TestStatus.PASSED
	).length
	const failedTests = allTestCases.filter(
		(tc) => tc.status === TestStatus.FAILED
	).length
	const runningTests = allTestCases.filter(
		(tc) => tc.status === TestStatus.RUNNING
	).length
	const otherTests =
		allTestCases.length - passedTests - failedTests - runningTests

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
						<h1 className='text-2xl font-bold text-gray-900'>
							{selectedProject.name}
						</h1>
					</div>
					<p className='text-gray-600 mt-1'>{selectedProject.description}</p>
				</div>
				<div className='flex gap-2'>
					<ActionButton
						icon={<EditIcon />}
						variant='outline'
						onClick={handleEditProject}
					>
						Edit Project
					</ActionButton>
					<ActionButton icon={<RunIcon />} onClick={() => {}}>
						Run All Tests
					</ActionButton>
				</div>
			</div>

			<div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
				<Card className='bg-green-50 border-green-100'>
					<div className='flex flex-col items-center p-4'>
						<span className='text-3xl font-bold text-green-600'>
							{passedTests}
						</span>
						<span className='text-sm text-gray-600'>Passed Tests</span>
					</div>
				</Card>

				<Card className='bg-red-50 border-red-100'>
					<div className='flex flex-col items-center p-4'>
						<span className='text-3xl font-bold text-red-600'>
							{failedTests}
						</span>
						<span className='text-sm text-gray-600'>Failed Tests</span>
					</div>
				</Card>

				<Card className='bg-yellow-50 border-yellow-100'>
					<div className='flex flex-col items-center p-4'>
						<span className='text-3xl font-bold text-yellow-600'>
							{runningTests}
						</span>
						<span className='text-sm text-gray-600'>Running Tests</span>
					</div>
				</Card>

				<Card className='bg-gray-50 border-gray-100'>
					<div className='flex flex-col items-center p-4'>
						<span className='text-3xl font-bold text-gray-600'>
							{otherTests}
						</span>
						<span className='text-sm text-gray-600'>Other Tests</span>
					</div>
				</Card>
			</div>

			{/* User-added features */}
			{features.map((feature) => (
				<FeatureSection
					key={feature.id}
					title={feature.name}
					description={feature.description}
					onAddFeature={handleAddFeature}
				>
					<div className='text-center py-8 bg-gray-50 rounded-lg border border-gray-200'>
						<p className='text-gray-500'>No test cases in this feature yet.</p>
						<div className='flex justify-center gap-2 mt-4'>
							<ActionButton
								icon={<AIIcon />}
								variant='outline'
								size='sm'
								onClick={() => setIsAIPanelOpen(true)}
							>
								Generate with AI
							</ActionButton>
							<ActionButton
								icon={<PlusIcon />}
								variant='outline'
								size='sm'
								onClick={() => setIsCreatePanelOpen(true)}
							>
								Add Test Case
							</ActionButton>
						</div>
					</div>
				</FeatureSection>
			))}

			{/* Add a new feature section */}
			<FeatureSection
				title='Add New Feature'
				description='Create a new feature to organize your test cases'
				onAddFeature={handleAddFeature}
			>
				<div className='text-center py-8 bg-gray-50 rounded-lg border border-gray-200'>
					<p className='text-gray-500'>
						Click "Add Feature" to create a new feature section
					</p>
				</div>
			</FeatureSection>

			<div className='space-y-6'>
				{selectedProject.testSuites.map((suite) => (
					<div key={suite.id} className='space-y-4'>
						<div className='flex justify-between items-center'>
							<h2 className='text-xl font-semibold text-gray-900'>
								{suite.name}
							</h2>
							<div className='flex gap-2'>
								<ActionButton
									icon={<AIIcon />}
									variant='outline'
									size='sm'
									onClick={() => handleOpenAIPanel(suite.id)}
								>
									Generate with AI
								</ActionButton>
								<ActionButton
									icon={<PlusIcon />}
									variant='outline'
									size='sm'
									onClick={() => handleOpenCreatePanel(suite.id)}
								>
									Add Test Case
								</ActionButton>
							</div>
						</div>

						<p className='text-gray-600'>{suite.description}</p>

						<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
							{suite.testCases.map((testCase) => (
								<TestCaseCard
									key={testCase.id}
									testCase={testCase}
									onClick={(testCase) =>
										navigate(
											`/projects/${selectedProject.id}/test-cases/${testCase.id}`
										)
									}
								/>
							))}

							{suite.testCases.length === 0 && (
								<div className='col-span-3 text-center py-8 bg-gray-50 rounded-lg border border-gray-200'>
									<p className='text-gray-500'>
										No test cases in this suite yet.
									</p>
									<div className='flex justify-center gap-2 mt-4'>
										<ActionButton
											icon={<AIIcon />}
											variant='outline'
											size='sm'
											onClick={() => handleOpenAIPanel(suite.id)}
										>
											Generate with AI
										</ActionButton>
										<ActionButton
											icon={<PlusIcon />}
											variant='outline'
											size='sm'
											onClick={() => handleOpenCreatePanel(suite.id)}
										>
											Add Test Case
										</ActionButton>
									</div>
								</div>
							)}
						</div>
					</div>
				))}
			</div>

			{/* Create Test Case Panel */}
			<SlidePanel
				isOpen={isCreatePanelOpen}
				onClose={() => setIsCreatePanelOpen(false)}
				title='Create New Test Case'
				size='md'
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
				title='Generate Test Case with AI'
				size='md'
			>
				<AITestGeneratorForm
					onSubmit={handleGenerateWithAI}
					onCancel={() => setIsAIPanelOpen(false)}
					isSubmitting={isSubmitting}
				/>
			</SlidePanel>

			{/* Edit Project Panel */}
			<SlidePanel
				isOpen={isEditProjectPanelOpen}
				onClose={() => setIsEditProjectPanelOpen(false)}
				title='Edit Project'
				size='md'
			>
				<div className='space-y-4'>
					<Input
						id='project-name'
						label='Project Name'
						defaultValue={selectedProject.name}
					/>
					<Input
						id='project-description'
						label='Description'
						defaultValue={selectedProject.description}
					/>
					<div className='flex justify-end space-x-3 mt-6'>
						<Button
							type='button'
							variant='outline'
							onClick={() => setIsEditProjectPanelOpen(false)}
						>
							Cancel
						</Button>
						<Button
							type='button'
							onClick={() => {
								handleUpdateProject({
									name: (
										document.getElementById('project-name') as HTMLInputElement
									).value,
									description: (
										document.getElementById(
											'project-description'
										) as HTMLInputElement
									).value,
								})
							}}
						>
							Save Changes
						</Button>
					</div>
				</div>
			</SlidePanel>
		</div>
	)
}

export default ProjectDetailView
