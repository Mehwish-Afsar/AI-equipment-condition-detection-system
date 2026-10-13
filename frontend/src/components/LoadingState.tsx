import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
  submessage?: string;
}

export default function LoadingState({ message = 'Analyzing image...', submessage }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
      <div className="relative">
        <div className="w-16 h-16 rounded-full border-4 border-blue-100" />
        <Loader2 className="absolute inset-0 m-auto w-16 h-16 text-blue-700 animate-spin" strokeWidth={2} />
      </div>
      <p className="mt-6 text-base font-semibold text-gray-900">{message}</p>
      {submessage && <p className="mt-1 text-sm text-gray-500">{submessage}</p>}
      <div className="mt-4 flex gap-1.5">
        <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse-slow" />
        <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse-slow" style={{ animationDelay: '0.2s' }} />
        <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse-slow" style={{ animationDelay: '0.4s' }} />
      </div>
    </div>
  );
}
