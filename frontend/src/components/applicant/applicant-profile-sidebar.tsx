// src/components/applicant/applicant-profile-sidebar.tsx
'use client';

import { useState, useEffect } from 'react';
import { PersonalInfoSection } from '../applicant/applicant-profile/PersonalInfoSection';
import { EducationSection } from '../applicant/applicant-profile/EducationSection';
import { ExperienceSection } from '../applicant/applicant-profile/ExperienceSection';
import { LanguageSection } from '../applicant/applicant-profile/LanguageSection';
import { useClient } from '@/lib/context/client-context';
import toast from 'react-hot-toast';

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
  loading?: boolean;
}

const validateGender = (gender: string | undefined): 'male' | 'female' | 'other' => {
  if (gender === 'female' || gender === 'other') {
    return gender;
  }
  return 'male'; // Default to male for any other value
};


export default function ApplicantProfileSidebar({ loading: propLoading = false }: ApplicantProfileSidebarProps) {
  const { selectedClient, isLoading: clientLoading, updateClient } = useClient();
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo | undefined>(undefined);
  const [educationList, setEducationList] = useState<Education[]>([]);
  const [experienceList, setExperienceList] = useState<Employment[]>([]);

  // Update state whenever selectedClient changes
  useEffect(() => {
    if (selectedClient) {
      // Use explicit fields if available, otherwise parse from full name
      const firstName = selectedClient.first_name || 
        (selectedClient.full_name ? selectedClient.full_name.split(' ')[0] : '');
      
      const lastName = selectedClient.last_name || 
        (selectedClient.full_name && selectedClient.full_name.split(' ').length > 1 
          ? selectedClient.full_name.split(' ').slice(-1)[0] 
          : '');
      
      const middleName = selectedClient.middle_name || 
        (selectedClient.full_name && selectedClient.full_name.split(' ').length > 2 
          ? selectedClient.full_name.split(' ').slice(1, -1).join(' ') 
          : '');
      
      // Update personal info
      setPersonalInfo({
        firstName,
        middleName,
        lastName,
        dateOfBirth: selectedClient.date_of_birth || '',
        gender: validateGender(selectedClient.gender), // Use the validator function
        maritalStatus: selectedClient.marital_status || '',
        nationality: selectedClient.nationality || '',
        passport: {
          number: selectedClient.passport_number || '',
          expiryDate: selectedClient.passport_expiry || '',
          issuingCountry: selectedClient.passport_issuing_country || ''
        },
        contact: {
          email: selectedClient.email || '',
          phone: selectedClient.phone || '',
          address: selectedClient.address || ''
        }
      });

      // Map education data if available
      if (selectedClient.education && Array.isArray(selectedClient.education)) {
        const mappedEducation = selectedClient.education.map((edu: any, index: number) => ({
          id: String(index),
          level: edu.level || '',
          fieldOfStudy: edu.field || '',
          institutionName: edu.institution || '',
          country: edu.country || '',
          startDate: edu.start_date || '',
          endDate: edu.end_date || ''
        }));
        setEducationList(mappedEducation);
      }

      // Map experience data if available
      if (selectedClient.experience && Array.isArray(selectedClient.experience)) {
        const mappedExperience = selectedClient.experience.map((exp: any, index: number) => ({
          id: String(index),
          employerName: exp.company || '',
          country: exp.country || '',
          jobTitle: exp.title || '',
          startDate: exp.start_date || '',
          endDate: exp.end_date || '',
          responsibilities: exp.responsibilities || []
        }));
        setExperienceList(mappedExperience);
      }
    }
  }, [selectedClient]);

  const handlePersonalInfoUpdate = async (updatedData: PersonalInfo) => {
    if (!selectedClient?.id) return;
    
    setPersonalInfo(updatedData);
    
    // Transform the data format to match what the backend expects
    const clientUpdateData = {
      first_name: updatedData.firstName,
      middle_name: updatedData.middleName,
      last_name: updatedData.lastName,
      full_name: [updatedData.firstName, updatedData.middleName, updatedData.lastName].filter(Boolean).join(' '),
      date_of_birth: updatedData.dateOfBirth,
      gender: updatedData.gender,
      marital_status: updatedData.maritalStatus,
      nationality: updatedData.nationality,
      passport_number: updatedData.passport.number,
      passport_expiry: updatedData.passport.expiryDate,
      passport_issuing_country: updatedData.passport.issuingCountry,
      email: updatedData.contact.email,
      phone: updatedData.contact.phone,
      address: updatedData.contact.address
    };
    
    try {
      // Call the updateClient method from context
      await updateClient(selectedClient.id, clientUpdateData);
      toast.success("Personal information updated successfully");
    } catch (error) {
      console.error("Failed to update client information:", error);
      // Show error notification
      toast.error("Failed to update personal information");
    }
  };

  const handleEducationUpdate = (updatedData: Education[]) => {
    setEducationList(updatedData);
    // Here you would typically call an API to update the data
  };

  const handleExperienceUpdate = (updatedData: Employment[]) => {
    setExperienceList(updatedData);
    // Here you would typically call an API to update the data
  };

  const loading = propLoading || clientLoading;

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
        language=""
        onEdit={() => console.log('Edit language')}
      />
    </div>
  );
}