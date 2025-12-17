import { ArtPiece as ArtPieceType, getImageUrl } from '../services/api';

interface ArtPieceProps {
  piece: ArtPieceType;
  onClick: () => void;
}

const ArtPiece = ({ piece, onClick }: ArtPieceProps) => {
  const imageUrl = getImageUrl(piece.image);

  return (
    <div 
      className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1"
      onClick={onClick}
    >
      {imageUrl && (
        <img 
          src={imageUrl} 
          alt={piece.title || 'Art piece'} 
          className="w-full h-64 object-cover"
        />
      )}
      <div className="p-6">
        {piece.title && (
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{piece.title}</h3>
        )}
        <p className="text-gray-600 overflow-hidden" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>{piece.description}</p>
      </div>
    </div>
  );
};

export default ArtPiece;
