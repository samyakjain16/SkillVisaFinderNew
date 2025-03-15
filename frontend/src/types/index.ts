// src/types/index.ts
export interface Client {
    id: string;
    full_name: string;
    email?: string;
    phone?: string;
    date_of_birth?: string;
    passport_number?: string;
    nationality?: string;
  }
  
  export interface ApplicantDetails {
    id?: string;
    full_name: string;
    email?: string;
    phone?: string;
    date_of_birth?: string;
    age?: number;
    nationality?: string;
    passport_number?: string;
    education: {
      level?: string;
      field?: string;
      institution?: string;
      country?: string;
      start_date?: string;
      end_date?: string;
    }[];
    experience: {
      title?: string;
      company?: string;
      country?: string;
      start_date?: string;
      end_date?: string;
      duration_years?: number;
    }[];
    english: {
      level?: string;
      test?: string;
      scores?: {
        overall?: number;
        reading?: number;
        writing?: number;
        speaking?: number;
        listening?: number;
      };
    };
  }