// src/components/clients/client-list.tsx
'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useClient } from '@/lib/context/client-context';
import { UserPlus, Edit, User, Calendar, Mail, Phone } from 'lucide-react';
import { formatDate } from '@/lib/utils';  // Add this import
export default function ClientList() {
  const { clients, selectedClient, selectClient, isLoading, error, refreshClients } = useClient();

  useEffect(() => {
    refreshClients();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-4 border rounded-lg animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-gray-100 rounded w-1/4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
        <p>Error loading clients: {error}</p>
        <button 
          onClick={refreshClients}
          className="mt-2 text-sm font-medium text-red-700 hover:text-red-800"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (clients.length === 0) {
    return (
      <div className="text-center py-12">
        <User className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No clients</h3>
        <p className="mt-1 text-sm text-gray-500">Get started by creating a new client.</p>
        <div className="mt-6">
          <Link
            href="/dashboard/clients/new"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <UserPlus className="-ml-1 mr-2 h-5 w-5" />
            Add New Client
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">Your Clients</h2>
        <Link
          href="/dashboard/clients/new"
          className="inline-flex items-center px-3 py-1.5 border border-transparent rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <UserPlus className="-ml-0.5 mr-2 h-4 w-4" />
          Add Client
        </Link>
      </div>
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {clients.map((client) => (
          <div 
            key={client.id}
            className={`relative border rounded-lg overflow-hidden hover:shadow-md transition-shadow ${
              selectedClient?.id === client.id ? 'border-indigo-500 ring-2 ring-indigo-200' : 'border-gray-200'
            }`}
          >
            <div className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">{client.full_name}</h3>
                  {client.email && (
                    <div className="flex items-center text-sm text-gray-500 mb-1">
                      <Mail className="mr-1 h-4 w-4" />
                      {client.email}
                    </div>
                  )}
                  {client.phone && (
                    <div className="flex items-center text-sm text-gray-500 mb-1">
                      <Phone className="mr-1 h-4 w-4" />
                      {client.phone}
                    </div>
                  )}
                  {client.date_of_birth && (
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="mr-1 h-4 w-4" />
                      {formatDate(client.date_of_birth)}
                    </div>
                  )}
                </div>
                <Link
                  href={`/dashboard/clients/${client.id}/edit`}
                  className="p-1 text-gray-400 hover:text-gray-600"
                >
                  <Edit className="h-4 w-4" />
                </Link>
              </div>
            </div>
            
            <div className="bg-gray-50 px-4 py-2 border-t border-gray-100">
              <div className="flex justify-between items-center">
                {client.nationality && (
                  <span className="text-xs text-gray-500">{client.nationality}</span>
                )}
                <button
                  onClick={() => selectClient(client.id)}
                  className={`text-xs font-medium px-2 py-1 rounded ${
                    selectedClient?.id === client.id 
                      ? 'bg-indigo-100 text-indigo-700' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {selectedClient?.id === client.id ? 'Selected' : 'Select'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}