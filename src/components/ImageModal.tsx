import React from 'react';
import { X, ZoomIn, ZoomOut } from 'lucide-react';

interface ImageModalProps {
  src: string;
  alt: string;
  isOpen: boolean;
  onClose: () => void;
}

export const ImageModal: React.FC<ImageModalProps> = ({ src, alt, isOpen, onClose }) => {
  const [isZoomed, setIsZoomed] = React.useState(false);

  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 p-2 text-white hover:text-gray-300 transition-colors"
        aria-label="Close image"
      >
        <X className="h-6 w-6" />
      </button>

      {/* Zoom toggle */}
      <button
        onClick={() => setIsZoomed(!isZoomed)}
        className="absolute top-4 right-16 z-10 p-2 text-white hover:text-gray-300 transition-colors"
        aria-label={isZoomed ? "Zoom out" : "Zoom in"}
      >
        {isZoomed ? <ZoomOut className="h-6 w-6" /> : <ZoomIn className="h-6 w-6" />}
      </button>

      {/* Backdrop click to close */}
      <div 
        className="absolute inset-0" 
        onClick={onClose}
      />

      {/* Image container */}
      <div className="relative max-w-[95vw] max-h-[95vh] flex items-center justify-center">
        <img
          src={src}
          alt={alt}
          className={`
            max-w-full max-h-full object-contain rounded-lg shadow-2xl transition-transform duration-300
            ${isZoomed ? 'scale-150 cursor-zoom-out' : 'cursor-zoom-in'}
          `}
          onClick={(e) => {
            e.stopPropagation();
            setIsZoomed(!isZoomed);
          }}
          draggable={false}
        />
      </div>

      {/* Image caption/alt text */}
      {alt && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/60 text-white px-4 py-2 rounded-lg backdrop-blur-sm">
          <p className="text-sm text-center max-w-md">{alt}</p>
        </div>
      )}
    </div>
  );
};
