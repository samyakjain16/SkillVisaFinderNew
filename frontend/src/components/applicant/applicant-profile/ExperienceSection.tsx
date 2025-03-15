'use client';

import { useState } from 'react';
import { Briefcase, Plus, Trash2, Calendar } from 'lucide-react';
import { CollapsibleSection } from './CollapsibleSection';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface JobResponsibility {
  id: string;
  text: string;
}

interface Employment {
  id: string;
  employerName: string;
  country: string;
  jobTitle: string;
  startDate: string;
  endDate: string;
  responsibilities: JobResponsibility[];
}

interface ExperienceSectionProps {
  experienceList?: Employment[];
  onUpdate?: (data: Employment[]) => void;
}

export const ExperienceSection = ({ experienceList = [], onUpdate }: ExperienceSectionProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Employment[]>(experienceList.length > 0 ? experienceList : []);

  const handleAddEmployment = () => {
    const newEmployment: Employment = {
      id: Date.now().toString(),
      employerName: '',
      country: '',
      jobTitle: '',
      startDate: '',
      endDate: '',
      responsibilities: Array(5).fill(null).map((_, index) => ({
        id: `resp-${Date.now()}-${index}`,
        text: ''
      }))
    };
    setFormData([...formData, newEmployment]);
  };

  const handleRemoveEmployment = (id: string) => {
    setFormData(formData.filter(job => job.id !== id));
  };

  const handleChange = (jobId: string, field: keyof Omit<Employment, 'responsibilities'>, value: string) => {
    setFormData(formData.map(job => 
      job.id === jobId ? { ...job, [field]: value } : job
    ));
  };

  const handleResponsibilityChange = (jobId: string, respId: string, value: string) => {
    setFormData(formData.map(job => {
      if (job.id !== jobId) return job;
      
      return {
        ...job,
        responsibilities: job.responsibilities.map(resp => 
          resp.id === respId ? { ...resp, text: value } : resp
        )
      };
    }));
  };

  const handleAddResponsibility = (jobId: string) => {
    setFormData(formData.map(job => {
      if (job.id !== jobId) return job;
      
      return {
        ...job,
        responsibilities: [
          ...job.responsibilities,
          {
            id: `resp-${Date.now()}-${job.responsibilities.length}`,
            text: ''
          }
        ]
      };
    }));
  };

  const handleRemoveResponsibility = (jobId: string, respId: string) => {
    setFormData(formData.map(job => {
      if (job.id !== jobId) return job;
      
      return {
        ...job,
        responsibilities: job.responsibilities.filter(resp => resp.id !== respId)
      };
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate?.(formData);
    setIsEditing(false);
  };

  const formatDateRange = (startDate: string, endDate: string) => {
    if (!startDate && !endDate) return '';
    
    const formatDate = (dateStr: string) => {
      if (!dateStr) return 'Present';
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    };
    
    return `${formatDate(startDate)} - ${formatDate(endDate)}`;
  };

  const formatExperience = (job: Employment) => {
    const parts = [];
    if (job.jobTitle) parts.push(job.jobTitle);
    if (job.employerName) parts.push(`at ${job.employerName}`);
    if (job.country) parts.push(`(${job.country})`);
    if (job.startDate || job.endDate) {
      parts.push(`| ${formatDateRange(job.startDate, job.endDate)}`);
    }
    return parts.join(' ') || 'No details provided';
  };

  return (
    <>
      <CollapsibleSection 
        title="Work Experience" 
        icon={<Briefcase className="h-4 w-4 text-gray-400 mr-2" />}
        onEdit={() => setIsEditing(true)}
      >
        <div className="space-y-3">
          {formData.length > 0 ? (
            formData.map((job) => (
              <div key={job.id} className="text-sm text-gray-700 pb-2 border-b border-gray-100 last:border-0">
                <div className="font-medium">{formatExperience(job)}</div>
                {job.responsibilities.some(r => r.text) && (
                  <ul className="mt-1 ml-4 list-disc text-xs text-gray-600">
                    {job.responsibilities.filter(r => r.text).slice(0, 2).map((resp) => (
                      <li key={resp.id}>{resp.text}</li>
                    ))}
                    {job.responsibilities.filter(r => r.text).length > 2 && (
                      <li>+ {job.responsibilities.filter(r => r.text).length - 2} more responsibilities</li>
                    )}
                  </ul>
                )}
              </div>
            ))
          ) : (
            <div className="text-sm text-gray-700">No work experience details available</div>
          )}
        </div>
      </CollapsibleSection>

      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="max-w-3xl bg-white rounded-xl shadow-xl p-0 overflow-hidden max-h-[90vh] flex flex-col">
          <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-6 flex-shrink-0">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-white flex items-center">
                <Briefcase className="h-5 w-5 mr-2" />
                Work Experience
              </DialogTitle>
              <p className="text-amber-50 text-sm mt-1">
                Add your employment history for the last 10-12 years
              </p>
            </DialogHeader>
          </div>
          
          <form id="experienceForm" onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-grow">
            <div className="mb-6">
              <div className="text-sm text-gray-500 mb-4">
                Number of Jobs: {formData.length}
              </div>
              
              {formData.map((job, jobIndex) => (
                <div key={job.id} className="mb-8 p-6 bg-gray-50 rounded-xl border border-gray-100 relative">
                  <h3 className="text-md font-medium text-gray-800 mb-4 flex items-center">
                    <span className="flex h-6 w-6 rounded-full bg-amber-500 text-white items-center justify-center text-xs mr-2">
                      {jobIndex + 1}
                    </span>
                    Employment {jobIndex + 1}
                    <button 
                      type="button" 
                      onClick={() => handleRemoveEmployment(job.id)} 
                      className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-200 transition-colors"
                      aria-label="Remove employment"
                    >
                      <Trash2 className="h-4 w-4 text-gray-500" />
                    </button>
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Name of Employer
                      </label>
                      <input
                        type="text"
                        value={job.employerName}
                        onChange={(e) => handleChange(job.id, 'employerName', e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
                        placeholder="e.g., Acme Corporation"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Country of Employment
                      </label>
                      <input
                        type="text"
                        value={job.country}
                        onChange={(e) => handleChange(job.id, 'country', e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
                        placeholder="e.g., United States"
                      />
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Job Title
                    </label>
                    <input
                      type="text"
                      value={job.jobTitle}
                      onChange={(e) => handleChange(job.id, 'jobTitle', e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
                      placeholder="e.g., Senior Developer"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1 flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        Date of Commencement
                      </label>
                      <input
                        type="month"
                        value={job.startDate}
                        onChange={(e) => handleChange(job.id, 'startDate', e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1 flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        Date of Cessation
                      </label>
                      <input
                        type="month"
                        value={job.endDate}
                        onChange={(e) => handleChange(job.id, 'endDate', e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
                      />
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Job Responsibilities (at least 5)
                    </label>
                    <div className="space-y-3">
                      {job.responsibilities.map((resp, respIndex) => (
                        <div key={resp.id} className="flex items-start">
                          <span className="text-xs font-medium text-gray-500 mt-2 mr-2">{respIndex + 1}.</span>
                          <input
                            type="text"
                            value={resp.text}
                            onChange={(e) => handleResponsibilityChange(job.id, resp.id, e.target.value)}
                            className="flex-grow px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
                            placeholder={`Responsibility ${respIndex + 1}`}
                          />
                          {job.responsibilities.length > 5 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveResponsibility(job.id, resp.id)}
                              className="p-2 ml-2 text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    
                    <button
                      type="button"
                      onClick={() => handleAddResponsibility(job.id)}
                      className="mt-3 text-sm text-amber-600 hover:text-amber-700 flex items-center"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add Another Responsibility
                    </button>
                  </div>
                </div>
              ))}
              
              <button
                type="button"
                onClick={handleAddEmployment}
                className="w-full py-3 mt-2 text-sm font-medium text-amber-700 border border-dashed border-amber-300 bg-amber-50 rounded-lg hover:bg-amber-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition flex items-center justify-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Another Job
              </button>
            </div>
          </form>
          
          <div className="flex justify-end space-x-4 p-6 pt-4 border-t border-gray-100 flex-shrink-0 bg-white">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-5 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="experienceForm"
              className="px-5 py-2 text-sm font-medium text-white bg-gradient-to-r from-amber-500 to-orange-600 border border-transparent rounded-lg hover:from-amber-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-all"
            >
              Save Changes
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};