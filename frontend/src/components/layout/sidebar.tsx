'use client';

import { useState } from 'react';
import Link from 'next/link';
import { X, FileText, Users, Settings, ChevronDown, ChevronUp, User } from 'lucide-react';
import FileUploader from '@/components/documents/file-uploader';
import OccupationList from '@/components/occupations/occupation-list';

import ApplicantProfileSidebar from '@/components/applicant/applicant-profile-sidebar';


interface OccupationMatch {
  anzsco_code: string;
  occupation_name: string;
  list?: string;
  visa_subclasses?: string;
  assessing_authority?: string;
  confidence_score: number;
  suggested_occupation: string;
}

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  occupations: OccupationMatch[];
  setOccupations: (occupations: OccupationMatch[]) => void;
  loadingOccupations: boolean;
  setLoadingOccupations: (loading: boolean) => void;
}

interface CollapsibleSectionProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

const CollapsibleSection = ({ title, isOpen, onToggle, children }: CollapsibleSectionProps) => (
  <div className="mt-6">
    <div 
      className="flex items-center justify-between cursor-pointer mb-3"
      onClick={onToggle}
    >
      <h3 className="text-sm font-medium uppercase tracking-wider text-gray-500">
        {title}
      </h3>
      {isOpen ? <ChevronUp className="h-4 w-4 text-gray-500" /> : <ChevronDown className="h-4 w-4 text-gray-500" />}
    </div>
    {isOpen && (
      <div className="rounded-xl p-4 shadow-sm border border-gray-100 bg-white">
        {children}
      </div>
    )}
  </div>
);

export default function Sidebar({
  sidebarOpen,
  setSidebarOpen,
  occupations,
  setOccupations,
  loadingOccupations,
  setLoadingOccupations
}: SidebarProps) {
  // State for collapsible sections
  const [sectionsState, setSectionsState] = useState({
    occupations: true, // Open by default
    profile: false
  });

  const toggleSection = (section: keyof typeof sectionsState) => {
    setSectionsState(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <aside className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-30 w-72 bg-white shadow-xl transition-transform duration-300 ease-in-out md:relative md:translate-x-0`}>
      <div className="flex h-full flex-col overflow-y-auto border-r border-gray-100 bg-white py-8 px-5">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-indigo-700">Skill Visa Finder</h2>
          <button 
            className="md:hidden rounded-md p-2 text-gray-500 hover:bg-gray-100"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        {/* CV Upload Section */}
        <div className="mt-6">
          <h3 className="mb-3 text-sm font-medium uppercase tracking-wider text-gray-500">
            Start Assessment
          </h3>
          <div className="rounded-xl p-4 shadow-sm border border-gray-100 bg-white">
            <FileUploader 
              setOccupations={setOccupations}
              setLoading={setLoadingOccupations}
            />
          </div>
        </div>

        {/* Suggested Occupations Section */}
        <CollapsibleSection 
          title="Suggested Occupations"
          isOpen={sectionsState.occupations}
          onToggle={() => toggleSection('occupations')}
        >
          <OccupationList 
            occupations={occupations}
            loading={loadingOccupations}
          />
        </CollapsibleSection>

        {/* Applicant's Profile Section */}
        <CollapsibleSection 
          title="Applicant's Profile"
          isOpen={sectionsState.profile}
          onToggle={() => toggleSection('profile')}
        >
          <ApplicantProfileSidebar />
        </CollapsibleSection>
       
        {/* Navigation */}
        <nav className="mt-auto pt-6 border-t border-gray-100">
          <h3 className="mb-3 text-sm font-medium uppercase tracking-wider text-gray-500">
            Navigation
          </h3>
          <ul className="space-y-2">
            <li>
              <Link 
                href="/dashboard/assessment" 
                className="flex items-center text-gray-700 hover:text-indigo-600 py-2 px-3 rounded-lg hover:bg-indigo-50 transition-colors"
              >
                <FileText className="mr-3 h-5 w-5 text-gray-400" />
                Assessments
              </Link>
            </li>
            <li>
              <Link 
                href="/dashboard/clients" 
                className="flex items-center text-gray-700 hover:text-indigo-600 py-2 px-3 rounded-lg hover:bg-indigo-50 transition-colors"
              >
                <Users className="mr-3 h-5 w-5 text-gray-400" />
                Clients
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </aside>
  );
}