import { useState, useCallback } from 'react';
import { ScanLine, Sparkles, Info } from 'lucide-react';
import ImageUploader from '@/components/ImageUploader';
import LoadingState from '@/components/LoadingState';
import PredictionResult from '@/components/PredictionResult';
import type { PredictionResponse, Condition, Priority } from '@/types';

const API_URL = 'http://localhost:5000/predict';

const conditionMap: Record<string, Condition> = {
  NORMAL: 'Normal',
  DAMAGED: 'Damaged',
  UNCERTAIN: 'Uncertain',
};

const priorityMap: Record<string, Priority> = {
  None: 'Low',
  Medium: 'Medium',
  High: 'High',
  Review: 'Medium',
};

async function predictEquipment(imageDataUrl: string): Promise<PredictionResponse> {
  const blob = await (await fetch(imageDataUrl)).blob();
  const formData = new FormData();
  formData.append('image', blob, 'equipment.jpg');

  const response = await fetch(API_URL, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Prediction request failed (${response.status})`);
  }

  const data = await response.json();

  return {
    equipment: data.equipment,
    condition: conditionMap[data.condition] ?? 'Uncertain',
    confidence: data.confidence,
    maintenance_required: data.maintenance_required,
    priority: priorityMap[data.priority] ?? 'Medium',
    recommendation: data.recommendation,
  };
}

type Phase = 'idle' | 'analyzing' | 'result';

export default function Inspection() {
  const [image, setImage] = useState<string | null>(null);
  const [phase, setPhase] = useState<Phase>('idle');
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
  const [generating, setGenerating] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = useCallback(async () => {
    if (!image) return;
    setPhase('analyzing');
    setError(null);
    try {
      const result = await predictEquipment(image);
      setPrediction(result);
      setPhase('result');
    } catch (err) {
      setError('Could not reach the AI backend. Make sure the Flask server is running on port 5000.');
      setPhase('idle');
    }
  }, [image]);

  const handleAnalyzeAnother = () => {
    setImage(null);
    setPrediction(null);
    setPhase('idle');
  };

  const handleGenerateReport = async () => {
    if (!prediction) return;
    setGenerating(true);
    try {
      const response = await fetch('http://localhost:5000/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          equipment: prediction.equipment,
          condition: prediction.condition,
          confidence: prediction.confidence,
          maintenance_required: prediction.maintenance_required,
          priority: prediction.priority,
          recommendation: prediction.recommendation || '',
          issue: prediction.recommendation || `${prediction.equipment} flagged as ${prediction.condition}`,
        }),
      });

      if (!response.ok) throw new Error('Report creation failed');

      const data = await response.json();
      alert(`Maintenance report ${data.id} generated. Check the Maintenance Reports page.`);
    } catch (err) {
      alert('Failed to generate report — is the backend running?');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto">
      {phase === 'idle' && (
        <div className="space-y-6 animate-fade-in">
          <div className="card p-6 sm:p-8">
            <div className="flex flex-col items-center text-center mb-6">
              <div className="p-3 rounded-full bg-blue-50">
                <ScanLine className="w-7 h-7 text-blue-700" />
              </div>

              <h2 className="mt-3 text-lg font-semibold text-gray-900">AI Equipment Inspection</h2>
              <p className="mt-1 text-sm text-gray-500 max-w-md">
                Upload a photo of university equipment. The AI will analyze the image and classify its condition, report a confidence score, and recommend maintenance.
              </p>
            </div>
            {error && <p className="text-sm text-red-600 mb-4 text-center">{error}</p>}

            <ImageUploader image={image} onImageChange={setImage} disabled={phase !== 'idle'} />

            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-start gap-2 text-xs text-gray-500 max-w-md">
                <Info className="w-4 h-4 flex-shrink-0 mt-0.5 text-gray-400" />
                <p>For best results, capture the equipment in good lighting, centered in frame, with any visible damage clearly visible.</p>
              </div>
              <button
                onClick={handleAnalyze}
                disabled={!image}
                className="btn-primary w-full sm:w-auto sm:min-w-[200px]"
              >
                <Sparkles className="w-4 h-4" />
                Analyze Equipment
              </button>
            </div>
          </div>
        </div>
      )}

      {phase === 'analyzing' && (
        <div className="card p-6 sm:p-8">
          {image && (
            <div className="max-w-sm mx-auto mb-6">
              <img src={image} alt="Analyzing" className="w-full max-h-64 object-contain rounded-lg border border-gray-200 bg-gray-50" />
            </div>
          )}
          <LoadingState message="Analyzing equipment..." submessage="Running AI condition detection model" />
        </div>
      )}

      {phase === 'result' && prediction && (
        <PredictionResult
          prediction={prediction}
          image={image}
          onGenerateReport={handleGenerateReport}
          onAnalyzeAnother={handleAnalyzeAnother}
          generating={generating}
        />
      )}
    </div>
  );
}
