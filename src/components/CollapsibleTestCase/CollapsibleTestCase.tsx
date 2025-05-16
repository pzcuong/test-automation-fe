import React, {useState, useEffect} from 'react'
import {
	TestCase,
	TestCaseType,
	TestStatus,
	TestStep,
} from '@/types/common.types'
import {Collapsible, Button, Badge} from '@/components/ui'
import TestCaseForm from '@/components/TestCaseForm/TestCaseForm'
import TestStepForm from '@/components/TestStepForm/TestStepForm'
import CollapsibleTestStepsList from '@/components/CollapsibleTestStepsList/CollapsibleTestStepsList'
import {formatDate} from '@/utils/date'

interface CollapsibleTestCaseProps {
	testCase: TestCase
	onUpdateTestCase: (
		updates: Partial<
			Omit<TestCase, 'id' | 'createdAt' | 'updatedAt' | 'testSuiteId' | 'steps'>
		>
	) => void
	onAddStep: (step: Omit<TestStep, 'id' | 'testCaseId'>) => void
	onUpdateStep: (
		stepId: string,
		updates: Partial<Omit<TestStep, 'id' | 'testCaseId'>>
	) => void
	onDeleteStep: (stepId: string) => void
	onReorderSteps?: (steps: TestStep[]) => void
	isSubmitting?: boolean
}

const CollapsibleTestCase: React.FC<CollapsibleTestCaseProps> = ({
	testCase,
	onUpdateTestCase,
	onAddStep,
	onUpdateStep,
	onDeleteStep,
	onReorderSteps,
	isSubmitting = false,
}) => {
	const [isEditing, setIsEditing] = useState(false)
	const [isAddingStep, setIsAddingStep] = useState(false)
	const [editingStep, setEditingStep] = useState<TestStep | null>(null)

	// Listen for edit step events
	useEffect(() => {
		const handleEditStepEvent = (event: CustomEvent) => {
			const {stepId} = event.detail
			const step = testCase.steps.find((s) => s.id === stepId)
			if (step) {
				setEditingStep(step)
				// Ensure the test case is expanded
				const collapsibleElement = document.getElementById(
					'collapsible-test-case'
				)
				if (collapsibleElement) {
					// Find the collapsible content and make sure it's visible
					const collapsibleContent = collapsibleElement.querySelector(
						'[data-state="open"]'
					)
					if (!collapsibleContent) {
						// If not open, find and click the trigger button
						const triggerButton = collapsibleElement.querySelector(
							'[data-state="closed"]'
						)
						if (triggerButton) {
							;(triggerButton as HTMLElement).click()
						}
					}
				}
			}
		}

		// Add event listener
		document.addEventListener('editStep', handleEditStepEvent as EventListener)

		// Clean up
		return () => {
			document.removeEventListener(
				'editStep',
				handleEditStepEvent as EventListener
			)
		}
	}, [testCase.steps])

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

	const getTypeBadgeVariant = (type: TestCaseType) => {
		switch (type) {
			case TestCaseType.POSITIVE:
				return 'success'
			case TestCaseType.NEGATIVE:
				return 'warning'
			case TestCaseType.EDGE_CASE:
				return 'secondary'
			default:
				return 'default'
		}
	}

	const handleUpdateTestCase = (
		updates: Omit<
			TestCase,
			'id' | 'createdAt' | 'updatedAt' | 'testSuiteId' | 'steps'
		>
	) => {
		onUpdateTestCase(updates)
		setIsEditing(false)
	}

	const handleAddStep = (step: Omit<TestStep, 'id' | 'testCaseId'>) => {
		onAddStep(step)
		setIsAddingStep(false)
	}

	const handleUpdateStep = (
		updates: Partial<Omit<TestStep, 'id' | 'testCaseId'>>
	) => {
		if (editingStep) {
			onUpdateStep(editingStep.id, updates)
			setEditingStep(null)
		}
	}

	const titleContent = (
		<div className='flex items-center gap-2'>
			<span className='text-lg font-semibold'>{testCase.name}</span>
			<Badge variant={getStatusBadgeVariant(testCase.status)}>
				{testCase.status}
			</Badge>
			<Badge variant={getTypeBadgeVariant(testCase.type)}>
				{testCase.type}
			</Badge>
		</div>
	)

	return (
		<Collapsible title={titleContent} className='mb-4' defaultOpen={true}>
			{isEditing ? (
				<TestCaseForm
					testCase={testCase}
					onSubmit={handleUpdateTestCase}
					onCancel={() => setIsEditing(false)}
					isSubmitting={isSubmitting}
				/>
			) : (
				<div className='space-y-4'>
					<div className='flex justify-between'>
						<h3 className='text-lg font-semibold'>{testCase.name}</h3>
						<Button
							variant='outline'
							size='sm'
							onClick={() => setIsEditing(true)}
						>
							Edit Test Case
						</Button>
					</div>

					<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
						<div>
							<h4 className='text-sm font-medium text-gray-500'>Description</h4>
							<p className='mt-1'>{testCase.description}</p>
						</div>
						<div>
							<h4 className='text-sm font-medium text-gray-500'>
								Last Updated
							</h4>
							<p className='mt-1'>{formatDate(testCase.updatedAt)}</p>
						</div>
					</div>

					<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
						<div>
							<h4 className='text-sm font-medium text-gray-500'>Requirement</h4>
							<p className='mt-1'>{testCase.requirement}</p>
						</div>
						<div>
							<h4 className='text-sm font-medium text-gray-500'>Target</h4>
							<p className='mt-1'>{testCase.target}</p>
						</div>
					</div>

					<div className='border-t border-gray-200 pt-4 mt-4'>
						<div className='flex justify-between items-center mb-4'>
							<h3 className='font-semibold'>Test Steps</h3>
							<Button
								variant='outline'
								size='sm'
								onClick={() => setIsAddingStep(true)}
							>
								Add Step
							</Button>
						</div>

						{isAddingStep && (
							<div className='mb-4 p-4 border border-gray-200 rounded-md bg-gray-50'>
								<h4 className='font-medium mb-2'>Add New Step</h4>
								<TestStepForm
									onSubmit={handleAddStep}
									onCancel={() => setIsAddingStep(false)}
									isSubmitting={isSubmitting}
								/>
							</div>
						)}

						{testCase.steps.length === 0 ? (
							<div className='text-center py-6 bg-gray-50 rounded-md'>
								<p className='text-gray-500'>No steps added yet</p>
								<Button
									variant='outline'
									size='sm'
									className='mt-2'
									onClick={() => setIsAddingStep(true)}
								>
									Add First Step
								</Button>
							</div>
						) : (
							<CollapsibleTestStepsList
								steps={testCase.steps}
								onReorder={(updatedSteps) => {
									// If onReorderSteps is provided, use it directly
									if (onReorderSteps) {
										onReorderSteps(updatedSteps)
									} else {
										// Fallback to updating each step individually
										updatedSteps.forEach((step) => {
											onUpdateStep(step.id, {order: step.order})
										})
									}
								}}
								onEdit={(step) => setEditingStep(step)}
								onDelete={onDeleteStep}
								editingStepId={editingStep?.id || null}
							/>
						)}

						{/* Edit form appears below the steps list when a step is being edited */}
						{editingStep && (
							<div className='mt-3 p-4 border border-gray-200 rounded-md bg-gray-50'>
								<h4 className='font-medium mb-2'>Edit Step</h4>
								<TestStepForm
									step={editingStep}
									onSubmit={handleUpdateStep}
									onCancel={() => setEditingStep(null)}
									isSubmitting={isSubmitting}
								/>
							</div>
						)}
					</div>
				</div>
			)}
		</Collapsible>
	)
}

export default CollapsibleTestCase
