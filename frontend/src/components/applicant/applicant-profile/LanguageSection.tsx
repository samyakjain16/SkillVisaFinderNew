// components/applicant-profile/LanguageSection.tsx
import { Languages } from 'lucide-react';
import { CollapsibleSection } from './CollapsibleSection';

interface LanguageSectionProps {
  language?: string;
  onEdit?: () => void;
}

export const LanguageSection = ({ language, onEdit }: LanguageSectionProps) => {
  return (
    <CollapsibleSection 
      title="English Language Ability" 
      icon={<Languages className="h-4 w-4 text-gray-400 mr-2" />}
      onEdit={onEdit}
    >
      <div className="text-sm text-gray-700">
        {language || 'No language details available'}
      </div>
    </CollapsibleSection>
  );
};