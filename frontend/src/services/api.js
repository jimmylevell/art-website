import axios from 'axios';

const API_URL = 'http://localhost:1337/api';

export const fetchArtPieces = async () => {
  try {
    const response = await axios.get(`${API_URL}/art-pieces?populate=*`);
    return response.data;
  } catch (error) {
    console.error('Error fetching art pieces:', error);
    throw error;
  }
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
