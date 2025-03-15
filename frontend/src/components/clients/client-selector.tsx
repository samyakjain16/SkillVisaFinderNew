// src/components/clients/client-selector.tsx
'use client';

import { useState } from 'react';
import { useClient } from '@/lib/context/client-context';
import { ChevronDown, UserPlus, User } from 'lucide-react';
import Link from 'next/link';

export default function ClientSelector() {
  const { clients, selectedClient, selectClient, isLoading } = useClient();
  const [isOpen, setIsOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="w-full p-3 bg-gray-100 rounded-md animate-pulse">
        <div className="h-6 bg-gray-200 rounded"></div>
      </div>
    );
  }

  if (clients.length === 0) {
    return (
      <Link
        href="/dashboard/clients/new"
        className="flex items-center gap-2 p-3 text-sm bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-100 transition-colors"
      >
        <UserPlus size={16} />
        <span>Add Your First Client</span>
      </Link>
    );
  }

  return (
    <div className="relative">
      <button
        className="flex items-center justify-between w-full p-3 text-sm bg-white rounded-md shadow-sm hover:bg-gray-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
          <User size={16} className="text-gray-500" />
          <span>{selectedClient?.full_name || 'Select a client'}</span>
        </div>
        <ChevronDown size={16} className="text-gray-500" />
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg">
          <ul className="py-1 max-h-60 overflow-auto">
            {clients.map((client) => (
              <li key={client.id}>
                <button
                  className={`flex items-center w-full px-4 py-2 text-sm text-left hover:bg-gray-100 ${
                    selectedClient?.id === client.id ? 'bg-indigo-50 text-indigo-700' : ''
                  }`}
                  onClick={() => {
                    selectClient(client.id);
                    setIsOpen(false);
                  }}
                >
                  {client.full_name}
                </button>
              </li>
            ))}
          </ul>
          <div className="py-1">
            <Link
              href="/dashboard/clients/new"
              className="flex items-center px-4 py-2 text-sm text-indigo-600 hover:bg-gray-100"
            >
              <UserPlus size={16} className="mr-2" />
              Add New Client
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}