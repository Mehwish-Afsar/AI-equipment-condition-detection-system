import { useEffect, useState } from 'react';
import {
  Boxes,
  CheckCircle2,
  XCircle,
  Wrench,
  Plus,
  ArrowRight,
  Clock,
  Loader2,
} from 'lucide-react';
import StatCard from '@/components/StatCard';
import StatusBadge from '@/components/StatusBadge';
import ConfidenceIndicator from '@/components/ConfidenceIndicator';
import { equipmentData } from '@/data/mockData';
import type { PageId } from '@/components/Sidebar';
import type { Inspection, MaintenanceReport } from '@/types';

interface DashboardProps {
  onNavigate: (page: PageId) => void;
}

function mapInspection(row: any): Inspection {
  return {
    id: row.id,
    equipmentId: row.equipment_id ?? '—',
    equipment: row.equipment,
    image: row.image ?? '',
    prediction: row.prediction,
    confidence: row.confidence,
    inspector: row.inspector ?? 'AI Inspection',
    date: row.date,
    status: row.status,
    recommendation: row.recommendation ?? '',
  };
}

function mapReport(row: any): MaintenanceReport {
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

export default function Dashboard({ onNavigate }: DashboardProps) {
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [reports, setReports] = useState<MaintenanceReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch('http://localhost:5000/inspections').then((r) => (r.ok ? r.json() : Promise.reject())),
      fetch('http://localhost:5000/reports').then((r) => (r.ok ? r.json() : Promise.reject())),
    ])
      .then(([insp, rpts]) => {
        setInspections(insp.map(mapInspection));
        setReports(rpts.map(mapReport));
      })
      .catch(() => setFetchError(true))
      .finally(() => setLoading(false));
  }, []);

  // Equipment inventory counts still come from mock data (no equipment DB yet)
  const equipTotal = equipmentData.length;
  const equipNormal = equipmentData.filter((e) => e.condition === 'Normal').length;
  const equipDamaged = equipmentData.filter((e) => e.condition === 'Damaged').length;
  const equipUncertain = equipmentData.filter((e) => e.condition === 'Uncertain').length;

  // Pending maintenance now reflects real reports
  const pendingCount = reports.filter((r) => r.status === 'Pending' || r.status === 'In Progress').length;

  const recentInspections = inspections.slice(0, 4);
  const recentReports = reports.slice(0, 4);

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Equipment" value={equipTotal} icon={Boxes} accent="blue" />
        <StatCard label="Normal Equipment" value={equipNormal} icon={CheckCircle2} accent="green" />
        <StatCard label="Damaged Equipment" value={equipDamaged} icon={XCircle} accent="red" />
        <StatCard label="Pending Maintenance" value={pendingCount} icon={Wrench} accent="amber" />
      </div>

      {fetchError && (
        <div className="card p-4 text-sm text-red-600">
          Could not reach the backend. Make sure the Flask server is running on port 5000.
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card p-5 lg:col-span-1">
          <h3 className="text-sm font-semibold text-gray-900">Equipment Condition Overview</h3>
          <p className="text-xs text-gray-500 mt-0.5">Distribution across all assets</p>
          <div className="mt-5 flex items-center justify-center">
            <DonutChart normal={equipNormal} damaged={equipDamaged} uncertain={equipUncertain} />
          </div>
          <div className="mt-5 space-y-2">
            <LegendRow color="bg-green-500" label="Normal" value={equipNormal} total={equipTotal} />
            <LegendRow color="bg-red-500" label="Damaged" value={equipDamaged} total={equipTotal} />
            <LegendRow color="bg-amber-500" label="Uncertain" value={equipUncertain} total={equipTotal} />
          </div>
        </div>

        <div className="card lg:col-span-2 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Recent Inspections</h3>
              <p className="text-xs text-gray-500 mt-0.5">Latest AI analyses</p>
            </div>
            <button onClick={() => onNavigate('history')} className="text-sm font-medium text-blue-700 hover:text-blue-800 flex items-center gap-1">
              View all <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          {loading ? (
            <div className="flex items-center justify-center py-10 text-gray-400 gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm">Loading...</span>
            </div>
          ) : recentInspections.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {recentInspections.map((insp) => (
                <div key={insp.id} className="flex items-center gap-4 px-5 py-3 hover:bg-gray-50 transition-colors">
                  {insp.image ? (
                    <img src={insp.image} alt={insp.equipment} className="w-10 h-10 rounded-md object-cover bg-gray-100" />
                  ) : (
                    <div className="w-10 h-10 rounded-md bg-gray-100" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 truncate">{insp.equipment} <span className="text-gray-400 font-normal">· {insp.equipmentId}</span></p>
                    <p className="text-xs text-gray-500">{insp.inspector} · {insp.date}</p>
                  </div>
                  <div className="hidden sm:block w-28">
                    <ConfidenceIndicator value={insp.confidence} condition={insp.prediction} size="sm" />
                  </div>
                  <StatusBadge variant="condition" value={insp.prediction} />
                </div>
              ))}
            </div>
          ) : (
            <div className="px-5 py-10 text-center text-sm text-gray-400">No inspections yet. Run one from AI Inspection.</div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card lg:col-span-2 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Recent Maintenance Reports</h3>
              <p className="text-xs text-gray-500 mt-0.5">Open and recently resolved</p>
            </div>
            <button onClick={() => onNavigate('reports')} className="text-sm font-medium text-blue-700 hover:text-blue-800 flex items-center gap-1">
              View all <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          {loading ? (
            <div className="flex items-center justify-center py-10 text-gray-400 gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm">Loading...</span>
            </div>
          ) : recentReports.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {recentReports.map((r) => (
                <div key={r.id} className="flex items-center gap-4 px-5 py-3 hover:bg-gray-50 transition-colors">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 truncate">{r.equipment} <span className="text-gray-400 font-normal">· {r.equipmentId}</span></p>
                    <p className="text-xs text-gray-500 truncate">{r.issue}</p>
                  </div>
                  <StatusBadge variant="priority" value={r.priority} dot={false} />
                  <StatusBadge variant="status" value={r.status} />
                </div>
              ))}
            </div>
          ) : (
            <div className="px-5 py-10 text-center text-sm text-gray-400">No reports yet.</div>
          )}
        </div>

        <div className="card p-5 flex flex-col">
          <div className="p-3 rounded-lg bg-blue-50 inline-flex w-fit">
            <Plus className="w-5 h-5 text-blue-700" />
          </div>
          <h3 className="mt-4 text-base font-semibold text-gray-900">Start a New Inspection</h3>
          <p className="mt-1 text-sm text-gray-500">Upload an equipment photo and let the AI assess its condition in seconds.</p>
          <div className="mt-4 space-y-2 text-xs text-gray-500">
            <div className="flex items-center gap-2"><Clock className="w-3.5 h-3.5" /> Avg. analysis time: ~2s</div>
            <div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5" /> JPG, PNG, WEBP supported</div>
          </div>
          <button onClick={() => onNavigate('inspection')} className="btn-primary mt-5 w-full">
            <Plus className="w-4 h-4" /> New Inspection
          </button>
        </div>
      </div>
    </div>
  );
}

function DonutChart({ normal, damaged, uncertain }: { normal: number; damaged: number; uncertain: number }) {
  const total = normal + damaged + uncertain || 1;
  const c = 2 * Math.PI * 54;
  const seg = (val: number) => (val / total) * c;
  const normalLen = seg(normal);
  const damagedLen = seg(damaged);
  const uncertainLen = seg(uncertain);

  return (
    <div className="relative w-40 h-40">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r="54" fill="none" stroke="#f3f4f6" strokeWidth="12" />
        <circle cx="60" cy="60" r="54" fill="none" stroke="#22c55e" strokeWidth="12" strokeDasharray={`${normalLen} ${c - normalLen}`} strokeDashoffset="0" />
        <circle cx="60" cy="60" r="54" fill="none" stroke="#ef4444" strokeWidth="12" strokeDasharray={`${damagedLen} ${c - damagedLen}`} strokeDashoffset={-normalLen} />
        <circle cx="60" cy="60" r="54" fill="none" stroke="#f59e0b" strokeWidth="12" strokeDasharray={`${uncertainLen} ${c - uncertainLen}`} strokeDashoffset={-(normalLen + damagedLen)} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-gray-900">{total}</span>
        <span className="text-xs text-gray-500">Total</span>
      </div>
    </div>
  );
}

function LegendRow({ color, label, value, total }: { color: string; label: string; value: number; total: number }) {
  const pct = total ? Math.round((value / total) * 100) : 0;
  return (
    <div className="flex items-center justify-between text-sm">
      <div className="flex items-center gap-2">
        <span className={`w-2.5 h-2.5 rounded-full ${color}`} />
        <span className="text-gray-600">{label}</span>
      </div>
      <span className="text-gray-900 font-medium">{value} <span className="text-gray-400">({pct}%)</span></span>
    </div>
  );
}