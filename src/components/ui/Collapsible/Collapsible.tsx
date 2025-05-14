import React, { useState } from 'react';
import { cn } from '@/utils/cn';

interface CollapsibleProps {
  title: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
}

const Collapsible: React.FC<CollapsibleProps> = ({
  title,
  children,
  defaultOpen = false,
  className = '',
  headerClassName = '',
  contentClassName = '',
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={cn('border border-gray-200 rounded-lg overflow-hidden', className)}>
      <button
        type="button"
        className={cn(
          'flex justify-between items-center w-full px-4 py-3 bg-white hover:bg-gray-50 text-left',
          isOpen && 'border-b border-gray-200',
          headerClassName
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="font-medium">{title}</div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={cn('h-5 w-5 text-gray-500 transition-transform', isOpen && 'transform rotate-180')}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div
        className={cn(
          'transition-all duration-200 ease-in-out',
          isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden',
          contentClassName
        )}
      >
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};

export default Collapsible;
