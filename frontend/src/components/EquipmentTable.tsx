import { Eye, Pencil, Trash2 } from 'lucide-react';
import type { Equipment } from '@/types';
import StatusBadge from './StatusBadge';

interface EquipmentTableProps {
  items: Equipment[];
  onView?: (e: Equipment) => void;
  compact?: boolean;
}

export default function EquipmentTable({ items, onView, compact }: EquipmentTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 text-left">
            <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Equipment ID</th>
            <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Equipment</th>
            <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Category</th>
            <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Location</th>
            <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Condition</th>
            {!compact && <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>}
            {!compact && <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Last Inspection</th>}
            <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {items.map((e) => (
            <tr key={e.id} className="table-row-hover transition-colors">
              <td className="px-4 py-3 font-medium text-blue-700">{e.id}</td>
              <td className="px-4 py-3 text-gray-900">{e.name}</td>
              <td className="px-4 py-3 text-gray-600">{e.category}</td>
              <td className="px-4 py-3 text-gray-600">{e.location}</td>
              <td className="px-4 py-3"><StatusBadge variant="condition" value={e.condition} /></td>
              {!compact && <td className="px-4 py-3 text-gray-600">{e.status}</td>}
              {!compact && <td className="px-4 py-3 text-gray-500">{e.lastInspection}</td>}
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-1">
                  {onView && (
                    <button
                      onClick={() => onView(e)}
                      className="p-1.5 text-gray-400 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
                      aria-label="View"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  )}
                  <button className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors" aria-label="Edit">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors" aria-label="Delete">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
