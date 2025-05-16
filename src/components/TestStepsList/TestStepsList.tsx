import React from 'react'
import {TestStep} from '@/types/common.types'
import {Button} from '@/components/ui'
import {
	DndContext,
	closestCenter,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
	DragEndEvent,
} from '@dnd-kit/core'
import {
	arrayMove,
	SortableContext,
	sortableKeyboardCoordinates,
	useSortable,
	verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import {CSS} from '@dnd-kit/utilities'

interface TestStepsListProps {
	steps: TestStep[]
	onReorder: (steps: TestStep[]) => void
	onEdit: (stepId: string) => void
	onDelete: (stepId: string) => void
}

interface SortableItemProps {
	id: string
	step: TestStep
	onEdit: (stepId: string) => void
	onDelete: (stepId: string) => void
	getActionDisplay: (action: string) => string
}

const SortableItem = ({
	id,
	step,
	onEdit,
	onDelete,
	getActionDisplay,
}: SortableItemProps) => {
	const {attributes, listeners, setNodeRef, transform, transition, isDragging} =
		useSortable({id})

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		zIndex: isDragging ? 10 : 1,
		opacity: isDragging ? 0.8 : 1,
	}

	return (
		<div
			ref={setNodeRef}
			style={style}
			className={`border border-gray-200 rounded-md p-3 ${isDragging ? 'bg-blue-50 shadow-lg border-blue-200' : 'bg-white hover:bg-gray-50'}`}
		>
			<div className='flex items-center'>
				<div
					{...attributes}
					{...listeners}
					className='mr-3 text-gray-400 hover:text-gray-600 cursor-grab'
				>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						width='16'
						height='16'
						viewBox='0 0 24 24'
						fill='none'
						stroke='currentColor'
						strokeWidth='2'
						strokeLinecap='round'
						strokeLinejoin='round'
					>
						<line x1='8' y1='6' x2='21' y2='6'></line>
						<line x1='8' y1='12' x2='21' y2='12'></line>
						<line x1='8' y1='18' x2='21' y2='18'></line>
						<line x1='3' y1='6' x2='3.01' y2='6'></line>
						<line x1='3' y1='12' x2='3.01' y2='12'></line>
						<line x1='3' y1='18' x2='3.01' y2='18'></line>
					</svg>
				</div>

				<div className='flex-1'>
					<div className='flex items-center'>
						<span className='font-medium text-gray-700 mr-2'>
							{step.order}.
						</span>
						<span className='text-blue-600 font-medium'>
							{getActionDisplay(step.action)}
						</span>
					</div>

					<div className='mt-1 text-sm text-gray-600'>
						{step.action === 'navigate' ? (
							<span>{step.selector}</span>
						) : (
							<span>
								{step.selector}
								{step.value && ` → ${step.value}`}
								{step.expectedOutcome && ` → Expect: ${step.expectedOutcome}`}
							</span>
						)}
					</div>
				</div>

				<div className='flex space-x-2'>
					<Button variant='ghost' size='sm' onClick={() => onEdit(step.id)}>
						Edit
					</Button>
					<Button variant='ghost' size='sm' onClick={() => onDelete(step.id)}>
						Delete
					</Button>
				</div>
			</div>
		</div>
	)
}

const TestStepsList: React.FC<TestStepsListProps> = ({
	steps,
	onReorder,
	onEdit,
	onDelete,
}) => {
	// Helper function to get action display text
	const getActionDisplay = (action: string): string => {
		switch (action) {
			case 'navigate':
				return 'Navigate to'
			case 'click':
				return 'Click'
			case 'fill':
				return 'Fill'
			case 'assert':
				return 'Assert'
			case 'wait':
				return 'Wait for'
			case 'hover':
				return 'Hover over'
			default:
				return action
		}
	}

	// Set up sensors for drag and drop
	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 8, // 8px movement required before drag starts
			},
		}),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		})
	)

	// Handle drag end event
	const handleDragEnd = (event: DragEndEvent) => {
		const {active, over} = event

		if (over && active.id !== over.id) {
			const oldIndex = steps.findIndex((step) => step.id === active.id)
			const newIndex = steps.findIndex((step) => step.id === over.id)

			// Create new array with the item moved to the new position
			const newSteps = arrayMove(steps, oldIndex, newIndex)

			// Update the order property for each step
			const updatedSteps = newSteps.map((step, idx) => ({
				...step,
				order: idx + 1,
			}))

			// Call the onReorder callback with the updated steps
			onReorder(updatedSteps)
		}
	}

	return (
		<div>
			{steps.length === 0 ? (
				<p className='text-gray-500 text-center py-4'>
					No test steps added yet.
				</p>
			) : (
				<DndContext
					sensors={sensors}
					collisionDetection={closestCenter}
					onDragEnd={handleDragEnd}
				>
					<SortableContext
						items={steps.map((step) => step.id)}
						strategy={verticalListSortingStrategy}
					>
						<div className='space-y-2'>
							{steps.map((step) => (
								<SortableItem
									key={step.id}
									id={step.id}
									step={step}
									onEdit={onEdit}
									onDelete={onDelete}
									getActionDisplay={getActionDisplay}
								/>
							))}
						</div>
					</SortableContext>
				</DndContext>
			)}
		</div>
	)
}

export default TestStepsList
