// src/components/visa-assessment/form-sections/other-factors-form.tsx
interface OtherFactorsFormProps {
    formData: {
      australian_study: boolean;
      specialist_education: boolean;
      partner_skills_points: number;
      community_language_points: number;
      regional_study_points: number;
      professional_year_points: number;
    };
    onChange: (field: keyof OtherFactorsFormProps["formData"], value: any) => void;
  }
  
  
  export default function OtherFactorsForm({ formData, onChange }: OtherFactorsFormProps) {
    const totalPoints = (
      (formData.australian_study ? 5 : 0) +
      (formData.specialist_education ? 10 : 0) +
      formData.partner_skills_points +
      formData.community_language_points +
      formData.regional_study_points +
      formData.professional_year_points
    );
  
    return (
      <div className="bg-white shadow-sm rounded-lg p-5 border border-gray-200">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Other Factors</h3>
          <div className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-sm">
            Total Points: <span className="font-medium">{totalPoints}</span>
          </div>
        </div>
        
        <div className="space-y-5">
          {/* Australian Study */}
          <div className="p-4 border border-gray-100 rounded-md">
            <div className="flex items-start">
              <input
                id="australian-study"
                type="checkbox"
                checked={formData.australian_study}
                onChange={(e) => onChange('australian_study', e.target.checked)}
                className="h-4 w-4 text-indigo-600 border-gray-300 rounded mt-1"
              />
              <div className="ml-3">
                <label htmlFor="australian-study" className="font-medium text-gray-700">
                  Australian Study Requirement (5 points)
                </label>
                <p className="text-sm text-gray-500">
                  At least two years of study in Australia in a CRICOS-registered course
                </p>
              </div>
            </div>
          </div>
          
          {/* Specialist Education */}
          <div className="p-4 border border-gray-100 rounded-md">
            <div className="flex items-start">
              <input
                id="specialist-education"
                type="checkbox"
                checked={formData.specialist_education}
                onChange={(e) => onChange('specialist_education', e.target.checked)}
                className="h-4 w-4 text-indigo-600 border-gray-300 rounded mt-1"
              />
              <div className="ml-3">
                <label htmlFor="specialist-education" className="font-medium text-gray-700">
                  Specialist Education Qualification (10 points)
                </label>
                <p className="text-sm text-gray-500">
                  Master's or PhD by research in a STEM field from an Australian institution
                </p>
              </div>
            </div>
          </div>
          
          {/* Partner Skills */}
          <div className="p-4 border border-gray-100 rounded-md">
            <div className="mb-2 font-medium text-gray-700">
              Partner Skills (up to 10 points)
            </div>
            <select
              value={formData.partner_skills_points}
              onChange={(e) => onChange('partner_skills_points', parseInt(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="0">None - 0 points</option>
              <option value="5">Partner has Competent English - 5 points</option>
              <option value="10">Partner has skills assessment + Competent English - 10 points</option>
              <option value="10">Single or Australian partner - 10 points</option>
            </select>
          </div>
          
          {/* Community Language */}
          <div className="p-4 border border-gray-100 rounded-md">
            <div className="mb-2 font-medium text-gray-700">
              Community Language (5 points)
            </div>
            <select
              value={formData.community_language_points}
              onChange={(e) => onChange('community_language_points', parseInt(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="0">No NAATI credential - 0 points</option>
              <option value="5">NAATI certified translator/interpreter - 5 points</option>
            </select>
          </div>
          
          {/* Regional Study */}
          <div className="p-4 border border-gray-100 rounded-md">
            <div className="mb-2 font-medium text-gray-700">
              Study in Regional Australia (5 points)
            </div>
            <select
              value={formData.regional_study_points}
              onChange={(e) => onChange('regional_study_points', parseInt(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="0">No regional study - 0 points</option>
              <option value="5">Studied in regional Australia - 5 points</option>
            </select>
          </div>
          
          {/* Professional Year */}
          <div className="p-4 border border-gray-100 rounded-md">
            <div className="mb-2 font-medium text-gray-700">
              Professional Year in Australia (5 points)
            </div>
            <select
              value={formData.professional_year_points}
              onChange={(e) => onChange('professional_year_points', parseInt(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="0">No professional year - 0 points</option>
              <option value="5">Completed professional year - 5 points</option>
            </select>
          </div>
        </div>
      </div>
    );
  }