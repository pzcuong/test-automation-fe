import React, { useState, useEffect } from 'react';
import { Button, Input, Select } from '@/components/ui';
import { TestStep } from '@/types/common.types';

interface TestStepFormProps {
  step?: TestStep;
  onSubmit: (step: Omit<TestStep, 'id' | 'testCaseId'>) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const TestStepForm: React.FC<TestStepFormProps> = ({
  step,
  onSubmit,
  onCancel,
  isSubmitting = false,
}) => {
  const [action, setAction] = useState('navigate');
  const [selector, setSelector] = useState('');
  const [value, setValue] = useState('');
  const [expectedOutcome, setExpectedOutcome] = useState('');
  const [order, setOrder] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (step) {
      setAction(step.action);
      setSelector(step.selector);
      setValue(step.value || '');
      setExpectedOutcome(step.expectedOutcome || '');
      setOrder(step.order);
    }
  }, [step]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!action) {
      newErrors.action = 'Action is required';
    }

    if (!selector) {
      newErrors.selector = 'Selector is required';
    }

    if (action === 'fill' && !value) {
      newErrors.value = 'Value is required for fill action';
    }

    if (action === 'assert' && !expectedOutcome) {
      newErrors.expectedOutcome = 'Expected outcome is required for assert action';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    onSubmit({
      action,
      selector,
      value: value || undefined,
      expectedOutcome: expectedOutcome || undefined,
      order,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          id="step-action"
          label="Action"
          value={action}
          onChange={(value) => setAction(value)}
          options={[
            { label: 'Navigate', value: 'navigate' },
            { label: 'Click', value: 'click' },
            { label: 'Fill', value: 'fill' },
            { label: 'Assert', value: 'assert' },
            { label: 'Wait', value: 'wait' },
            { label: 'Hover', value: 'hover' },
          ]}
          error={errors.action}
          required
        />

        <Input
          id="step-order"
          label="Order"
          type="number"
          value={order.toString()}
          onChange={(e) => setOrder(parseInt(e.target.value) || 1)}
          required
        />
      </div>

      <Input
        id="step-selector"
        label="Selector"
        placeholder={action === 'navigate' ? 'https://example.com' : '#element-id or .class-name'}
        value={selector}
        onChange={(e) => setSelector(e.target.value)}
        error={errors.selector}
        required
      />

      {(action === 'fill' || action === 'assert') && (
        <Input
          id="step-value"
          label={action === 'fill' ? 'Value' : 'Expected Outcome'}
          placeholder={action === 'fill' ? 'Text to enter' : 'Expected text or condition'}
          value={action === 'fill' ? value : expectedOutcome}
          onChange={(e) => 
            action === 'fill' 
              ? setValue(e.target.value) 
              : setExpectedOutcome(e.target.value)
          }
          error={action === 'fill' ? errors.value : errors.expectedOutcome}
          required={action === 'fill' || action === 'assert'}
        />
      )}

      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          isLoading={isSubmitting}
          disabled={isSubmitting}
        >
          {step ? 'Update Step' : 'Add Step'}
        </Button>
      </div>
    </form>
  );
};

export default TestStepForm;
