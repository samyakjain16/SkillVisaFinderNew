// src/components/applicant/applicant-details-form.tsx
'use client';

import { useState, useEffect } from 'react';
import { useClient } from '@/lib/context/client-context';
import { api } from '@/lib/api';
import { User, Briefcase, BookOpen, GraduationCap, Languages, Plus, Trash2 } from 'lucide-react';
import { ApplicantDetails } from '@/types';

type ApplicantDetailsFormProps = {
  documentId?: string;
  onSave?: (data: ApplicantDetails) => void;
};

export default function ApplicantDetailsForm({ documentId, onSave }: ApplicantDetailsFormProps) {
  const { selectedClient } = useClient();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Initialize with client data if available
  const [formData, setFormData] = useState<ApplicantDetails>({
    full_name: selectedClient?.full_name || '',
    email: selectedClient?.email || '',
    phone: selectedClient?.phone || '',
    date_of_birth: selectedClient?.date_of_birth || '',
    nationality: selectedClient?.nationality || '',
    passport_number: selectedClient?.passport_number || '',
    education: [{ level: '', field: '', institution: '', country: '', start_date: '', end_date: '' }],
    experience: [{ title: '', company: '', country: '', start_date: '', end_date: '', duration_years: 0 }],
    english: {
      level: '',
      test: '',
      scores: { overall: 0, reading: 0, writing: 0, speaking: 0, listening: 0 }
    }
  });

  // If we have a document ID, try to load extracted data
  useEffect(() => {
    if (documentId) {
      extractApplicantData();
    }
  }, [documentId]);

  const extractApplicantData = async () => {
    if (!documentId) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Call backend to get extracted data from CV
      const data = await api.request(`/documents/${documentId}/extract-applicant-data`);
      
      const isApplicantDetails = (obj: unknown): obj is ApplicantDetails => {
        return (
          typeof obj === 'object' &&
          obj !== null &&
          'full_name' in obj &&
          'email' in obj &&
          'phone' in obj
        );
      };
      
      const mergedData: ApplicantDetails = {
        ...formData,
        ...(isApplicantDetails(data) ? data : {}), // Only spread if it's valid
        full_name: isApplicantDetails(data) ? data.full_name : selectedClient?.full_name || '',
        email: isApplicantDetails(data) ? data.email : selectedClient?.email || '',
        phone: isApplicantDetails(data) ? data.phone : selectedClient?.phone || '',
        date_of_birth: isApplicantDetails(data) ? data.date_of_birth : selectedClient?.date_of_birth || '',
        nationality: isApplicantDetails(data) ? data.nationality : selectedClient?.nationality || '',
        passport_number: isApplicantDetails(data) ? data.passport_number : selectedClient?.passport_number || '',
      };
      
      
      setFormData(mergedData);
    } catch (err: any) {
      console.error('Error extracting applicant data:', err);
      setError('Failed to extract data from document. Please fill in manually.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newData = { ...prev };
      // Handle nested fields with dot notation (e.g. "english.level")
      if (name.includes('.')) {
        const [field, subfield] = name.split('.');
        if (field === 'english') {
          newData.english = { 
            ...newData.english, 
            [subfield]: value 
          };
        }
      } else {
        // Type assertion for dynamic property access
        (newData as any)[name] = value;
      }
      return newData;
    });
  };

  const handleEducationChange = (index: number, field: string, value: string) => {
    setFormData((prev) => {
      const newEducation = [...prev.education];
      newEducation[index] = { ...newEducation[index], [field]: value };
      return { ...prev, education: newEducation };
    });
  };

  const handleExperienceChange = (index: number, field: string, value: string | number) => {
    setFormData((prev) => {
      const newExperience = [...prev.experience];
      newExperience[index] = { ...newExperience[index], [field]: value };
      return { ...prev, experience: newExperience };
    });
  };

  const handleEnglishScoreChange = (field: string, value: string) => {
    const numValue = value === '' ? undefined : parseFloat(value);
    setFormData((prev) => {
      return {
        ...prev,
        english: {
          ...prev.english,
          scores: {
            ...prev.english.scores,
            [field]: numValue
          }
        }
      };
    });
  };

  const addEducation = () => {
    setFormData((prev) => ({
      ...prev,
      education: [...prev.education, { level: '', field: '', institution: '', country: '', start_date: '', end_date: '' }]
    }));
  };

  const removeEducation = (index: number) => {
    setFormData((prev) => {
      const newEducation = [...prev.education];
      newEducation.splice(index, 1);
      return { ...prev, education: newEducation.length ? newEducation : [{ level: '', field: '', institution: '', country: '', start_date: '', end_date: '' }] };
    });
  };

  const addExperience = () => {
    setFormData((prev) => ({
      ...prev,
      experience: [...prev.experience, { title: '', company: '', country: '', start_date: '', end_date: '', duration_years: 0 }]
    }));
  };

  const removeExperience = (index: number) => {
    setFormData((prev) => {
      const newExperience = [...prev.experience];
      newExperience.splice(index, 1);
      return { ...prev, experience: newExperience.length ? newExperience : [{ title: '', company: '', country: '', start_date: '', end_date: '', duration_years: 0 }] };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSaving(true);
      setError(null);
      
      // For now, just call the onSave callback
      // In a real implementation, you would also save to the backend
      if (onSave) {
        onSave(formData);
      }
      
    } catch (err: any) {
      console.error('Error saving applicant data:', err);
      setError('Failed to save applicant data. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-sm">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 bg-white p-6 rounded-lg shadow-sm">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}
      
      {/* Personal Details Section */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <User className="h-5 w-5 text-indigo-500" />
          <h2 className="text-lg font-medium">Personal Details</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              id="full_name"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email || ''}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Phone
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone || ''}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          
          <div>
            <label htmlFor="date_of_birth" className="block text-sm font-medium text-gray-700">
              Date of Birth
            </label>
            <input
              type="date"
              id="date_of_birth"
              name="date_of_birth"
              value={formData.date_of_birth || ''}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          
          <div>
            <label htmlFor="nationality" className="block text-sm font-medium text-gray-700">
              Nationality
            </label>
            <input
              type="text"
              id="nationality"
              name="nationality"
              value={formData.nationality || ''}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          
          <div>
            <label htmlFor="passport_number" className="block text-sm font-medium text-gray-700">
              Passport Number
            </label>
            <input
              type="text"
              id="passport_number"
              name="passport_number"
              value={formData.passport_number || ''}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
        </div>
      </div>
      
      {/* Education Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-indigo-500" />
            <h2 className="text-lg font-medium">Education</h2>
          </div>
          <button
            type="button"
            onClick={addEducation}
            className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Education
          </button>
        </div>
        
        {formData.education.map((edu, index) => (
          <div key={index} className="border border-gray-200 rounded-md p-4 mb-4">
            <div className="flex justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-700">Education #{index + 1}</h3>
              {formData.education.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeEducation(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Level
                </label>
                <select
                  value={edu.level || ''}
                  onChange={(e) => handleEducationChange(index, 'level', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="">Select level</option>
                  <option value="phd">PhD</option>
                  <option value="masters">Masters</option>
                  <option value="bachelors">Bachelors</option>
                  <option value="diploma">Diploma</option>
                  <option value="trade">Trade Qualification</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Field of Study
                </label>
                <input
                  type="text"
                  value={edu.field || ''}
                  onChange={(e) => handleEducationChange(index, 'field', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Institution
                </label>
                <input
                  type="text"
                  value={edu.institution || ''}
                  onChange={(e) => handleEducationChange(index, 'institution', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Country
                </label>
                <input
                  type="text"
                  value={edu.country || ''}
                  onChange={(e) => handleEducationChange(index, 'country', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Start Date
                </label>
                <input
                  type="month"
                  value={edu.start_date || ''}
                  onChange={(e) => handleEducationChange(index, 'start_date', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  End Date
                </label>
                <input
                  type="month"
                  value={edu.end_date || ''}
                  onChange={(e) => handleEducationChange(index, 'end_date', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Work Experience Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-indigo-500" />
            <h2 className="text-lg font-medium">Work Experience</h2>
          </div>
          <button
            type="button"
            onClick={addExperience}
            className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Experience
          </button>
        </div>
        
        {formData.experience.map((exp, index) => (
          <div key={index} className="border border-gray-200 rounded-md p-4 mb-4">
            <div className="flex justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-700">Experience #{index + 1}</h3>
              {formData.experience.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeExperience(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Job Title
                </label>
                <input
                  type="text"
                  value={exp.title || ''}
                  onChange={(e) => handleExperienceChange(index, 'title', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Company/Organization
                </label>
                <input
                  type="text"
                  value={exp.company || ''}
                  onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Country
                </label>
                <input
                  type="text"
                  value={exp.country || ''}
                  onChange={(e) => handleExperienceChange(index, 'country', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Start Date
                </label>
                <input
                  type="month"
                  value={exp.start_date || ''}
                  onChange={(e) => handleExperienceChange(index, 'start_date', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  End Date
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="month"
                    value={exp.end_date === 'present' ? '' : (exp.end_date || '')}
                    onChange={(e) => handleExperienceChange(index, 'end_date', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    disabled={exp.end_date === 'present'}
                  />
                </div>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id={`current-job-${index}`}
                  checked={exp.end_date === 'present'}
                  onChange={(e) => {
                    handleExperienceChange(index, 'end_date', e.target.checked ? 'present' : '');
                  }}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor={`current-job-${index}`} className="ml-2 block text-sm text-gray-700">
                  Current Job
                </label>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* English Proficiency Section */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Languages className="h-5 w-5 text-indigo-500" />
          <h2 className="text-lg font-medium">English Language Proficiency</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Proficiency Level
            </label>
            <select
              value={formData.english.level || ''}
              onChange={(e) => handleChange({ target: { name: 'english.level', value: e.target.value } } as React.ChangeEvent<HTMLSelectElement>)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">Select level</option>
              <option value="competent">Competent (IELTS 6 / PTE 50)</option>
              <option value="proficient">Proficient (IELTS 7 / PTE 65)</option>
              <option value="superior">Superior (IELTS 8 / PTE 79)</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Test Type
            </label>
            <select
              value={formData.english.test || ''}
              onChange={(e) => handleChange({ target: { name: 'english.test', value: e.target.value } } as React.ChangeEvent<HTMLSelectElement>)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">Select test</option>
              <option value="IELTS">IELTS</option>
              <option value="PTE">PTE Academic</option>
              <option value="TOEFL">TOEFL iBT</option>
              <option value="CAE">Cambridge C1/C2</option>
            </select>
          </div>
        </div>
        
        <div className="border border-gray-200 rounded-md p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Test Scores</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Overall
              </label>
              <input
                type="number"
                step="0.5"
                min="0"
                max="9"
                value={formData.english.scores?.overall || ''}
                onChange={(e) => handleEnglishScoreChange('overall', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Reading
              </label>
              <input
                type="number"
                step="0.5"
                min="0"
                max="9"
                value={formData.english.scores?.reading || ''}
                onChange={(e) => handleEnglishScoreChange('reading', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Writing
              </label>
              <input
                type="number"
                step="0.5"
                min="0"
                max="9"
                value={formData.english.scores?.writing || ''}
                onChange={(e) => handleEnglishScoreChange('writing', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Speaking
              </label>
              <input
                type="number"
                step="0.5"
                min="0"
                max="9"
                value={formData.english.scores?.speaking || ''}
                onChange={(e) => handleEnglishScoreChange('speaking', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Listening
              </label>
              <input
                type="number"
                step="0.5"
                min="0"
                max="9"
                value={formData.english.scores?.listening || ''}
                onChange={(e) => handleEnglishScoreChange('listening', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end mt-8">
        <button
          type="submit"
          disabled={isSaving}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
        >
          {isSaving ? 'Saving...' : 'Save Applicant Details'}
        </button>
      </div>
    </form>
  );
}