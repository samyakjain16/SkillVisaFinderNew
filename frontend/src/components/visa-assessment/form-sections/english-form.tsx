// src/components/visa-assessment/form-sections/english-form.tsx
interface EnglishFormProps {
    level?: string;
    test?: string;
    onLevelChange: (value: string) => void;
    onTestChange: (value: string) => void;
    points?: number;
  }
  
  export default function EnglishForm({ 
    level, 
    test, 
    onLevelChange, 
    onTestChange, 
    points = 0 
  }: EnglishFormProps) {
    return (
      <div className="bg-white shadow-sm rounded-lg p-5 border border-gray-200">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold text-gray-800">English Language</h3>
          <div className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-sm">
            Points: <span className="font-medium">{points}</span>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              English Proficiency Level
            </label>
            <select
              value={level || ''}
              onChange={(e) => onLevelChange(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Select level</option>
              <option value="competent">Competent (IELTS 6 / PTE 50)</option>
              <option value="proficient">Proficient (IELTS 7 / PTE 65)</option>
              <option value="superior">Superior (IELTS 8 / PTE 79)</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              English Test Type
            </label>
            <select
              value={test || ''}
              onChange={(e) => onTestChange(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Select test</option>
              <option value="IELTS">IELTS</option>
              <option value="PTE">PTE Academic</option>
              <option value="TOEFL">TOEFL iBT</option>
              <option value="CAE">Cambridge C1/C2</option>
            </select>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="text-sm text-gray-600 font-medium mb-2">Points Reference:</div>
          <ul className="space-y-1 text-sm text-gray-700">
            <li>Superior (IELTS 8+): 20 points</li>
            <li>Proficient (IELTS 7-7.5): 10 points</li>
            <li>Competent (IELTS 6-6.5): 0 points</li>
          </ul>
        </div>
      </div>
    );
  }