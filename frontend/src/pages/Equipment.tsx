import { useEffect, useMemo, useState } from 'react';
import { Search, Filter, X, MapPin, Calendar, ArrowLeft, Loader2 } from 'lucide-react';
import EquipmentTable from '@/components/EquipmentTable';
import StatusBadge from '@/components/StatusBadge';
import EmptyState from '@/components/EmptyState';
import Modal from '@/components/Modal';
import type { Equipment, Condition } from '@/types';

const API_URL = 'http://localhost:5000/equipment';
const categories = ['All', 'Computer', 'Projector', 'Monitor', 'Furniture'];
const conditions: ('All' | Condition)[] = ['All', 'Normal', 'Damaged', 'Uncertain'];

function mapEquipment(row: any): Equipment {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    location: row.location,
    condition: row.condition,
    status: row.status,
    lastInspection: row.last_inspection,
    image: row.image ?? undefined,
  };
}

export default function EquipmentPage() {
  const [equipmentData, setEquipmentData] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [condition, setCondition] = useState<'All' | Condition>('All');
  const [selected, setSelected] = useState<Equipment | null>(null);

  useEffect(() => {
    fetch(API_URL)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load equipment');
        return res.json();
      })
      .then((data) => setEquipmentData(data.map(mapEquipment)))
      .catch(() => setFetchError(true))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return equipmentData.filter((e) => {
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        e.id.toLowerCase().includes(q) ||
        e.name.toLowerCase().includes(q) ||
        e.location.toLowerCase().includes(q);
      const matchesCat = category === 'All' || e.category === category;
      const matchesCond = condition === 'All' || e.condition === condition;
      return matchesSearch && matchesCat && matchesCond;
    });
  }, [equipmentData, search, category, condition]);

  const hasFilters = search || category !== 'All' || condition !== 'All';

  return (
    <div className="p-4 sm:p-6 space-y-4 max-w-7xl mx-auto">
      <div className="card p-4">
        <div className="flex flex-col lg:flex-row gap-3 lg:items-center">
          <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-md flex-1">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by ID, name, or location..."
              className="bg-transparent text-sm outline-none flex-1 placeholder:text-gray-400"
            />
            {search && (
              <button onClick={() => setSearch('')} className="text-gray-400 hover:text-gray-700">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <div className="flex gap-3">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="input !py-1.5 !w-auto">
                {categories.map((c) => (
                  <option key={c} value={c}>{c === 'All' ? 'All Categories' : c}</option>
                ))}
              </select>
            </div>
            <select value={condition} onChange={(e) => setCondition(e.target.value as 'All' | Condition)} className="input !py-1.5 !w-auto">
              {conditions.map((c) => (
                <option key={c} value={c}>{c === 'All' ? 'All Conditions' : c}</option>
              ))}
            </select>
          </div>
        </div>
        {hasFilters && (
          <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
            <span>Showing {filtered.length} of {equipmentData.length} items</span>
            <button
              onClick={() => { setSearch(''); setCategory('All'); setCondition('All'); }}
              className="text-blue-700 hover:text-blue-800 font-medium"
            >
              Clear filters
            </button>
          </div>
        )}
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
            <span className="text-sm">Loading equipment...</span>
          </div>
        ) : filtered.length > 0 ? (
          <EquipmentTable items={filtered} onView={(e) => setSelected(e)} />
        ) : (
          <EmptyState icon={Search} title="No equipment found" description="Try adjusting your search or filters." />
        )}
      </div>

      <Modal open={!!selected} onClose={() => setSelected(null)} title="Equipment Details" size="lg">
        {selected && <EquipmentDetail equipment={selected} onClose={() => setSelected(null)} />}
      </Modal>
    </div>
  );
}

function EquipmentDetail({ equipment, onClose }: { equipment: Equipment; onClose: () => void }) {
  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row gap-5">
        <div className="w-full sm:w-48 h-48 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0">
          <img src={equipment.image} alt={equipment.name} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-gray-900">{equipment.name}</h3>
            <span className="text-sm text-blue-700 font-medium">{equipment.id}</span>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-4">
            <DetailRow label="Category" value={equipment.category} />
            <DetailRow label="Location" value={<span className="inline-flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-gray-400" />{equipment.location}</span>} />
            <DetailRow label="Condition" value={<StatusBadge variant="condition" value={equipment.condition} />} />
            <DetailRow label="Status" value={equipment.status} />
            <DetailRow label="Last Inspection" value={<span className="inline-flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-gray-400" />{equipment.lastInspection}</span>} />
          </div>
        </div>
      </div>
      <div className="flex justify-end pt-2 border-t border-gray-100">
        <button onClick={onClose} className="btn-secondary">
          <ArrowLeft className="w-4 h-4" /> Close
        </button>
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</p>
      <p className="mt-1 text-sm font-semibold text-gray-900">{value}</p>
    </div>
  );
}