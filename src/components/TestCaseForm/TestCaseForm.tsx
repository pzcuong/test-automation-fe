import React, {useState, useEffect} from 'react'
import {Button, Input, TextArea, Select, Checkbox} from '@/components/ui'
import {TestCase, TestCaseType, TestStatus} from '@/types/common.types'
import {useProjectStore} from '@/store'

interface TestCaseFormProps {
	testCase?: TestCase
	testSuiteId: string
	onSubmit: (
		testCase: Omit<
			TestCase,
			'id' | 'createdAt' | 'updatedAt' | 'testSuiteId' | 'steps'
		>
	) => void
	onCancel: () => void
	isSubmitting?: boolean
}

const TestCaseForm: React.FC<TestCaseFormProps> = ({
	testCase,
	testSuiteId,
	onSubmit,
	onCancel,
	isSubmitting = false,
}) => {
	const [name, setName] = useState('')
	const [description, setDescription] = useState('')
	const [requirement, setRequirement] = useState('')
	const [target, setTarget] = useState('')
	const [type, setType] = useState<TestCaseType>(TestCaseType.POSITIVE)
	const [status, setStatus] = useState<TestStatus>(TestStatus.DRAFT)
	const [dependencies, setDependencies] = useState<string[]>([])
	const [showDependencies, setShowDependencies] = useState(false)
	const [errors, setErrors] = useState<Record<string, string>>({})

	// Get available test cases for dependencies
	const {projects} = useProjectStore()
	const availableTestCases: TestCase[] = []

	// Find all test cases in the current project that could be dependencies
	projects.forEach((project) => {
		project.testSuites.forEach((suite) => {
			if (suite.id === testSuiteId) {
				// Don't include test cases from the current suite as dependencies
				// to avoid circular dependencies
				return
			}

			suite.testCases.forEach((tc) => {
				// Don't include the current test case as a dependency option
				if (testCase && tc.id === testCase.id) {
					return
				}

				availableTestCases.push(tc)
			})
		})
	})

	useEffect(() => {
		if (testCase) {
			setName(testCase.name)
			setDescription(testCase.description)
			setRequirement(testCase.requirement)
			setTarget(testCase.target)
			setType(testCase.type)
			setStatus(testCase.status)
			setDependencies(testCase.dependencies || [])
			setShowDependencies(testCase.dependencies?.length > 0 || false)
		}
	}, [testCase])

	const validate = (): boolean => {
		const newErrors: Record<string, string> = {}

		if (!name.trim()) {
			newErrors.name = 'Name is required'
		}

		if (!description.trim()) {
			newErrors.description = 'Description is required'
		}

		if (!requirement.trim()) {
			newErrors.requirement = 'Requirement is required'
		}

		if (!target.trim()) {
			newErrors.target = 'Target is required'
		}

		setErrors(newErrors)
		return Object.keys(newErrors).length === 0
	}

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()

		if (!validate()) {
			return
		}

		onSubmit({
			name,
			description,
			requirement,
			target,
			type,
			status,
			dependencies: showDependencies ? dependencies : undefined,
		})
	}

	return (
		<form onSubmit={handleSubmit} className='space-y-6'>
			<Input
				id='test-case-name'
				label='Test Case Name'
				placeholder='Enter test case name'
				value={name}
				onChange={(e) => setName(e.target.value)}
				error={errors.name}
				required
			/>

			<TextArea
				id='test-case-description'
				label='Description'
				placeholder='Enter test case description'
				value={description}
				onChange={(e) => setDescription(e.target.value)}
				error={errors.description}
				required
				rows={3}
			/>

			<TextArea
				id='test-case-requirement'
				label='Requirement'
				placeholder='What is being tested? E.g., "User must be able to log in with valid credentials"'
				value={requirement}
				onChange={(e) => setRequirement(e.target.value)}
				error={errors.requirement}
				required
				rows={2}
			/>

			<TextArea
				id='test-case-target'
				label='Target'
				placeholder='What is the expected outcome? E.g., "User should be redirected to dashboard after login"'
				value={target}
				onChange={(e) => setTarget(e.target.value)}
				error={errors.target}
				required
				rows={2}
			/>

			<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
				<Select
					id='test-case-type'
					label='Test Type'
					value={type}
					onChange={(value) => setType(value as TestCaseType)}
					options={[
						{label: 'Positive', value: TestCaseType.POSITIVE},
						{label: 'Negative', value: TestCaseType.NEGATIVE},
						{label: 'Edge Case', value: TestCaseType.EDGE_CASE},
					]}
					required
				/>

				<Select
					id='test-case-status'
					label='Status'
					value={status}
					onChange={(value) => setStatus(value as TestStatus)}
					options={[
						{label: 'Draft', value: TestStatus.DRAFT},
						{label: 'Ready', value: TestStatus.READY},
						{label: 'Blocked', value: TestStatus.BLOCKED},
					]}
					required
				/>
			</div>

			<div className='pt-4 border-t border-gray-200'>
				<div className='flex items-center mb-4'>
					<Checkbox
						id='has-dependencies'
						checked={showDependencies}
						onChange={(e) => setShowDependencies(e.target.checked)}
					/>
					<label
						htmlFor='has-dependencies'
						className='ml-2 text-sm font-medium text-gray-700'
					>
						This test case depends on other test cases
					</label>
				</div>

				{showDependencies && (
					<div className='pl-6 space-y-4'>
						<p className='text-sm text-gray-600'>
							Select test cases that must be run before this one. Dependent test
							cases will share data and run in the correct order.
						</p>

						{availableTestCases.length === 0 ? (
							<p className='text-sm text-gray-500 italic'>
								No available test cases to depend on.
							</p>
						) : (
							<div className='max-h-60 overflow-y-auto border border-gray-200 rounded-md p-3 space-y-2'>
								{availableTestCases.map((tc) => (
									<div key={tc.id} className='flex items-start'>
										<Checkbox
											id={`dependency-${tc.id}`}
											checked={dependencies.includes(tc.id)}
											onChange={(e) => {
												if (e.target.checked) {
													setDependencies([...dependencies, tc.id])
												} else {
													setDependencies(
														dependencies.filter((id) => id !== tc.id)
													)
												}
											}}
										/>
										<div className='ml-2'>
											<label
												htmlFor={`dependency-${tc.id}`}
												className='text-sm font-medium text-gray-700'
											>
												{tc.name}
											</label>
											<p className='text-xs text-gray-500'>{tc.description}</p>
										</div>
									</div>
								))}
							</div>
						)}
					</div>
				)}
			</div>

			<div className='flex justify-end space-x-3 pt-4'>
				<Button
					type='button'
					variant='outline'
					onClick={onCancel}
					disabled={isSubmitting}
				>
					Cancel
				</Button>
				<Button type='submit' isLoading={isSubmitting} disabled={isSubmitting}>
					{testCase ? 'Update Test Case' : 'Create Test Case'}
				</Button>
			</div>
		</form>
	)
}

export default TestCaseForm
