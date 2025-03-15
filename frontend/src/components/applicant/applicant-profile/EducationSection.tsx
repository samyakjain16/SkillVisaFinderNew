'use client';

import { useState } from 'react';
import { GraduationCap, Plus, Trash2 } from 'lucide-react';
import { CollapsibleSection } from './CollapsibleSection';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Education {
  id: string;
  level: string;
  fieldOfStudy: string;
  institutionName: string;
  country: string;
  startDate: string;
  endDate: string;
}

interface EducationSectionProps {
  educationList?: Education[];
  onUpdate?: (data: Education[]) => void;
}

export const EducationSection = ({ educationList = [], onUpdate }: EducationSectionProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Education[]>(educationList.length > 0 ? educationList : []);

  const handleAddEducation = () => {
    const newEducation: Education = {
      id: Date.now().toString(),
      level: '',
      fieldOfStudy: '',
      institutionName: '',
      country: '',
      startDate: '',
      endDate: ''
    };
    setFormData([...formData, newEducation]);
  };

  const handleRemoveEducation = (id: string) => {
    setFormData(formData.filter(edu => edu.id !== id));
  };

  const handleChange = (id: string, field: keyof Education, value: string) => {
    setFormData(formData.map(edu => 
      edu.id === id ? { ...edu, [field]: value } : edu
    ));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate?.(formData);
    setIsEditing(false);
  };

  const formatEducation = (edu: Education) => {
    const parts = [];
    if (edu.level) parts.push(edu.level);
    if (edu.fieldOfStudy) parts.push(`in ${edu.fieldOfStudy}`);
    if (edu.institutionName) parts.push(`from ${edu.institutionName}`);
    if (edu.startDate && edu.endDate) {
      parts.push(`(${new Date(edu.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} - 
                  ${new Date(edu.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })})`);
    }
    return parts.join(' ') || 'No details provided';
  };

  return (
    <>
      <CollapsibleSection 
        title="Education Background" 
        icon={<GraduationCap className="h-4 w-4 text-gray-400 mr-2" />}
        onEdit={() => setIsEditing(true)}
      >
        <div className="space-y-3">
          {formData.length > 0 ? (
            formData.map((edu) => (
              <div key={edu.id} className="text-sm text-gray-700 pb-2 border-b border-gray-100 last:border-0">
                {formatEducation(edu)}
              </div>
            ))
          ) : (
            <div className="text-sm text-gray-700">No education details available</div>
          )}
        </div>
      </CollapsibleSection>

      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="max-w-3xl bg-white rounded-xl shadow-xl p-0 overflow-hidden max-h-[90vh] flex flex-col">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 flex-shrink-0">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-white flex items-center">
                <GraduationCap className="h-5 w-5 mr-2" />
                Education Background
              </DialogTitle>
              <p className="text-blue-100 text-sm mt-1">
                Add your educational qualifications after high school
              </p>
            </DialogHeader>
          </div>
          
          <form id="educationForm" onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-grow">
            <div className="mb-6">
              <div className="text-sm text-gray-500 mb-4">
                Number of Qualifications: {formData.length}
              </div>
              
              {formData.map((edu, index) => (
                <div key={edu.id} className="mb-8 p-6 bg-gray-50 rounded-xl border border-gray-100 relative">
                  <h3 className="text-md font-medium text-gray-800 mb-4">
                    Qualification {index + 1}
                    <button 
                      type="button" 
                      onClick={() => handleRemoveEducation(edu.id)} 
                      className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-200 transition-colors"
                      aria-label="Remove qualification"
                    >
                      <Trash2 className="h-4 w-4 text-gray-500" />
                    </button>
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-6 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Level of Education
                      </label>
                      <select
                        value={edu.level}
                        onChange={(e) => handleChange(edu.id, 'level', e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition appearance-none"
                        style={{ backgroundImage: "url('data:image/svg+xml;charset=US-ASCII,<svg width=\"20\" height=\"20\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z\" fill=\"%236B7280\"/></svg>')", backgroundPosition: "right 10px center", backgroundRepeat: "no-repeat", paddingRight: "2.5rem" }}
                      >
                        <option value="">Select level</option>
                        <option value="Certificate">Certificate</option>
                        <option value="Diploma">Diploma</option>
                        <option value="Associate's Degree">Associate's Degree</option>
                        <option value="Bachelor's Degree">Bachelor's Degree</option>
                        <option value="Master's Degree">Master's Degree</option>
                        <option value="Doctorate">Doctorate</option>
                        <option value="Post-Doctorate">Post-Doctorate</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Field of Study
                      </label>
                      <input
                        type="text"
                        value={edu.fieldOfStudy}
                        onChange={(e) => handleChange(edu.id, 'fieldOfStudy', e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        placeholder="e.g., Computer Science, Economics"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Institution Name
                      </label>
                      <input
                        type="text"
                        value={edu.institutionName}
                        onChange={(e) => handleChange(edu.id, 'institutionName', e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        placeholder="e.g., Harvard University"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Country of Institution
                      </label>
                      <input
                        type="text"
                        value={edu.country}
                        onChange={(e) => handleChange(edu.id, 'country', e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        placeholder="e.g., United States"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Start Date
                      </label>
                      <input
                        type="month"
                        value={edu.startDate}
                        onChange={(e) => handleChange(edu.id, 'startDate', e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        End Date
                      </label>
                      <input
                        type="month"
                        value={edu.endDate}
                        onChange={(e) => handleChange(edu.id, 'endDate', e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      />
                    </div>
                  </div>
                </div>
              ))}
              
              <button
                type="button"
                onClick={handleAddEducation}
                className="w-full py-3 mt-2 text-sm font-medium text-blue-700 border border-dashed border-blue-300 bg-blue-50 rounded-lg hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition flex items-center justify-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Another Qualification
              </button>
            </div>

            {/* Form Actions */}
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
              form="educationForm"
              className="px-5 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-700 border border-transparent rounded-lg hover:from-blue-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
            >
              Save Changes
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};