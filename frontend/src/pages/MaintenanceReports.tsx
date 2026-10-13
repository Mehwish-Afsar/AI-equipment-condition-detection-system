import { useEffect, useMemo, useState } from 'react';
import { Search, Filter, X, Eye, Wrench, Loader2 } from 'lucide-react';
import StatusBadge from '@/components/StatusBadge';
import EmptyState from '@/components/EmptyState';
import Modal from '@/components/Modal';
import MaintenanceReportView from '@/components/MaintenanceReport';
import type { MaintenanceStatus, MaintenanceReport as Report } from '@/types';

const API_URL = 'http://localhost:5000/reports';
const statuses: ('All' | MaintenanceStatus)[] = ['All', 'Pending', 'In Progress', 'Resolved'];

function mapReport(row: any): Report {
  return {
    id: row.id,
    equipmentId: row.equipment_id ?? '—',
    equipment: row.equipment,
    location: row.location ?? 'Unspecified',
    issue: row.issue ?? '',
    priority: row.priority,
    date: row.date,
    status: row.status,
    condition: row.condition,
    confidence: row.confidence,
    inspectionDate: row.inspection_date,
    maintenanceRequired: !!row.maintenance_required,
    recommendation: row.recommendation ?? '',
    inspector: row.inspector ?? 'AI Inspection',
  };
}

export default function MaintenanceReports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<'All' | MaintenanceStatus>('All');
  const [selected, setSelected] = useState<Report | null>(null);

  useEffect(() => {
    fetch(API_URL)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load reports');
        return res.json();
      })
      .then((data) => setReports(data.map(mapReport)))
      .catch(() => setFetchError(true))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return reports.filter((r) => {
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        r.id.toLowerCase().includes(q) ||
        r.equipment.toLowerCase().includes(q) ||
        r.equipmentId.toLowerCase().includes(q) ||
        r.issue.toLowerCase().includes(q);
      const matchesStatus = status === 'All' || r.status === status;
      return matchesSearch && matchesStatus;
    });
  }, [reports, search, status]);

  return (
    <div className="p-4 sm:p-6 space-y-4 max-w-7xl mx-auto">
      <div className="card p-4">
        <div className="flex flex-col lg:flex-row gap-3 lg:items-center">
          <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-md flex-1">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by report ID, equipment, or issue..."
              className="bg-transparent text-sm outline-none flex-1 placeholder:text-gray-400"
            />
            {search && (
              <button onClick={() => setSearch('')} className="text-gray-400 hover:text-gray-700">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select value={status} onChange={(e) => setStatus(e.target.value as 'All' | MaintenanceStatus)} className="input !py-1.5 !w-auto">
              {statuses.map((s) => (
                <option key={s} value={s}>{s === 'All' ? 'All Statuses' : s}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {fetchError && (
        <div className="card p-4 text-sm text-red-600">
          Could not reach the backend. Make sure the Flask server is running on port 5000.
        </div>
      )}

      <div className="card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-gray-400 gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm">Loading reports...</span>
          </div>
        ) : filtered.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left">
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Report ID</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Equipment</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Issue</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Priority</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Date</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((r) => (
                  <tr key={r.id} className="table-row-hover transition-colors">
                    <td className="px-4 py-3 font-medium text-blue-700">{r.id}</td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">{r.equipment}</p>
                      <p className="text-xs text-gray-500">{r.equipmentId}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-600 max-w-xs truncate">{r.issue}</td>
                    <td className="px-4 py-3"><StatusBadge variant="priority" value={r.priority} dot={false} /></td>
                    <td className="px-4 py-3 text-gray-500">{r.date}</td>
                    <td className="px-4 py-3"><StatusBadge variant="status" value={r.status} /></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setSelected(r)}
                          className="p-1.5 text-gray-400 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
                          aria-label="View report"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState icon={Wrench} title="No reports found" description="Try adjusting your search or status filter." />
        )}
      </div>

      <Modal open={!!selected} onClose={() => setSelected(null)} size="xl">
        {selected && <MaintenanceReportView report={selected} onClose={() => setSelected(null)} />}
      </Modal>
    </div>
  );
}