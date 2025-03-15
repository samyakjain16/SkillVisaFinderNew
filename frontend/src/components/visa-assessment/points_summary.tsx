// src/components/visa-assessment/points-summary.tsx
import { CheckCircle, XCircle } from 'lucide-react';


// Define the type for the assessment prop
interface Assessment {
total_points?: number;
age_points?: number;
english_points?: number;
education_points?: number;
experience_points?: number;
australian_study_points?: number;
specialist_education_points?: number;
partner_skills_points?: number;
community_language_points?: number;
regional_study_points?: number;
professional_year_points?: number;
}

export default function PointsSummary({ assessment }: { assessment: Assessment }) {
    const totalPoints = assessment.total_points || 0;
    const passingPoints = 65; // For 189 visa
    const isPassing = totalPoints >= passingPoints;
  
  const pointsCategories = [
    { name: 'Age', points: assessment.age_points || 0 },
    { name: 'English', points: assessment.english_points || 0 },
    { name: 'Education', points: assessment.education_points || 0 },
    { name: 'Experience', points: assessment.experience_points || 0 },
    { name: 'Australian Study', points: assessment.australian_study_points || 0 },
    { name: 'Specialist Education', points: assessment.specialist_education_points || 0 },
    { name: 'Partner Skills', points: assessment.partner_skills_points || 0 },
    { name: 'Community Language', points: assessment.community_language_points || 0 },
    { name: 'Regional Study', points: assessment.regional_study_points || 0 },
    { name: 'Professional Year', points: assessment.professional_year_points || 0 },
  ];


  
  // Filter out zero point categories for cleaner display
  const nonZeroCategories = pointsCategories.filter(cat => cat.points > 0);
  
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="p-6 border-b">
        <h2 className="text-lg font-medium mb-4">Points Summary</h2>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="mr-4 text-4xl font-bold">
              {totalPoints}
            </div>
            <div>
              <div className="text-gray-500">points</div>
              <div className="text-sm">
                Passing score: {passingPoints}
              </div>
            </div>
          </div>
          
          <div className={`flex items-center ${isPassing ? 'text-green-600' : 'text-red-600'}`}>
            {isPassing ? (
              <>
                <CheckCircle className="h-6 w-6 mr-2" />
                <div>
                  <div className="font-medium">Passing</div>
                  <div className="text-sm text-gray-500">Points requirement met</div>
                </div>
              </>
            ) : (
              <>
                <XCircle className="h-6 w-6 mr-2" />
                <div>
                  <div className="font-medium">Not Passing</div>
                  <div className="text-sm text-gray-500">Needs {passingPoints - totalPoints} more points</div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      
      <div className="px-6 py-4 bg-gray-50">
        <h3 className="text-sm font-medium text-gray-500 mb-3">Points Breakdown</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {nonZeroCategories.map((category) => (
            <div key={category.name} className="bg-white rounded border p-3 flex justify-between items-center">
              <span className="text-gray-700">{category.name}</span>
              <span className="font-medium">{category.points} pts</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}