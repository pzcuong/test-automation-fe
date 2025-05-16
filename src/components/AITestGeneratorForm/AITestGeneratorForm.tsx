import React, {useState} from 'react'
import {Button, TextArea, Checkbox, Select} from '@/components/ui'
import {useProjectStore} from '@/store'
import {TestCase} from '@/types/common.types'

interface AITestGeneratorFormProps {
	testSuiteId: string
	onSubmit: (prompt: string, dependencies?: string[]) => void
	onCancel: () => void
	isSubmitting?: boolean
}

const AITestGeneratorForm: React.FC<AITestGeneratorFormProps> = ({
	testSuiteId,
	onSubmit,
	onCancel,
	isSubmitting = false,
}) => {
	const [prompt, setPrompt] = useState('')
	const [error, setError] = useState('')
	const [showDependencies, setShowDependencies] = useState(false)
	const [dependencies, setDependencies] = useState<string[]>([])
	const [includeDataSharing, setIncludeDataSharing] = useState(false)

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
				availableTestCases.push(tc)
			})
		})
	})

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()

		if (!prompt.trim()) {
			setError('Please enter a prompt for the AI')
			return
		}

		// Add dependency information to the prompt if selected
		let finalPrompt = prompt

		if (showDependencies && dependencies.length > 0) {
			const dependentTestCases = availableTestCases.filter((tc) =>
				dependencies.includes(tc.id)
			)

			finalPrompt += '\n\nThis test case depends on the following test cases:'
			dependentTestCases.forEach((tc) => {
				finalPrompt += `\n- ${tc.name}: ${tc.description}`
			})

			if (includeDataSharing) {
				finalPrompt +=
					'\n\nPlease include data sharing between these test cases. For example, product prices should be consistent between product creation and order views.'
			}
		}

		onSubmit(finalPrompt, showDependencies ? dependencies : undefined)
	}

	return (
		<form onSubmit={handleSubmit} className='space-y-6'>
			<div>
				<h3 className='text-sm font-medium text-gray-700 mb-2'>
					How to write an effective prompt:
				</h3>
				<ul className='list-disc pl-5 text-sm text-gray-600 space-y-1'>
					<li>Be specific about what you want to test</li>
					<li>Include details about the application or feature</li>
					<li>Mention any specific scenarios or edge cases</li>
					<li>Specify expected behaviors or outcomes</li>
				</ul>
			</div>

			<TextArea
				id='ai-prompt'
				label='Prompt for AI Test Generation'
				placeholder='Example: Generate a test case for user login with valid credentials, checking that the user is redirected to the dashboard after successful login.'
				value={prompt}
				onChange={(e) => {
					setPrompt(e.target.value)
					if (e.target.value.trim()) {
						setError('')
					}
				}}
				error={error}
				required
				rows={6}
			/>

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
							Select test cases that must be run before this one. The AI will
							generate a test case that works with the selected dependencies.
						</p>

						<div className='flex items-center mb-2'>
							<Checkbox
								id='include-data-sharing'
								checked={includeDataSharing}
								onChange={(e) => setIncludeDataSharing(e.target.checked)}
							/>
							<label
								htmlFor='include-data-sharing'
								className='ml-2 text-sm font-medium text-gray-700'
							>
								Include data sharing between test cases
							</label>
						</div>

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
					Generate Test Case
				</Button>
			</div>
		</form>
	)
}

export default AITestGeneratorForm
