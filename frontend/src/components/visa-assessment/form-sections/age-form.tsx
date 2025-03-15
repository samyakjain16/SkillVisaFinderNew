// src/components/visa-assessment/form-sections/age-form.tsx


interface AgeFormProps {
  value?: number;
  onChange: (value: number | null) => void;
  points?: number;
}


export default function AgeForm({ value, onChange, points }: AgeFormProps) {
  return (
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-medium">Age</h3>
          <div className="text-sm bg-blue-50 text-blue-700 px-2 py-1 rounded">
            Current Points: <span className="font-medium">{points}</span>
          </div>
        </div>
        
        <p className="text-gray-500">
          Points are awarded based on the applicant's age at the time of invitation.
        </p>
        
        <div className="max-w-xs">
          <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
            Age (years)
          </label>
          <input
            type="number"
            id="age"
            min="0"
            max="100"
            value={value || ''}
            onChange={(e) => onChange(e.target.value ? parseInt(e.target.value) : null)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        
        <div className="bg-gray-50 p-4 rounded-md border mt-4">
          <h4 className="text-sm font-medium mb-2">Points Reference</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>18-24 years: 25 points</div>
            <div>25-32 years: 30 points</div>
            <div>33-39 years: 25 points</div>
            <div>40-44 years: 15 points</div>
            <div>45+ years: 0 points</div>
          </div>
        </div>
      </div>
    );
  }