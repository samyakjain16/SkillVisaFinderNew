import LoginForm from '@/app/auth/login-form';

export const metadata = {
  title: 'Login | Visa Assessment System',
  description: 'Sign in to your Visa Assessment System account',
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <LoginForm />
    </div>
  );
}