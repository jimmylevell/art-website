import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:1337';
const API_URL = `${API_BASE_URL}/api`;

export const fetchArtPieces = async () => {
  try {
    const response = await axios.get(`${API_URL}/art-pieces?populate=*`);
    return response.data;
  } catch (error) {
    console.error('Error fetching art pieces:', error);
    throw error;
  }
};

export const getImageUrl = (image) => {
  if (!image) return null;
  
  const imageUrl = image.url || image.formats?.medium?.url;
  if (!imageUrl) return null;
  
  return `${API_BASE_URL}${imageUrl}`;
};

export const groupArtPiecesByCategory = (artPieces) => {
  const grouped = {};
  
  if (!artPieces || !artPieces.data) {
    return grouped;
  }

  artPieces.data.forEach((piece) => {
    const category = piece.category || 'Uncategorized';
    if (!grouped[category]) {
      grouped[category] = [];
    }
    grouped[category].push(piece);
  });

  return grouped;
};
