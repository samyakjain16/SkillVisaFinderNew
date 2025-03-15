import './globals.css';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/lib/context/auth-context';
import { ClientProvider } from '@/lib/context/client-context';
import { Toaster } from 'react-hot-toast'; // Import Toaster

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Visa Assessment System',
  description: 'Automate visa eligibility assessment',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <ClientProvider>
            {children}
            <Toaster position="top-center" /> {/* Add Toaster here */}
          </ClientProvider>
        </AuthProvider>
      </body>
    </html>
  );
}