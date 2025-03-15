// src/components/visa-assessment/form-sections/education-form.tsx
interface EducationFormProps {
    level?: string;
    field?: string;
    onLevelChange: (value: string) => void;
    onFieldChange: (value: string) => void;
    points?: number;
  }
  
  export default function EducationForm({ 
    level, 
    field, 
    onLevelChange, 
    onFieldChange, 
    points = 0 
  }: EducationFormProps) {
    return (
      <div className="bg-white shadow-sm rounded-lg p-5 border border-gray-200">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Education</h3>
          <div className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-sm">
            Points: <span className="font-medium">{points}</span>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Highest Educational Qualification
            </label>
            <select
              value={level || ''}
              onChange={(e) => onLevelChange(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Select qualification</option>
              <option value="phd">PhD / Doctorate</option>
              <option value="masters">Masters Degree</option>
              <option value="bachelors">Bachelors Degree</option>
              <option value="diploma">Diploma</option>
              <option value="trade">Trade Qualification</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Field of Study
            </label>
            <input
              type="text"
              value={field || ''}
              onChange={(e) => onFieldChange(e.target.value)}
              placeholder="e.g. Computer Science, Nursing, Business"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="text-sm text-gray-600 font-medium mb-2">Points Reference:</div>
          <ul className="space-y-1 text-sm text-gray-700">
            <li>PhD from Australian institution: 20 points</li>
            <li>Masters or Bachelors: 15 points</li>
            <li>Diploma or Trade Qualification: 10 points</li>
          </ul>
        </div>
      </div>
    );
  }