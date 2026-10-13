import { useRef, useState, useCallback } from 'react';
import { UploadCloud, ImageIcon, X } from 'lucide-react';

interface ImageUploaderProps {
  image: string | null;
  onImageChange: (image: string | null) => void;
  disabled?: boolean;
}

const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp'];

export default function ImageUploader({ image, onImageChange, disabled }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback(
    (file: File) => {
      setError(null);
      if (!ACCEPTED.includes(file.type)) {
        setError('Please upload a JPG, PNG, or WEBP image.');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setError('Image must be smaller than 10MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => onImageChange(reader.result as string);
      reader.readAsDataURL(file);
    },
    [onImageChange]
  );

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (disabled) return;
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div className="w-full">
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = '';
        }}
      />
      {!image ? (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            if (!disabled) setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          onClick={() => !disabled && inputRef.current?.click()}
          className={`relative flex flex-col items-center justify-center px-6 py-16 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-200 ${
            dragging
              ? 'border-blue-500 bg-blue-50 scale-[1.01]'
              : 'border-gray-300 bg-gray-50/50 hover:border-blue-400 hover:bg-blue-50/30'
          } ${disabled ? 'opacity-60 pointer-events-none' : ''}`}
        >
          <div className={`p-4 rounded-full transition-colors ${dragging ? 'bg-blue-100' : 'bg-gray-100'}`}>
            <UploadCloud className={`w-8 h-8 transition-colors ${dragging ? 'text-blue-600' : 'text-gray-400'}`} />
          </div>
          <p className="mt-4 text-sm font-semibold text-gray-900">
            {dragging ? 'Drop image to upload' : 'Drag and drop an equipment image'}
          </p>
          <p className="mt-1 text-sm text-gray-500">or click to browse files</p>
          <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
            <ImageIcon className="w-3.5 h-3.5" />
            <span>JPG, PNG, WEBP — max 10MB</span>
          </div>
        </div>
      ) : (
        <div className="relative rounded-lg overflow-hidden border border-gray-200 bg-gray-50 animate-scale-in">
          <img src={image} alt="Equipment preview" className="w-full max-h-[420px] object-contain bg-gray-50" />
          <div className="absolute top-3 right-3 flex gap-2">
            <button
              onClick={() => inputRef.current?.click()}
              disabled={disabled}
              className="btn-secondary !py-1.5 !px-3 shadow-sm"
            >
              Change
            </button>
            <button
              onClick={() => onImageChange(null)}
              disabled={disabled}
              className="inline-flex items-center justify-center p-1.5 bg-white border border-gray-300 rounded-md text-gray-600 hover:text-red-600 hover:border-red-300 transition-colors shadow-sm"
              aria-label="Remove image"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}
