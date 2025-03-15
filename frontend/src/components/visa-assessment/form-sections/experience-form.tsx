// src/components/visa-assessment/form-sections/experience-form.tsx
interface ExperienceFormProps {
    overseasYears?: number;
    australiaYears?: number;
    onOverseasChange: (value: number | undefined) => void;
    onAustraliaChange: (value: number | undefined) => void;
    points?: number;
  }
  
  export default function ExperienceForm({ 
    overseasYears, 
    australiaYears, 
    onOverseasChange, 
    onAustraliaChange, 
    points = 0 
  }: ExperienceFormProps) {
    const handleNumberChange = (value: string, setter: (value: number | undefined) => void) => {
      if (value === '') {
        setter(undefined);
      } else {
        const num = parseFloat(value);
        if (!isNaN(num)) {
          setter(num);
        }
      }
    };
  
    return (
      <div className="bg-white shadow-sm rounded-lg p-5 border border-gray-200">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Work Experience</h3>
          <div className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-sm">
            Points: <span className="font-medium">{points}</span>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Years of Skilled Employment Outside Australia
            </label>
            <input
              type="number"
              min="0"
              step="0.5"
              value={overseasYears === undefined ? '' : overseasYears}
              onChange={(e) => handleNumberChange(e.target.value, onOverseasChange)}
              placeholder="e.g. 3.5"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Years of Skilled Employment in Australia
            </label>
            <input
              type="number"
              min="0"
              step="0.5"
              value={australiaYears === undefined ? '' : australiaYears}
              onChange={(e) => handleNumberChange(e.target.value, onAustraliaChange)}
              placeholder="e.g. 2.5"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-gray-600 font-medium mb-2">Overseas Experience:</div>
            <ul className="space-y-1 text-sm text-gray-700">
              <li>Less than 3 years: 0 points</li>
              <li>3-4 years: 5 points</li>
              <li>5-7 years: 10 points</li>
              <li>8+ years: 15 points</li>
            </ul>
          </div>
          
          <div>
            <div className="text-sm text-gray-600 font-medium mb-2">Australian Experience:</div>
            <ul className="space-y-1 text-sm text-gray-700">
              <li>Less than 1 year: 0 points</li>
              <li>1-2 years: 5 points</li>
              <li>3-4 years: 10 points</li>
              <li>5-7 years: 15 points</li>
              <li>8+ years: 20 points</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }