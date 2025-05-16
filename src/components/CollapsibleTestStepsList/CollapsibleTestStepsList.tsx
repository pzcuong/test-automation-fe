import React from 'react';
import { TestStep } from '@/types/common.types';
import { Button } from '@/components/ui';
import {
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface CollapsibleTestStepsListProps {
  steps: TestStep[];
  onReorder: (steps: TestStep[]) => void;
  onEdit: (step: TestStep) => void;
  onDelete: (stepId: string) => void;
  editingStepId: string | null;
}

interface SortableStepItemProps {
  id: string;
  step: TestStep;
  onEdit: (step: TestStep) => void;
  onDelete: (stepId: string) => void;
}

const SortableStepItem = ({ id, step, onEdit, onDelete }: SortableStepItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.8 : 1,
  };
  
  return (
    <div 
      ref={setNodeRef} 
      style={style}
      className={`p-3 border border-gray-200 rounded-md ${isDragging ? 'bg-blue-50 shadow-lg border-blue-200' : 'hover:bg-gray-50'}`}
    >
      <div className='flex items-center gap-3'>
        <div
          {...attributes}
          {...listeners}
          className='bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center font-medium text-gray-700 cursor-grab'
        >
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
            onClick={() => onEdit(step)}
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
            onClick={() => onDelete(step.id)}
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
  );
};

const CollapsibleTestStepsList: React.FC<CollapsibleTestStepsListProps> = ({
  steps,
  onReorder,
  onEdit,
  onDelete,
  editingStepId
}) => {
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
  );
  
  // Handle drag end event
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = steps.findIndex(step => step.id === active.id);
      const newIndex = steps.findIndex(step => step.id === over.id);
      
      // Create new array with the item moved to the new position
      const newSteps = arrayMove(steps, oldIndex, newIndex);
      
      // Update the order property for each step
      const updatedSteps = newSteps.map((step, idx) => ({
        ...step,
        order: idx + 1,
      }));
      
      // Call the onReorder callback with the updated steps
      onReorder(updatedSteps);
    }
  };

  return (
    <div className='space-y-3'>
      {steps.length === 0 ? (
        <div className='text-center py-6 bg-gray-50 rounded-md'>
          <p className='text-gray-500'>No steps added yet</p>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={steps.map(step => step.id)}
            strategy={verticalListSortingStrategy}
          >
            {steps
              .sort((a, b) => a.order - b.order)
              .map((step) => (
                <React.Fragment key={step.id}>
                  <SortableStepItem
                    id={step.id}
                    step={step}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                  
                  {/* Edit form appears directly below the step being edited */}
                  {editingStepId === step.id && (
                    <div className='mt-1 mb-3 p-4 border border-gray-200 rounded-md bg-gray-50'>
                      {/* The actual form will be rendered by the parent component */}
                    </div>
                  )}
                </React.Fragment>
              ))}
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
};

export default CollapsibleTestStepsList;
