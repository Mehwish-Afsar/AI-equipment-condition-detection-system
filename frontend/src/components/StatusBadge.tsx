import type { Condition, MaintenanceStatus, Priority } from '@/types';

type Variant = 'condition' | 'status' | 'priority';

const conditionStyles: Record<Condition, string> = {
  Normal: 'bg-green-50 text-green-700 border-green-200',
  Damaged: 'bg-red-50 text-red-700 border-red-200',
  Uncertain: 'bg-amber-50 text-amber-700 border-amber-200',
};

const statusStyles: Record<MaintenanceStatus, string> = {
  Pending: 'bg-amber-50 text-amber-700 border-amber-200',
  'In Progress': 'bg-blue-50 text-blue-700 border-blue-200',
  Resolved: 'bg-green-50 text-green-700 border-green-200',
};

const priorityStyles: Record<Priority, string> = {
  Low: 'bg-gray-50 text-gray-700 border-gray-200',
  Medium: 'bg-amber-50 text-amber-700 border-amber-200',
  High: 'bg-orange-50 text-orange-700 border-orange-200',
  Critical: 'bg-red-50 text-red-700 border-red-200',
};

interface StatusBadgeProps {
  variant: Variant;
  value: Condition | MaintenanceStatus | Priority;
  dot?: boolean;
}

export default function StatusBadge({ variant, value, dot = true }: StatusBadgeProps) {
  const styles =
    variant === 'condition'
      ? conditionStyles[value as Condition]
      : variant === 'status'
      ? statusStyles[value as MaintenanceStatus]
      : priorityStyles[value as Priority];

  const dotColor =
    variant === 'condition'
      ? (value as Condition) === 'Normal'
        ? 'bg-green-500'
        : (value as Condition) === 'Damaged'
        ? 'bg-red-500'
        : 'bg-amber-500'
      : variant === 'status'
      ? (value as MaintenanceStatus) === 'Resolved'
        ? 'bg-green-500'
        : (value as MaintenanceStatus) === 'In Progress'
        ? 'bg-blue-500'
        : 'bg-amber-500'
      : (value as Priority) === 'Critical'
      ? 'bg-red-500'
      : (value as Priority) === 'High'
      ? 'bg-orange-500'
      : (value as Priority) === 'Medium'
      ? 'bg-amber-500'
      : 'bg-gray-500';

  return (
    <span className={`badge ${styles}`}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />}
      {value}
    </span>
  );
}
