import React from 'react';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({ 
  id, 
  label, 
  error, 
  className = '',
  ...props 
}) => {
  return (
    <div className={`flex items-start ${className}`}>
      <div className="flex items-center h-5">
        <input
          id={id}
          type="checkbox"
          className={`h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 ${
            error ? 'border-red-300' : ''
          }`}
          {...props}
        />
      </div>
      
      {label && (
        <div className="ml-3 text-sm">
          <label htmlFor={id} className="font-medium text-gray-700">
            {label}
          </label>
          {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
      )}
    </div>
  );
};

export default Checkbox;
