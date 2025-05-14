import React from 'react';
import { CardProps } from '@/types/common.types';
import { cn } from '@/utils/cn';

const Card: React.FC<CardProps> = ({
  title,
  children,
  footer,
  className = '',
}) => {
  return (
    <div className={cn(
      "rounded-lg border border-gray-200 bg-white shadow-sm",
      className
    )}>
      {title && (
        <div className="border-b border-gray-200 px-4 py-3">
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        </div>
      )}
      <div className="p-4">{children}</div>
      {footer && (
        <div className="border-t border-gray-200 px-4 py-3 bg-gray-50 rounded-b-lg">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;
