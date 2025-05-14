import React, {useState, useEffect} from 'react'
import {Button, Input, TextArea, Select} from '@/components/ui'
import {TestCase, TestCaseType, TestStatus} from '@/types/common.types'

interface TestCaseFormProps {
	testCase?: TestCase
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
	const [errors, setErrors] = useState<Record<string, string>>({})

	useEffect(() => {
		if (testCase) {
			setName(testCase.name)
			setDescription(testCase.description)
			setRequirement(testCase.requirement)
			setTarget(testCase.target)
			setType(testCase.type)
			setStatus(testCase.status)
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
