import React from 'react';

const ArtPiece = ({ piece }) => {
  const imageUrl = piece.image?.url 
    ? `http://localhost:1337${piece.image.url}`
    : piece.image?.formats?.medium?.url 
    ? `http://localhost:1337${piece.image.formats.medium.url}`
    : null;

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
