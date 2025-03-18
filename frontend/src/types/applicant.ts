// Fields that can be extracted from CV
export interface ExtractedApplicantData {
  personal: {
    full_name: string;
    email: string;
    phone: string;
    date_of_birth: string;
    nationality: string;
  };
  education: {
    level: string;
    field: string;
    institution: string;
    country: string;
    start_date: string;
    end_date: string;
  }[];
  experience: {
    title: string;
    company: string;
    country: string;
    start_date: string;
    end_date: string;
  }[];
}