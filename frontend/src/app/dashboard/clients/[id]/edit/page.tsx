"use client"

// Update the import to include Client type
import { api } from '@/lib/api';
import ClientForm from '../../../../../components/clients/clients-form';
import { Client } from '@/lib/context/client-context'; // Import the Client type
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function EditClientPage() {
  const { id } = useParams();
  // Fix: Properly type the client state
  const [client, setClient] = useState<Client | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchClient() {
      try {
        setIsLoading(true);
        // Fix: Add type casting for the API response
        const data = await api.request(`/visa-assessment/clients/${id}`) as Client;
        setClient(data);
      } catch (err: any) {
        console.error('Error fetching client:', err);
        setError(err.message || 'Failed to load client');
      } finally {
        setIsLoading(false);
      }
    }

    fetchClient();
  }, [id]);

  if (isLoading) {
    return <div className="p-4">Loading client information...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-600">Error: {error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Edit Client</h1>
      </div>
      {client ? (
        <ClientForm initialData={client} isEditing={true} />
      ) : (
        <div className="p-4">No client data available</div>
      )}
    </div>
  );
}