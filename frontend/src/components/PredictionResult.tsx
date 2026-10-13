import { AlertTriangle, CheckCircle2, XCircle, HelpCircle, Wrench, RefreshCw, FileText } from 'lucide-react';
import type { PredictionResponse } from '@/types';
import StatusBadge from './StatusBadge';
import ConfidenceIndicator from './ConfidenceIndicator';

interface PredictionResultProps {
  prediction: PredictionResponse;
  image: string | null;
  onGenerateReport: () => void;
  onAnalyzeAnother: () => void;
  generating?: boolean;
}

const conditionConfig = {
  Normal: {
    icon: CheckCircle2,
    color: 'text-green-600',
    bg: 'bg-green-50',
    border: 'border-green-200',
    label: 'Normal',
  },
  Damaged: {
    icon: XCircle,
    color: 'text-red-600',
    bg: 'bg-red-50',
    border: 'border-red-200',
    label: 'Damaged',
  },
  Uncertain: {
    icon: HelpCircle,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    label: 'Uncertain',
  },
} as const;

export default function PredictionResult({
  prediction,
  image,
  onGenerateReport,
  onAnalyzeAnother,
  generating,
}: PredictionResultProps) {
  const cfg = conditionConfig[prediction.condition];
  const Icon = cfg.icon;

  const rows = [
    { label: 'Equipment', value: prediction.equipment },
    { label: 'Condition', value: <StatusBadge variant="condition" value={prediction.condition} /> },
    { label: 'Confidence', value: `${prediction.confidence.toFixed(1)}%` },
    {
      label: 'Maintenance',
      value: prediction.maintenance_required ? (
        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-red-700">
          <Wrench className="w-4 h-4" /> Required
        </span>
      ) : (
        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-green-700">
          <CheckCircle2 className="w-4 h-4" /> Not Required
        </span>
      ),
    },
    { label: 'Priority', value: <StatusBadge variant="priority" value={prediction.priority} /> },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 animate-slide-up">
      <div className="lg:col-span-2">
        <div className="card overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200">
            <p className="text-sm font-semibold text-gray-900">Uploaded Image</p>
          </div>
          {image ? (
            <img src={image} alt="Analyzed equipment" className="w-full max-h-80 object-contain bg-gray-50" />
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-400 text-sm">No image</div>
          )}
        </div>
      </div>

      <div className="lg:col-span-3 space-y-4">
        <div className={`card p-5 border ${cfg.border}`}>
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-lg ${cfg.bg}`}>
              <Icon className={`w-6 h-6 ${cfg.color}`} />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">AI Prediction</p>
              <p className={`text-lg font-bold ${cfg.color}`}>
                {prediction.condition === 'Damaged' && 'Equipment Damaged'}
                {prediction.condition === 'Normal' && 'Equipment Normal'}
                {prediction.condition === 'Uncertain' && 'Manual Review Needed'}
              </p>
            </div>
          </div>
        </div>

        <div className="card p-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
            {rows.map((r) => (
              <div key={r.label} className="flex flex-col">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">{r.label}</span>
                <span className="mt-1 text-sm font-semibold text-gray-900">{r.value}</span>
              </div>
            ))}
          </div>
          <div className="mt-5">
            <ConfidenceIndicator value={prediction.confidence} condition={prediction.condition} size="md" />
          </div>
        </div>

        {prediction.recommendation && (
          <div className="card p-5">
            <div className="flex items-start gap-3">
              {prediction.condition === 'Damaged' ? (
                <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              ) : prediction.condition === 'Uncertain' ? (
                <HelpCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              ) : (
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              )}
              <div>
                <p className="text-sm font-semibold text-gray-900">AI Recommendation</p>
                <p className="mt-1 text-sm text-gray-600 leading-relaxed">{prediction.recommendation}</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onGenerateReport}
            disabled={generating}
            className="btn-primary flex-1"
          >
            <FileText className="w-4 h-4" />
            {generating ? 'Generating...' : 'Generate Maintenance Report'}
          </button>
          <button onClick={onAnalyzeAnother} className="btn-secondary flex-1">
            <RefreshCw className="w-4 h-4" />
            Analyze Another Image
          </button>
        </div>
      </div>
    </div>
  );
}
