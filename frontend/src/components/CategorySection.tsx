import { ArtPiece as ArtPieceType } from '../services/api';
import ArtPiece from './ArtPiece';

interface CategorySectionProps {
  category: string;
  pieces: ArtPieceType[];
  maxPieces?: number;
  onPieceClick: (piece: ArtPieceType) => void;
}

const CategorySection = ({ category, pieces, maxPieces = 3, onPieceClick }: CategorySectionProps) => {
  const displayPieces = pieces.slice(0, maxPieces);

  return (
    <div className="mb-16">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 pb-2 border-b-4 border-indigo-600 inline-block">
        {category}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-6">
        {displayPieces.map((piece) => (
          <ArtPiece 
            key={piece.id} 
            piece={piece}
            onClick={() => onPieceClick(piece)}
          />
        ))}
      </div>
      {pieces.length > maxPieces && (
        <p className="text-center text-indigo-600 font-semibold mt-4 text-lg">
          +{pieces.length - maxPieces} more pieces in this category
        </p>
      )}
    </div>
  );
};

export default CategorySection;
