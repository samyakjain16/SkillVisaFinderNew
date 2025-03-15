'use client';

import { useState } from 'react';
import { PersonalInfoSection } from '../applicant/applicant-profile/PersonalInfoSection';
import { EducationSection } from '../applicant/applicant-profile/EducationSection';
import { ExperienceSection } from '../applicant/applicant-profile/ExperienceSection';
import { LanguageSection } from '../applicant/applicant-profile/LanguageSection';

interface PersonalInfo {
  firstName: string;
  middleName?: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  maritalStatus: string;
  nationality: string;
  passport: {
    number: string;
    expiryDate: string;
    issuingCountry: string;
  };
  contact: {
    email: string;
    phone: string;
    address: string;
  };
}

interface Education {
  id: string;
  level: string;
  fieldOfStudy: string;
  institutionName: string;
  country: string;
  startDate: string;
  endDate: string;
}

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

interface ApplicantProfileSidebarProps {
  applicantData?: {
    full_name?: string;
    email?: string;
    phone?: string;
    education?: Education[];
    experience?: Employment[];
    language?: string;
  };
  loading?: boolean;
}

export default function ApplicantProfileSidebar({ 
  applicantData,
  loading = false 
}: ApplicantProfileSidebarProps) {
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo | undefined>(
    applicantData ? {
      firstName: applicantData.full_name?.split(' ')[0] || '',
      middleName: applicantData.full_name && applicantData.full_name.split(' ').length > 2 ? 
        applicantData.full_name.split(' ').slice(1, -1).join(' ') : '',
      lastName: applicantData.full_name?.split(' ').slice(-1)[0] || '',
      dateOfBirth: '',
      gender: 'male',
      maritalStatus: '',
      nationality: '',
      passport: {
        number: '',
        expiryDate: '',
        issuingCountry: ''
      },
      contact: {
        email: applicantData.email || '',
        phone: applicantData.phone || '',
        address: ''
      }
    } : undefined
  );

  const [educationList, setEducationList] = useState<Education[]>(
    applicantData?.education || []
  );

  const [experienceList, setExperienceList] = useState<Employment[]>(
    applicantData?.experience || []
  );

  const handlePersonalInfoUpdate = (updatedData: PersonalInfo) => {
    setPersonalInfo(updatedData);
    console.log('Updated personal info:', updatedData);
    // Here you would typically call an API to update the data
  };

  const handleEducationUpdate = (updatedData: Education[]) => {
    setEducationList(updatedData);
    console.log('Updated education:', updatedData);
    // Here you would typically call an API to update the data
  };

  const handleExperienceUpdate = (updatedData: Employment[]) => {
    setExperienceList(updatedData);
    console.log('Updated experience:', updatedData);
    // Here you would typically call an API to update the data
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <PersonalInfoSection
        personalInfo={personalInfo}
        onUpdate={handlePersonalInfoUpdate}
      />
      <EducationSection 
        educationList={educationList}
        onUpdate={handleEducationUpdate}
      />
      <ExperienceSection 
        experienceList={experienceList}
        onUpdate={handleExperienceUpdate}
      />
      <LanguageSection 
        language={applicantData?.language}
        onEdit={() => console.log('Edit language')}
      />
    </div>
  );
}