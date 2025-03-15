// src/components/visa-assessment/assessment-form.tsx
'use client';

import { useState } from 'react';
import AgeForm from './form-sections/age-form';
import EnglishForm from './form-sections/english-form';
import EducationForm from './form-sections/education-form';
import ExperienceForm from './form-sections/experience-form';
import OtherFactorsForm from './form-sections/other-factors-form';
import { ChevronDown, ChevronUp } from "lucide-react";

// Define types for assessment and form data
interface Assessment {
  age_value?: number;
  age_points?: number;
  english_level?: string;
  english_test?: string;
  english_points?: number;
  education_level?: string;
  education_field?: string;
  education_points?: number;
  experience_overseas_years?: number;
  experience_australia_years?: number;
  experience_points?: number;
  australian_study?: boolean;
  australian_study_points?: number;
  specialist_education?: boolean;
  specialist_education_points?: number;
  partner_skills_points?: number;
  community_language_points?: number;
  regional_study_points?: number;
  professional_year_points?: number;
}

interface FormData {
  age_value?: number;
  english_level?: string;
  english_test?: string;
  education_level?: string;
  education_field?: string;
  experience_overseas_years?: number;
  experience_australia_years?: number;
  australian_study: boolean;
  specialist_education: boolean;
  partner_skills_points: number;
  community_language_points: number;
  regional_study_points: number;
  professional_year_points: number;
}

interface AssessmentFormProps {
  assessment: Assessment;
  onSave: (formData: FormData) => Promise<void>;
  isSaving: boolean;
}

export default function AssessmentForm({ assessment, onSave, isSaving }: AssessmentFormProps) {
  const [formData, setFormData] = useState<FormData>({
    age_value: assessment.age_value,
    english_level: assessment.english_level,
    english_test: assessment.english_test,
    education_level: assessment.education_level,
    education_field: assessment.education_field,
    experience_overseas_years: assessment.experience_overseas_years,
    experience_australia_years: assessment.experience_australia_years,
    australian_study: assessment.australian_study || false,
    specialist_education: assessment.specialist_education || false,
    partner_skills_points: assessment.partner_skills_points || 0,
    community_language_points: assessment.community_language_points || 0,
    regional_study_points: assessment.regional_study_points || 0,
    professional_year_points: assessment.professional_year_points || 0,
  });

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    age: false,
    english: false,
    education: false,
    experience: false,
    otherFactors: false,
  });
  


  const handleChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };
  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg overflow-hidden">
      <div className="p-6 border-b">
        <h2 className="text-lg font-medium">Assessment Details</h2>
        <p className="text-gray-500 mt-1">
          Update the applicant's details to recalculate eligibility
        </p>
      </div>

      <div className="p-6 space-y-6">
        {/* Age Section */}
        <div>
          <div 
            className="flex justify-between items-center cursor-pointer"
            onClick={() => toggleSection("age")}
          >
            <h3 className="text-md font-medium">Age</h3>
            {expandedSections.age ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </div>
          {expandedSections.age && (
            <div className="mt-4">
              <AgeForm 
                value={formData.age_value} 
                onChange={(value) => handleChange("age_value", value)} 
                points={assessment.age_points}
              />
            </div>
          )}
        </div>

        {/* English Section */}
        <div>
          <div 
            className="flex justify-between items-center cursor-pointer"
            onClick={() => toggleSection("english")}
          >
            <h3 className="text-md font-medium">English Language</h3>
            {expandedSections.english ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </div>
          {expandedSections.english && (
            <div className="mt-4">
              <EnglishForm 
                level={formData.english_level}
                test={formData.english_test}
                onLevelChange={(value) => handleChange("english_level", value)}
                onTestChange={(value) => handleChange("english_test", value)}
                points={assessment.english_points}
              />
            </div>
          )}
        </div>

        {/* Education Section */}
        <div>
          <div 
            className="flex justify-between items-center cursor-pointer"
            onClick={() => toggleSection("education")}
          >
            <h3 className="text-md font-medium">Education</h3>
            {expandedSections.education ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </div>
          {expandedSections.education && (
            <div className="mt-4">
              <EducationForm 
                level={formData.education_level}
                field={formData.education_field}
                onLevelChange={(value) => handleChange("education_level", value)}
                onFieldChange={(value) => handleChange("education_field", value)}
                points={assessment.education_points}
              />
            </div>
          )}
        </div>

        {/* Work Experience Section */}
        <div>
          <div 
            className="flex justify-between items-center cursor-pointer"
            onClick={() => toggleSection("experience")}
          >
            <h3 className="text-md font-medium">Work Experience</h3>
            {expandedSections.experience ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </div>
          {expandedSections.experience && (
            <div className="mt-4">
              <ExperienceForm 
                overseasYears={formData.experience_overseas_years}
                australiaYears={formData.experience_australia_years}
                onOverseasChange={(value) => handleChange("experience_overseas_years", value)}
                onAustraliaChange={(value) => handleChange("experience_australia_years", value)}
                points={assessment.experience_points}
              />
            </div>
          )}
        </div>

        {/* Other Factors Section */}
        <div>
          <div 
            className="flex justify-between items-center cursor-pointer"
            onClick={() => toggleSection("otherFactors")}
          >
            <h3 className="text-md font-medium">Other Factors</h3>
            {expandedSections.otherFactors ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </div>
          {expandedSections.otherFactors && (
            <div className="mt-4">
              <OtherFactorsForm 
                formData={formData}
                onChange={handleChange}
              />
            </div>
          )}
        </div>
      </div>

      <div className="p-6 bg-gray-50 border-t flex justify-end">
        <button
          type="submit"
          disabled={isSaving}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
        >
          {isSaving ? "Saving..." : "Save and Recalculate"}
        </button>
      </div>
    </form>
  );
}