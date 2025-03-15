import RegisterForm from '@/app/auth/register-form';

export const metadata = {
  title: 'Register | Visa Assessment System',
  description: 'Create your Visa Assessment System account',
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <RegisterForm />
    </div>
  );
}