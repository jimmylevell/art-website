import { useEffect } from 'react';
import { ArtPiece, getImageUrl } from '../services/api';

interface ArtViewerProps {
  piece: ArtPiece | null;
  onClose: () => void;
}

const ArtViewer = ({ piece, onClose }: ArtViewerProps) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (piece) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [piece, onClose]);

  if (!piece) return null;

  const imageUrl = getImageUrl(piece.image);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4"
      onClick={handleBackdropClick}
    >
      <div className="relative max-w-4xl w-full bg-white rounded-lg shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 hover:bg-gray-100 transition-colors shadow-lg"
          aria-label="Close viewer"
        >
          <svg
            className="w-6 h-6 text-gray-800"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>

        <div className="flex-1 overflow-y-auto">
          {imageUrl && (
            <div className="w-full bg-gray-100">
              <img
                src={imageUrl}
                alt={`${piece.title || 'Art piece'} - ${piece.category}: ${piece.description.substring(0, 100)}`}
                className="w-full h-auto object-contain max-h-[60vh]"
              />
            </div>
          )}

          <div className="p-6">
            {piece.title && (
              <h2 className="text-3xl font-bold text-gray-900 mb-2">{piece.title}</h2>
            )}
            
            <div className="flex items-center gap-2 mb-4">
              <span className="inline-block bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-semibold">
                {piece.category}
              </span>
            </div>

            <p className="text-gray-700 leading-relaxed text-lg">{piece.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtViewer;
