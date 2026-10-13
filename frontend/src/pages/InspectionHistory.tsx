import { useEffect, useMemo, useState } from 'react';
import { Search, Filter, X, ImageOff, Loader2 } from 'lucide-react';
import StatusBadge from '@/components/StatusBadge';
import ConfidenceIndicator from '@/components/ConfidenceIndicator';
import EmptyState from '@/components/EmptyState';
import type { Condition, Inspection } from '@/types';

const API_URL = 'http://localhost:5000/inspections';
const filters: ('All' | Condition)[] = ['All', 'Normal', 'Damaged', 'Uncertain'];

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

export default function InspectionHistory() {
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'All' | Condition>('All');

  useEffect(() => {
    fetch(API_URL)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load inspections');
        return res.json();
      })
      .then((data) => setInspections(data.map(mapInspection)))
      .catch(() => setFetchError(true))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return inspections.filter((i) => {
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        i.equipment.toLowerCase().includes(q) ||
        i.equipmentId.toLowerCase().includes(q) ||
        i.inspector.toLowerCase().includes(q) ||
        i.id.toLowerCase().includes(q);
      const matchesFilter = filter === 'All' || i.prediction === filter;
      return matchesSearch && matchesFilter;
    });
  }, [inspections, search, filter]);

  return (
    <div className="p-4 sm:p-6 space-y-4 max-w-7xl mx-auto">
      <div className="card p-4">
        <div className="flex flex-col lg:flex-row gap-3 lg:items-center">
          <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-md flex-1">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by equipment, ID, or inspector..."
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
            <div className="flex gap-1 bg-gray-50 border border-gray-200 rounded-md p-0.5">
              {filters.map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                    filter === f ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
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
            <span className="text-sm">Loading inspections...</span>
          </div>
        ) : filtered.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left">
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Equipment</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Image</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Prediction</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Confidence</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Inspector</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Date</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((i) => (
                  <tr key={i.id} className="table-row-hover transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">{i.equipment}</p>
                      <p className="text-xs text-gray-500">{i.equipmentId}</p>
                    </td>
                    <td className="px-4 py-3">
                      {i.image ? (
                        <img
                          src={i.image}
                          alt={i.equipment}
                          className="w-10 h-10 rounded-md object-cover bg-gray-100"
                          onError={(e) => { (e.currentTarget.style.display = 'none'); }}
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-md bg-gray-100 flex items-center justify-center">
                          <ImageOff className="w-4 h-4 text-gray-400" />
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3"><StatusBadge variant="condition" value={i.prediction} /></td>
                    <td className="px-4 py-3 w-32">
                      <ConfidenceIndicator value={i.confidence} condition={i.prediction} size="sm" />
                    </td>
                    <td className="px-4 py-3 text-gray-600">{i.inspector}</td>
                    <td className="px-4 py-3 text-gray-500">{i.date}</td>
                    <td className="px-4 py-3"><StatusBadge variant="status" value={i.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState icon={ImageOff} title="No inspections found" description="Try adjusting your search or filter." />
        )}
      </div>
    </div>
  );
}