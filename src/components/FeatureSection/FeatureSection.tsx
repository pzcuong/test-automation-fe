import React, {useState} from 'react'
import {
	Button,
	Card,
	Input,
	ActionButton,
	PlusIcon,
	AIIcon,
	SlidePanel,
} from '@/components/ui'

interface FeatureSectionProps {
	title: string
	description: string
	children: React.ReactNode
	onAddFeature?: (featureName: string, description: string) => void
}

const FeatureSection: React.FC<FeatureSectionProps> = ({
	title,
	description,
	children,
	onAddFeature,
}) => {
	const [isAddingFeature, setIsAddingFeature] = useState(false)
	const [isAIGenerating, setIsAIGenerating] = useState(false)
	const [featureName, setFeatureName] = useState('')
	const [featureDescription, setFeatureDescription] = useState('')
	const [aiPrompt, setAIPrompt] = useState('')
	const [errors, setErrors] = useState<Record<string, string>>({})

	const handleAddFeature = () => {
		const newErrors: Record<string, string> = {}

		if (!featureName.trim()) {
			newErrors.featureName = 'Feature name is required'
		}

		if (!featureDescription.trim()) {
			newErrors.featureDescription = 'Feature description is required'
		}

		setErrors(newErrors)

		if (Object.keys(newErrors).length === 0 && onAddFeature) {
			onAddFeature(featureName, featureDescription)
			setFeatureName('')
			setFeatureDescription('')
			setIsAddingFeature(false)
		}
	}

	const handleGenerateWithAI = () => {
		// This would be implemented to call an AI service
		console.log('Generating feature with AI using prompt:', aiPrompt)
		setIsAIGenerating(false)
		// For demo purposes, let's create a feature with the prompt
		if (aiPrompt.trim() && onAddFeature) {
			onAddFeature(
				`AI Generated: ${aiPrompt.substring(0, 20)}...`,
				`Feature generated from AI prompt: ${aiPrompt}`
			)
			setAIPrompt('')
		}
	}

	return (
		<div className='mb-8'>
			<div className='flex justify-between items-center mb-4'>
				<div>
					<h2 className='text-xl font-semibold text-gray-900'>{title}</h2>
					<p className='text-gray-600 text-sm'>{description}</p>
				</div>
				<div className='flex gap-2'>
					<ActionButton
						icon={<PlusIcon />}
						variant='outline'
						size='sm'
						onClick={() => setIsAddingFeature(true)}
					>
						Add Feature
					</ActionButton>
					<ActionButton
						icon={<AIIcon />}
						variant='outline'
						size='sm'
						onClick={() => setIsAIGenerating(true)}
					>
						Generate with AI
					</ActionButton>
				</div>
			</div>

			{children}

			{/* Add Feature Panel */}
			<SlidePanel
				isOpen={isAddingFeature}
				onClose={() => setIsAddingFeature(false)}
				title='Add New Feature'
				size='md'
			>
				<div className='space-y-4'>
					<Input
						id='feature-name'
						label='Feature Name'
						placeholder='e.g., User Authentication, Shopping Cart, Checkout'
						value={featureName}
						onChange={(e) => setFeatureName(e.target.value)}
						error={errors.featureName}
						required
					/>

					<Input
						id='feature-description'
						label='Description'
						placeholder='e.g., Test cases for user login, registration, and password recovery'
						value={featureDescription}
						onChange={(e) => setFeatureDescription(e.target.value)}
						error={errors.featureDescription}
						required
					/>
				</div>
				<div className='flex justify-end space-x-3 mt-6'>
					<Button
						type='button'
						variant='outline'
						onClick={() => setIsAddingFeature(false)}
					>
						Cancel
					</Button>
					<Button type='button' onClick={handleAddFeature}>
						Add Feature
					</Button>
				</div>
			</SlidePanel>

			{/* AI Generation Panel */}
			<SlidePanel
				isOpen={isAIGenerating}
				onClose={() => setIsAIGenerating(false)}
				title='Generate Feature with AI'
				size='md'
			>
				<div className='space-y-4'>
					<Input
						id='ai-prompt'
						label='Describe the feature you want to create'
						placeholder='e.g., Create a user authentication feature with login, registration, and password recovery'
						value={aiPrompt}
						onChange={(e) => setAIPrompt(e.target.value)}
						required
					/>
					<p className='text-sm text-gray-600'>
						The AI will generate a feature based on your description, including
						test cases and requirements.
					</p>
				</div>
				<div className='flex justify-end space-x-3 mt-6'>
					<Button
						type='button'
						variant='outline'
						onClick={() => setIsAIGenerating(false)}
					>
						Cancel
					</Button>
					<Button
						type='button'
						onClick={handleGenerateWithAI}
						disabled={!aiPrompt.trim()}
					>
						Generate Feature
					</Button>
				</div>
			</SlidePanel>
		</div>
	)
}

export default FeatureSection
