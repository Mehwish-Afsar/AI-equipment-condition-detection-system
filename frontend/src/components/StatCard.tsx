import type { LucideIcon } from 'lucide-react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  trend?: { value: string; direction: 'up' | 'down' };
  accent?: 'blue' | 'green' | 'red' | 'amber';
}

const accentStyles = {
  blue: 'bg-blue-50 text-blue-700',
  green: 'bg-green-50 text-green-700',
  red: 'bg-red-50 text-red-700',
  amber: 'bg-amber-50 text-amber-700',
};

export default function StatCard({ label, value, icon: Icon, trend, accent = 'blue' }: StatCardProps) {
  return (
    <div className="card p-5 transition-shadow duration-200 hover:shadow-card-hover animate-fade-in">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{label}</p>
          <p className="mt-2 text-2xl font-semibold text-gray-900">{value}</p>
        </div>
        <div className={`p-2.5 rounded-lg ${accentStyles[accent]}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      {trend && (
        <div className="mt-3 flex items-center gap-1 text-xs">
          {trend.direction === 'up' ? (
            <ArrowUpRight className="w-3.5 h-3.5 text-green-600" />
          ) : (
            <ArrowDownRight className="w-3.5 h-3.5 text-red-600" />
          )}
          <span className={trend.direction === 'up' ? 'text-green-600' : 'text-red-600'}>
            {trend.value}
          </span>
          <span className="text-gray-400">vs last month</span>
        </div>
      )}
    </div>
  );
}
