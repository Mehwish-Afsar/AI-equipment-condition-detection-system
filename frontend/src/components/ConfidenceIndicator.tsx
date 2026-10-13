interface ConfidenceIndicatorProps {
  value: number;
  condition?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function ConfidenceIndicator({ value, condition, size = 'md' }: ConfidenceIndicatorProps) {
  const color =
    condition === 'Damaged'
      ? 'bg-red-500'
      : condition === 'Uncertain'
      ? 'bg-amber-500'
      : 'bg-green-500';

  const heightClass = size === 'sm' ? 'h-1.5' : size === 'lg' ? 'h-3' : 'h-2';
  const textClass = size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-base' : 'text-sm';

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-1.5">
        <span className={`${textClass} font-medium text-gray-600`}>Confidence</span>
        <span className={`${textClass} font-semibold text-gray-900`}>{value.toFixed(1)}%</span>
      </div>
      <div className={`w-full ${heightClass} bg-gray-100 rounded-full overflow-hidden`}>
        <div
          className={`${heightClass} ${color} rounded-full transition-all duration-700 ease-out`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
