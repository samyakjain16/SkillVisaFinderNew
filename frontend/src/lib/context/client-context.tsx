// src/lib/context/client-context.tsx
'use client';
import { useAuth } from './auth-context';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '@/lib/api';

export type Client = {
  id: string;
  full_name: string;
  email?: string;
  phone?: string;
  date_of_birth?: string;
  passport_number?: string;
  nationality?: string;
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
};

const ClientContext = createContext<ClientContextType | undefined>(undefined);

export function ClientProvider({ children }: { children: ReactNode }) {
  const { user, isLoading: isAuthLoading } = useAuth(); //enw
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
      refreshClients
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