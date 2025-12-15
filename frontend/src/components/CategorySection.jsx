import React from 'react';
import ArtPiece from './ArtPiece';

const CategorySection = ({ category, pieces, maxPieces = 3 }) => {
  const displayPieces = pieces.slice(0, maxPieces);

  return (
    <div className="category-section">
      <h2 className="category-title">{category}</h2>
      <div className="art-grid">
        {displayPieces.map((piece) => (
          <ArtPiece key={piece.id} piece={piece} />
        ))}
      </div>
      {pieces.length > maxPieces && (
        <p className="more-pieces">
          +{pieces.length - maxPieces} more pieces in this category
        </p>
      )}
    </div>
  );
};

export default CategorySection;
