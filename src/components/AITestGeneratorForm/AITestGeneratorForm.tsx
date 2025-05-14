import React, { useState } from 'react';
import { Button, TextArea } from '@/components/ui';

interface AITestGeneratorFormProps {
  onSubmit: (prompt: string) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const AITestGeneratorForm: React.FC<AITestGeneratorFormProps> = ({
  onSubmit,
  onCancel,
  isSubmitting = false,
}) => {
  const [prompt, setPrompt] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!prompt.trim()) {
      setError('Please enter a prompt for the AI');
      return;
    }

    onSubmit(prompt);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">
          How to write an effective prompt:
        </h3>
        <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
          <li>Be specific about what you want to test</li>
          <li>Include details about the application or feature</li>
          <li>Mention any specific scenarios or edge cases</li>
          <li>Specify expected behaviors or outcomes</li>
        </ul>
      </div>

      <TextArea
        id="ai-prompt"
        label="Prompt for AI Test Generation"
        placeholder="Example: Generate a test case for user login with valid credentials, checking that the user is redirected to the dashboard after successful login."
        value={prompt}
        onChange={(e) => {
          setPrompt(e.target.value);
          if (e.target.value.trim()) {
            setError('');
          }
        }}
        error={error}
        required
        rows={6}
      />

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
          Generate Test Case
        </Button>
      </div>
    </form>
  );
};

export default AITestGeneratorForm;
