import { Link } from 'react-router-dom';
import { ArtPiece as ArtPieceType, getImageUrl } from '../services/api';

interface ArtPieceProps {
  piece: ArtPieceType;
}

const ArtPiece = ({ piece }: ArtPieceProps) => {
  const imageUrl = getImageUrl(piece.image);
  const artworkId = piece.documentId || piece.id;

  return (
    <Link
      to={`/artwork/${artworkId}`}
      className="group block"
    >
      {imageUrl && (
        <div className="relative overflow-hidden bg-neutral-100 mb-4 aspect-[3/4]">
          <img
            src={imageUrl}
            alt={piece.title || 'Art piece'}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300"></div>
        </div>
      )}
      <div className="space-y-1">
        {piece.title && (
          <h3 className="text-lg font-light text-neutral-900 group-hover:text-neutral-600 transition-colors">
            {piece.title}
          </h3>
        )}
        <p className="text-sm text-neutral-500 line-clamp-2 leading-relaxed">
          {piece.description}
        </p>
      </div>
    </Link>
  );
};

export default ArtPiece;
