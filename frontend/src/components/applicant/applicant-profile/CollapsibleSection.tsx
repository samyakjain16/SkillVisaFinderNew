// components/applicant-profile/CollapsibleSection.tsx
'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Edit } from 'lucide-react';

interface CollapsibleSectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  onEdit?: () => void;
}

export const CollapsibleSection = ({ title, icon, children, onEdit }: CollapsibleSectionProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="border-t border-gray-100 pt-2">
      <div className="flex flex-col">
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center text-sm">
            {icon}
            <span className="text-gray-700 font-medium">{title}</span>
          </div>
          {onEdit && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="cursor-pointer"
            >
              <Edit className="h-4 w-4 text-gray-400 hover:text-indigo-500" />
            </button>
          )}
        </div>
        <div 
          className="flex justify-center cursor-pointer py-1"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? (
            <ChevronUp className="h-4 w-4 text-gray-400" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-400" />
          )}
        </div>
        {isExpanded && (
          <div className="py-2">
            {children}
          </div>
        )}
      </div>
    </div>
  );
};