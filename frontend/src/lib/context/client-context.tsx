// src/lib/context/client-context.tsx
'use client';
import { useAuth } from './auth-context';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '@/lib/api';

// src/lib/context/client-context.tsx
// Update the Client type definition

export type Client = {
  id: string;
  full_name: string;
  email?: string;
  phone?: string;
  date_of_birth?: string;
  passport_number?: string;
  nationality?: string;
  
  // Add these new fields
  first_name?: string;
  middle_name?: string;
  last_name?: string;
  gender?: string;
  marital_status?: string;
  passport_expiry?: string;
  passport_issuing_country?: string;
  address?: string;
  
  // Add fields for education and experience
  education?: any[];
  experience?: any[];
};

type ClientContextType = {
  clients: Client[];
  selectedClient: Client | null;
  isLoading: boolean;
  error: string | null;
  selectClient: (clientId: string) => void;
  createClient: (clientData: Omit<Client, 'id'>) => Promise<Client>;
  updateClient: (id: string, clientData: Partial<Client>) => Promise<Client>;
  refreshClients: () => Promise<void>;
  refreshClientData: (clientId: string) => Promise<void>;
};

const ClientContext = createContext<ClientContextType | undefined>(undefined);

export function ClientProvider({ children }: { children: ReactNode }) {
  const { user, isLoading: isAuthLoading } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch clients only after authentication is confirmed
  useEffect(() => {
    if (user && !isAuthLoading) {
      fetchClients();
    }
  }, [user, isAuthLoading]);

  const fetchClients = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await api.request('/visa-assessment/clients') as Client[];
      setClients(data || []);
      
      // If there are clients and none is selected, select the first one
      if (data && data.length > 0 && !selectedClient) {
        setSelectedClient(data[0]);
      }
    } catch (err: any) {
      console.error('Error fetching clients:', err);
      setError(err.message || 'Failed to load clients');
    } finally {
      setIsLoading(false);
    }
  };

  const selectClient = (clientId: string) => {
    const client = clients.find(c => c.id === clientId) || null;
    setSelectedClient(client);
  };

  const createClient = async (clientData: Omit<Client, 'id'>): Promise<Client> => {
    try {
      setIsLoading(true);
      setError(null);
      const newClient = await api.request('/visa-assessment/clients', {
        method: 'POST',
        body: JSON.stringify(clientData)
      }) as Client;
      
      // Add to clients list and select it
      setClients(prev => [...prev, newClient]);
      setSelectedClient(newClient);
      
      return newClient;
    } catch (err: any) {
      console.error('Error creating client:', err);
      setError(err.message || 'Failed to create client');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateClient = async (id: string, clientData: Partial<Client>): Promise<Client> => {
    try {
      setIsLoading(true);
      setError(null);
      const updatedClient = await api.request(`/visa-assessment/clients/${id}`, {
        method: 'PUT',
        body: JSON.stringify(clientData)
      }) as Client;
      
      // Update clients list
      setClients(prev => prev.map(c => c.id === id ? updatedClient : c));
      
      // Update selected client if it's the one being edited
      if (selectedClient && selectedClient.id === id) {
        setSelectedClient(updatedClient);
      }
      
      return updatedClient;
    } catch (err: any) {
      console.error('Error updating client:', err);
      setError(err.message || 'Failed to update client');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const refreshClientData = async (clientId: string) => {
    if (!clientId) return;
    
    try {
      setIsLoading(true);
      setError(null);
      const clientData = await api.request(`/visa-assessment/clients/${clientId}`) as Client;
      
      // Update in clients list
      setClients(prev => prev.map(c => c.id === clientId ? clientData : c));
      
      // Update selected client if it's the one being refreshed
      if (selectedClient && selectedClient.id === clientId) {
        setSelectedClient(clientData);
      }
    } catch (err: any) {
      console.error('Error refreshing client data:', err);
      setError(err.message || 'Failed to refresh client data');
    } finally {
      setIsLoading(false);
    }
  };

  const refreshClients = fetchClients;

  return (
    <ClientContext.Provider value={{
      clients,
      selectedClient,
      isLoading: isLoading || isAuthLoading,
      error,
      selectClient,
      createClient,
      updateClient,
      refreshClients,
      refreshClientData
    }}>
      {children}
    </ClientContext.Provider>
  );
}

export function useClient() {
  const context = useContext(ClientContext);
  if (context === undefined) {
    throw new Error('useClient must be used within a ClientProvider');
  }
  return context;
}