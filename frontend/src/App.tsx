import { useState } from 'react';
import Sidebar, { type PageId } from '@/components/Sidebar';
import Header from '@/components/Header';
import Dashboard from '@/pages/Dashboard';
import Inspection from '@/pages/Inspection';
import EquipmentPage from '@/pages/Equipment';
import InspectionHistory from '@/pages/InspectionHistory';
import MaintenanceReports from '@/pages/MaintenanceReports';

const pageMeta: Record<PageId, { title: string; subtitle: string }> = {
  dashboard: { title: 'Dashboard', subtitle: 'Overview of equipment condition and maintenance' },
  inspection: { title: 'AI Equipment Inspection', subtitle: 'Upload an image for AI condition analysis' },
  equipment: { title: 'Equipment', subtitle: 'Manage and track all university equipment' },
  history: { title: 'Inspection History', subtitle: 'Record of all AI inspections' },
  reports: { title: 'Maintenance Reports', subtitle: 'Track and manage maintenance reports' },
};

export default function App() {
  const [page, setPage] = useState<PageId>('dashboard');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const meta = pageMeta[page];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar
        current={page}
        onNavigate={setPage}
        mobileOpen={mobileNavOpen}
        onCloseMobile={() => setMobileNavOpen(false)}
      />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header
          title={meta.title}
          subtitle={meta.subtitle}
          onMenuClick={() => setMobileNavOpen(true)}
        />
        <main className="flex-1 overflow-y-auto">
          <div key={page} className="animate-fade-in">
            {page === 'dashboard' && <Dashboard onNavigate={setPage} />}
            {page === 'inspection' && <Inspection />}
            {page === 'equipment' && <EquipmentPage />}
            {page === 'history' && <InspectionHistory />}
            {page === 'reports' && <MaintenanceReports />}
          </div>
        </main>
      </div>
    </div>
  );
}
