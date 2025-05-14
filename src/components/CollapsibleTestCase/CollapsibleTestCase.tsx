import React, {useState} from 'react'
import {
	TestCase,
	TestCaseType,
	TestStatus,
	TestStep,
} from '@/types/common.types'
import {Collapsible, Button, Badge} from '@/components/ui'
import TestCaseForm from '@/components/TestCaseForm/TestCaseForm'
import TestStepForm from '@/components/TestStepForm/TestStepForm'
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
	isSubmitting?: boolean
}

const CollapsibleTestCase: React.FC<CollapsibleTestCaseProps> = ({
	testCase,
	onUpdateTestCase,
	onAddStep,
	onUpdateStep,
	onDeleteStep,
	isSubmitting = false,
}) => {
	const [isEditing, setIsEditing] = useState(false)
	const [isAddingStep, setIsAddingStep] = useState(false)
	const [editingStep, setEditingStep] = useState<TestStep | null>(null)

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
			<span>{testCase.name}</span>
			<Badge variant={getStatusBadgeVariant(testCase.status)}>
				{testCase.status}
			</Badge>
			<Badge variant={getTypeBadgeVariant(testCase.type)}>
				{testCase.type}
			</Badge>
		</div>
	)

	return (
		<Collapsible title={titleContent} className='mb-4'>
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

						<div className='space-y-3'>
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
								testCase.steps
									.sort((a, b) => a.order - b.order)
									.map((step) => (
										<React.Fragment key={step.id}>
											<div className='p-3 border border-gray-200 rounded-md hover:bg-gray-50'>
												<div className='flex items-center gap-3'>
													<div className='bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center font-medium text-gray-700'>
														{step.order}
													</div>
													<div className='flex-grow'>
														<div className='font-medium capitalize'>
															{step.action}
														</div>
														<div className='text-sm text-gray-600 mt-1'>
															{step.selector}
															{step.value && (
																<span className='ml-2'>
																	Value: {step.value}
																</span>
															)}
														</div>
														{step.expectedOutcome && (
															<div className='text-sm text-gray-600 mt-1'>
																Expected: {step.expectedOutcome}
															</div>
														)}
													</div>
													<div className='flex gap-2'>
														<Button
															variant='ghost'
															size='sm'
															onClick={() => setEditingStep(step)}
														>
															<svg
																xmlns='http://www.w3.org/2000/svg'
																className='h-4 w-4'
																viewBox='0 0 24 24'
																fill='none'
																stroke='currentColor'
																strokeWidth='2'
																strokeLinecap='round'
																strokeLinejoin='round'
															>
																<path d='M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7' />
																<path d='M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z' />
															</svg>
														</Button>
														<Button
															variant='ghost'
															size='sm'
															onClick={() => onDeleteStep(step.id)}
														>
															<svg
																xmlns='http://www.w3.org/2000/svg'
																className='h-4 w-4 text-red-500'
																viewBox='0 0 24 24'
																fill='none'
																stroke='currentColor'
																strokeWidth='2'
																strokeLinecap='round'
																strokeLinejoin='round'
															>
																<path d='M3 6h18' />
																<path d='M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2' />
																<line x1='10' y1='11' x2='10' y2='17' />
																<line x1='14' y1='11' x2='14' y2='17' />
															</svg>
														</Button>
													</div>
												</div>
											</div>

											{/* Edit form appears directly below the step being edited */}
											{editingStep && editingStep.id === step.id && (
												<div className='mt-1 mb-3 p-4 border border-gray-200 rounded-md bg-gray-50'>
													<h4 className='font-medium mb-2'>Edit Step</h4>
													<TestStepForm
														step={editingStep}
														onSubmit={handleUpdateStep}
														onCancel={() => setEditingStep(null)}
														isSubmitting={isSubmitting}
													/>
												</div>
											)}
										</React.Fragment>
									))
							)}
						</div>
					</div>
				</div>
			)}
		</Collapsible>
	)
}

export default CollapsibleTestCase
