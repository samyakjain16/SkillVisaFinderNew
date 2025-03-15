// src/lib/api.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

let authToken: string | null = null;

export function setAuthToken(token: string) {
  authToken = token;
}

export function clearAuthToken() {
  authToken = null;
}

interface APIError {
  detail?: string | { code: string; message: string; action?: string };
  message?: string;
  code?: string;
  action?: string;
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_URL}${endpoint}`;

  const isFormData = options.body instanceof FormData;

  const headers = {
    ...(!isFormData && { 'Content-Type': 'application/json' }),
    ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    ...(options.headers || {}),
  };

  const config = {
    ...options,
    headers,
  };

  const response = await fetch(url, config);

  if (!response.ok) {
    let errorDetail: any;
    try {
      errorDetail = await response.json();
      console.log("Raw backend error:", errorDetail);  // Debug log
    } catch {
      errorDetail = { detail: 'An unknown error occurred' };
    }

    // Normalize the error
    const normalizedError: APIError = {
      detail: errorDetail.detail,  // Keep the full detail object intact
      message: (typeof errorDetail.detail === 'object' && errorDetail.detail.message) || errorDetail.message || (typeof errorDetail.detail === 'string' ? errorDetail.detail : 'An unknown error occurred'),
      code: (typeof errorDetail.detail === 'object' && errorDetail.detail.code) || 'UNKNOWN_ERROR',
      action: (typeof errorDetail.detail === 'object' && errorDetail.detail.action) || undefined,
    };

    // console.log("Normalized error:", normalizedError);  // Debug log

    const error = new Error(normalizedError.message);
    Object.assign(error, normalizedError);
    throw error;
  }

  return response.json() as Promise<T>;
}

// Define OccupationMatch and UploadCVResponse
export interface OccupationMatch {
  anzsco_code: string;
  occupation_name: string;
  list?: string;
  visa_subclasses?: string;
  assessing_authority?: string;
  confidence_score: number;
  suggested_occupation: string;
}

export interface UploadCVResponse {
  occupation_matches: OccupationMatch[];
}

export async function uploadCV(formData: FormData) {
  return request<UploadCVResponse>('/documents/upload-cv', {
    method: 'POST',
    headers: {}, // Let the browser set Content-Type for FormData
    body: formData,
  });
}

// Authentication APIs (unchanged for brevity)
export async function login(email: string, password: string) {
  const formData = new FormData();
  formData.append('username', email);
  formData.append('password', password);
  return request<{ access_token: string; token_type: string }>('/auth/login', {
    method: 'POST',
    body: formData,
  });
}

export async function googleLogin(token: string) {
  return request<{ access_token: string; token_type: string }>('/auth/google-login', {
    method: 'POST',
    body: JSON.stringify({ token }),
  });
}

export async function register(email: string, password: string, fullName?: string) {
  return request<{ email: string; full_name?: string }>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password, full_name: fullName }),
  });
}

export async function getCurrentUser() {
  return request<{ email: string; full_name?: string }>('/users/me');
}

export const api = {
  setAuthToken,
  clearAuthToken,
  request,
  uploadCV,
  login,
  googleLogin,
  register,
  getCurrentUser,
};
