// src/app/dashboard/clients/page.tsx
import ClientList from '@/components/clients/client-list';

export const metadata = {
  title: 'Clients | Visa Assessment System',
  description: 'Manage your clients',
};

export default function ClientsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Client Management</h1>
      </div>
      <ClientList />
    </div>
  );
}