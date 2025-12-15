import React from 'react';
import { getImageUrl } from '../services/api';

const ArtPiece = ({ piece }) => {
  const imageUrl = getImageUrl(piece.image);

  return (
    <div className="art-piece">
      {imageUrl && (
        <img 
          src={imageUrl} 
          alt={piece.title || 'Art piece'} 
          className="art-image"
        />
      )}
      <div className="art-info">
        {piece.title && <h3>{piece.title}</h3>}
        <p>{piece.description}</p>
      </div>
    </div>
  );
};

export default ArtPiece;
