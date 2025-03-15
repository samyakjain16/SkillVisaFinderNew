'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Bell, Menu } from 'lucide-react';
import { useAuth } from '@/lib/context/auth-context';
import { useRouter } from 'next/navigation';

interface HeaderProps {
  setSidebarOpen: (open: boolean) => void;
  title?: string;
}

export default function Header({ setSidebarOpen, title = "Dashboard" }: HeaderProps) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };
  
  return (
    <header className="bg-white shadow-sm border-b border-gray-100 py-4 px-6 flex items-center justify-between">
      <div className="flex items-center">
        <button 
          className="md:hidden mr-4 rounded-md p-2 text-gray-500 hover:bg-gray-100"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu className="h-6 w-6" />
        </button>
        <h1 className="text-xl font-semibold text-gray-800">{title}</h1>
      </div>
      
      <div className="flex items-center">
        <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors mr-4">
          <Bell className="h-5 w-5 text-gray-600" />
        </button>
        
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <span className="sr-only">Open user menu</span>
            <div className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center text-white">
              {user?.fullName ? user.fullName.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase()}
            </div>
          </button>
          
          {isDropdownOpen && (
  <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-xl shadow-lg bg-white border border-gray-200 ring-1 ring-gray-100 focus:outline-none z-50 transition-all duration-200">
    <div className="px-5 py-3 text-gray-800">
      <p className="font-semibold text-base">{user?.fullName || 'User'}</p>
      <p className="truncate text-sm text-gray-500">{user?.email}</p>
    </div>
    <div className="border-t border-gray-200"></div>
    <Link
      href="/dashboard/profile"
      className="block px-5 py-3 text-sm text-gray-700 hover:bg-gray-100 hover:text-indigo-600 transition-all duration-200"
      onClick={() => setIsDropdownOpen(false)}
    >
      Your Profile
    </Link>
    <button
      onClick={handleLogout}
      className="block w-full text-left px-5 py-3 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
    >
      Sign out
    </button>
  </div>
)}

        </div>
      </div>
    </header>
  );
}