'use client';

import { useEffect, useRef } from 'react';
import { useAuth } from '@/lib/context/auth-context';
import { useRouter } from 'next/navigation';

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          renderButton: (element: HTMLElement, config: any) => void;
        };
      };
    };
  }
}

export default function GoogleSignInButton() {
  const { googleLogin } = useAuth();
  const router = useRouter();
  const googleButtonRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Load the Google Sign-In script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
    
    script.onload = () => {
      if (window.google && googleButtonRef.current) {
        window.google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
          callback: handleCredentialResponse,
        });
        
        window.google.accounts.id.renderButton(
          googleButtonRef.current,
          { 
            type: 'standard', 
            theme: 'outline', 
            size: 'large',
            text: 'signin_with',
            shape: 'rectangular',
            width: '100%'
          }
        );
      }
    };
    
    return () => {
      document.body.removeChild(script);
    };
  }, []);
  
  const handleCredentialResponse = async (response: any) => {
    try {
      // The response.credential is the JWT token from Google
      await googleLogin(response.credential);
      router.push('/dashboard');
    } catch (error) {
      console.error('Google sign-in error:', error);
    }
  };
  
  return (
    <div ref={googleButtonRef} className="w-full flex justify-center">
      {/* Google button will be rendered here */}
    </div>
  );
}