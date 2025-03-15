// src/app/dashboard/clients/new/page.tsx
import ClientForm from '../../../../components/clients/clients-form';

export const metadata = {
  title: 'New Client | Visa Assessment System',
  description: 'Add a new client',
};

export default function NewClientPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Add New Client</h1>
      </div>
      <ClientForm />
    </div>
  );
}