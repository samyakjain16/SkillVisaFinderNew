// src/components/occupations/occupation-list.tsx
'use client';

import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle, ChevronRight } from 'lucide-react';

// Define types for occupation matches
interface OccupationMatch {
  anzsco_code: string;
  occupation_name: string;
  list?: string;
  visa_subclasses?: string;
  assessing_authority?: string;
  confidence_score: number;
  suggested_occupation: string;
}

interface OccupationListProps {
  occupations: OccupationMatch[];
  loading: boolean;
}

export default function OccupationList({ occupations = [], loading = false }: OccupationListProps) {
  // Get confidence color based on score
  const getConfidenceColor = (score: number) => {
    if (score >= 85) return 'bg-green-500';
    if (score >= 70) return 'bg-blue-500';
    return 'bg-yellow-500';
  };

  return (
    <div className="space-y-2">
      {loading ? (
        <div className="text-center py-6">
          <div className="animate-spin h-8 w-8 border-b-2 border-indigo-600 rounded-full mx-auto mb-3"></div>
          <p className="text-sm text-gray-500">Analyzing occupations...</p>
        </div>
      ) : occupations.length > 0 ? (
        <>
          {occupations.map((occupation, index) => (
            <motion.div
              key={occupation.anzsco_code || index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-gray-900">{occupation.occupation_name}</h3>
                  <p className="text-xs text-gray-500 mt-1">ANZSCO: {occupation.anzsco_code}</p>
                </div>
                <div className="flex items-center">
                  <div 
                    className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-medium text-white ${getConfidenceColor(occupation.confidence_score)}`}
                  >
                    {Math.round(occupation.confidence_score)}%
                  </div>
                </div>
              </div>
              
              {/* Additional occupation details */}
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {occupation.list && (
                    <div>
                      <span className="text-gray-500">List: </span>
                      <span className="font-medium">{occupation.list}</span>
                    </div>
                  )}
                  {occupation.assessing_authority && (
                    <div>
                      <span className="text-gray-500">Authority: </span>
                      <span className="font-medium">{occupation.assessing_authority}</span>
                    </div>
                  )}
                </div>
                
                {occupation.visa_subclasses && (
                  <div className="mt-2 text-xs">
                    <span className="text-gray-500">Visa subclasses: </span>
                    <span className="font-medium">{occupation.visa_subclasses}</span>
                  </div>
                )}
                
                <button className="mt-3 text-xs text-indigo-600 flex items-center hover:text-indigo-800 transition-colors">
                  View details <ChevronRight className="h-3 w-3 ml-1" />
                </button>
              </div>
            </motion.div>
          ))}
        </>
      ) : (
        <div className="text-center py-6 text-gray-500">
          <p>Upload your CV to see suggested occupations</p>
        </div>
      )}
    </div>
  );
}