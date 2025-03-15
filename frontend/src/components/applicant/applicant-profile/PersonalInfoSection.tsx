'use client';

import { useState } from 'react';
import { User } from 'lucide-react';
import { CollapsibleSection } from './CollapsibleSection';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

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

interface PersonalInfoSectionProps {
  personalInfo?: PersonalInfo;
  onUpdate?: (data: PersonalInfo) => void;
}

export const PersonalInfoSection = ({ personalInfo, onUpdate }: PersonalInfoSectionProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<PersonalInfo>(personalInfo || {
    firstName: '',
    middleName: '',
    lastName: '',
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
      email: '',
      phone: '',
      address: ''
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [section, field] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...(prev[section as keyof PersonalInfo] as object),
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate?.(formData);
    setIsEditing(false);
  };

  const formatName = () => {
    const parts = [
      formData.firstName,
      formData.middleName,
      formData.lastName
    ].filter(Boolean);
    return parts.join(' ') || 'Name not provided';
  };

  return (
    <>
      <CollapsibleSection 
        title="Personal Information" 
        icon={<User className="h-4 w-4 text-gray-400 mr-2" />}
        onEdit={() => setIsEditing(true)}
      >
        <div className="space-y-2 text-sm">
          <div className="text-gray-700">Name: {formatName()}</div>
          <div className="text-gray-700">Date of Birth: {formData.dateOfBirth || 'Not provided'}</div>
          <div className="text-gray-700">Gender: {formData.gender || 'Not provided'}</div>
          <div className="text-gray-700">Marital Status: {formData.maritalStatus || 'Not provided'}</div>
          <div className="text-gray-700">Nationality: {formData.nationality || 'Not provided'}</div>
          <div className="text-gray-700">Passport Number: {formData.passport.number || 'Not provided'}</div>
          <div className="text-gray-700">Email: {formData.contact.email || 'Not provided'}</div>
          <div className="text-gray-700">Phone: {formData.contact.phone || 'Not provided'}</div>
        </div>
      </CollapsibleSection>

      <Dialog open={isEditing} onOpenChange={setIsEditing}>
  <DialogContent className="max-w-3xl bg-white rounded-xl shadow-xl p-0 overflow-hidden">
    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6">
      <DialogHeader>
        <DialogTitle className="text-xl font-semibold text-white">Personal Information</DialogTitle>
        <p className="text-indigo-100 text-sm mt-1">Update your personal details</p>
      </DialogHeader>
    </div>
    
    <form onSubmit={handleSubmit} className="p-6">
      {/* Section: Name Details */}
      <div className="mb-8">
        <h3 className="text-md font-medium text-gray-700 mb-4 flex items-center">
          <User className="h-4 w-4 text-indigo-500 mr-2" />
          <span>Name Details</span>
        </h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              placeholder="Your first name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Middle Name</label>
            <input
              type="text"
              name="middleName"
              value={formData.middleName}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              placeholder="Optional"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              placeholder="Your last name"
            />
          </div>
        </div>
      </div>

      {/* Section: Personal Details */}
      <div className="mb-8">
        <h3 className="text-md font-medium text-gray-700 mb-4 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
          <span>Personal Details</span>
        </h3>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Date of Birth</label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition appearance-none"
              style={{ backgroundImage: "url('data:image/svg+xml;charset=US-ASCII,<svg width=\"20\" height=\"20\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z\" fill=\"%236B7280\"/></svg>')", backgroundPosition: "right 10px center", backgroundRepeat: "no-repeat", paddingRight: "2.5rem" }}
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Marital Status</label>
            <select
              name="maritalStatus"
              value={formData.maritalStatus}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition appearance-none"
              style={{ backgroundImage: "url('data:image/svg+xml;charset=US-ASCII,<svg width=\"20\" height=\"20\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z\" fill=\"%236B7280\"/></svg>')", backgroundPosition: "right 10px center", backgroundRepeat: "no-repeat", paddingRight: "2.5rem" }}
            >
              <option value="">Select status</option>
              <option value="single">Single</option>
              <option value="married">Married</option>
              <option value="divorced">Divorced</option>
              <option value="widowed">Widowed</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Nationality</label>
            <input
              type="text"
              name="nationality"
              value={formData.nationality}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              placeholder="Your nationality"
            />
          </div>
        </div>
      </div>

      {/* Section: Passport Details */}
      <div className="mb-8">
        <h3 className="text-md font-medium text-gray-700 mb-4 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm3 1h6v4H7V5zm8 8v2h1v1H4v-1h1v-2a7.001 7.001 0 0113 0zm-7-8a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
          </svg>
          <span>Passport Details</span>
        </h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Passport Number</label>
            <input
              type="text"
              name="passport.number"
              value={formData.passport.number}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              placeholder="Enter passport number"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Expiry Date</label>
            <input
              type="date"
              name="passport.expiryDate"
              value={formData.passport.expiryDate}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Issuing Country</label>
            <input
              type="text"
              name="passport.issuingCountry"
              value={formData.passport.issuingCountry}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              placeholder="Country of issue"
            />
          </div>
        </div>
      </div>

      {/* Section: Contact Information */}
      <div className="mb-8">
        <h3 className="text-md font-medium text-gray-700 mb-4 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
          </svg>
          <span>Contact Information</span>
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
            <input
              type="email"
              name="contact.email"
              value={formData.contact.email}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              placeholder="your.email@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Phone Number</label>
            <input
              type="tel"
              name="contact.phone"
              value={formData.contact.phone}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              placeholder="+1 (555) 123-4567"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Address</label>
            <input
              type="text"
              name="contact.address"
              value={formData.contact.address}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              placeholder="Your full address"
            />
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-4 pt-4 border-t border-gray-100">
        <button
          type="button"
          onClick={() => setIsEditing(false)}
          className="px-5 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-all"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-5 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 border border-transparent rounded-lg hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
        >
          Save Changes
        </button>
      </div>
    </form>
  </DialogContent>
</Dialog>
    </>
  );
};
