// src/components/applicant/applicant-details.tsx
'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, User, GraduationCap, Briefcase, Languages } from 'lucide-react';
import { ApplicantDetails } from '@/types';

interface ApplicantDetailsSummaryProps {
  applicantData: ApplicantDetails;
  onEdit?: () => void;
}

export default function ApplicantDetailsSummary({ applicantData, onEdit }: ApplicantDetailsSummaryProps) {
  const [expanded, setExpanded] = useState(false);
  
  const toggleExpanded = () => {
    setExpanded(!expanded);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div 
        className="flex items-center justify-between p-4 cursor-pointer"
        onClick={toggleExpanded}
      >
        <div className="flex items-center gap-2">
          <User className="h-5 w-5 text-indigo-500" />
          <h2 className="text-lg font-medium">Applicant Details</h2>
        </div>
        <button className="text-gray-500 hover:text-gray-700">
          {expanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          // src/components/applicant/applicant-details.tsx (continued)
       </button>
     </div>
     
     {expanded && (
       <div className="p-4 border-t border-gray-100">
         {/* Personal Details */}
         <div className="mb-6">
           <div className="flex items-center gap-2 mb-2">
             <User className="h-4 w-4 text-indigo-500" />
             <h3 className="text-sm font-medium text-gray-700">Personal Information</h3>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-2 text-sm">
             <div>
               <span className="text-gray-500">Full Name:</span> {applicantData.full_name}
             </div>
             {applicantData.email && (
               <div>
                 <span className="text-gray-500">Email:</span> {applicantData.email}
               </div>
             )}
             {applicantData.phone && (
               <div>
                 <span className="text-gray-500">Phone:</span> {applicantData.phone}
               </div>
             )}
             {applicantData.date_of_birth && (
               <div>
                 <span className="text-gray-500">Date of Birth:</span> {new Date(applicantData.date_of_birth).toLocaleDateString()}
               </div>
             )}
             {applicantData.nationality && (
               <div>
                 <span className="text-gray-500">Nationality:</span> {applicantData.nationality}
               </div>
             )}
             {applicantData.passport_number && (
               <div>
                 <span className="text-gray-500">Passport Number:</span> {applicantData.passport_number}
               </div>
             )}
           </div>
         </div>
         
         {/* Education */}
         {applicantData.education && applicantData.education.length > 0 && (
           <div className="mb-6">
             <div className="flex items-center gap-2 mb-2">
               <GraduationCap className="h-4 w-4 text-indigo-500" />
               <h3 className="text-sm font-medium text-gray-700">Education</h3>
             </div>
             <div className="space-y-2">
               {applicantData.education.map((edu, index) => (
                 <div key={index} className="p-2 border border-gray-100 rounded">
                   <div className="font-medium">{edu.level} {edu.field && `in ${edu.field}`}</div>
                   <div className="text-sm text-gray-600">
                     {edu.institution}
                     {edu.country && `, ${edu.country}`}
                   </div>
                   {(edu.start_date || edu.end_date) && (
                     <div className="text-sm text-gray-500">
                       {edu.start_date && formatYearMonth(edu.start_date)}
                       {edu.start_date && edu.end_date && ' - '}
                       {edu.end_date && formatYearMonth(edu.end_date)}
                     </div>
                   )}
                 </div>
               ))}
             </div>
           </div>
         )}
         
         {/* Work Experience */}
         {applicantData.experience && applicantData.experience.length > 0 && (
           <div className="mb-6">
             <div className="flex items-center gap-2 mb-2">
               <Briefcase className="h-4 w-4 text-indigo-500" />
               <h3 className="text-sm font-medium text-gray-700">Work Experience</h3>
             </div>
             <div className="space-y-2">
               {applicantData.experience.map((exp, index) => (
                 <div key={index} className="p-2 border border-gray-100 rounded">
                   <div className="font-medium">{exp.title}</div>
                   <div className="text-sm text-gray-600">
                     {exp.company}
                     {exp.country && `, ${exp.country}`}
                   </div>
                   {(exp.start_date || exp.end_date) && (
                     <div className="text-sm text-gray-500">
                       {exp.start_date && formatYearMonth(exp.start_date)}
                       {exp.start_date && ' - '}
                       {exp.end_date === 'present' ? 'Present' : formatYearMonth(exp.end_date || '')}
                       {exp.duration_years && ` (${exp.duration_years} years)`}
                     </div>
                   )}
                 </div>
               ))}
             </div>
           </div>
         )}
         
         {/* English Proficiency */}
         {applicantData.english && (applicantData.english.level || applicantData.english.test) && (
           <div className="mb-6">
             <div className="flex items-center gap-2 mb-2">
               <Languages className="h-4 w-4 text-indigo-500" />
               <h3 className="text-sm font-medium text-gray-700">English Proficiency</h3>
             </div>
             <div className="p-2 border border-gray-100 rounded">
               {applicantData.english.level && (
                 <div>
                   <span className="text-gray-500">Level:</span> {formatEnglishLevel(applicantData.english.level)}
                 </div>
               )}
               {applicantData.english.test && (
                 <div>
                   <span className="text-gray-500">Test:</span> {applicantData.english.test}
                 </div>
               )}
               {applicantData.english.scores && (
                 <div className="mt-2">
                   <div className="text-xs font-medium text-gray-500 mb-1">Scores:</div>
                   <div className="grid grid-cols-5 gap-2 text-sm">
                     {applicantData.english.scores.overall && (
                       <div className="text-center">
                         <div className="font-medium">{applicantData.english.scores.overall}</div>
                         <div className="text-xs text-gray-500">Overall</div>
                       </div>
                     )}
                     {applicantData.english.scores.reading && (
                       <div className="text-center">
                         <div className="font-medium">{applicantData.english.scores.reading}</div>
                         <div className="text-xs text-gray-500">Reading</div>
                       </div>
                     )}
                     {applicantData.english.scores.writing && (
                       <div className="text-center">
                         <div className="font-medium">{applicantData.english.scores.writing}</div>
                         <div className="text-xs text-gray-500">Writing</div>
                       </div>
                     )}
                     {applicantData.english.scores.speaking && (
                       <div className="text-center">
                         <div className="font-medium">{applicantData.english.scores.speaking}</div>
                         <div className="text-xs text-gray-500">Speaking</div>
                       </div>
                     )}
                     {applicantData.english.scores.listening && (
                       <div className="text-center">
                         <div className="font-medium">{applicantData.english.scores.listening}</div>
                         <div className="text-xs text-gray-500">Listening</div>
                       </div>
                     )}
                   </div>
                 </div>
               )}
             </div>
           </div>
         )}
         
         {onEdit && (
           <div className="flex justify-end">
             <button
               type="button"
               onClick={onEdit}
               className="px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
             >
               Edit Details
             </button>
           </div>
         )}
       </div>
     )}
   </div>
 );
}

// Helper functions
function formatYearMonth(dateString: string): string {
 if (!dateString) return '';
 
 try {
   const date = new Date(dateString);
   return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
 } catch (e) {
   return dateString;
 }
}

function formatEnglishLevel(level: string): string {
 switch (level.toLowerCase()) {
   case 'superior': return 'Superior (IELTS 8+)';
   case 'proficient': return 'Proficient (IELTS 7-7.5)';
   case 'competent': return 'Competent (IELTS 6-6.5)';
   default: return level;
 }
}