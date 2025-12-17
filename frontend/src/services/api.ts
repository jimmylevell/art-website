import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:1337';
const API_URL = `${API_BASE_URL}/api`;

export interface ArtPieceImage {
  url?: string;
  formats?: {
    thumbnail?: { url: string };
    small?: { url: string };
    medium?: { url: string };
    large?: { url: string };
  };
}

export interface ArtPiece {
  id: number;
  documentId?: string;
  title?: string;
  description: string;
  category: string;
  image: ArtPieceImage;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
}

export interface ArtPiecesResponse {
  data: ArtPiece[];
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export const fetchArtPieces = async (): Promise<ArtPiecesResponse> => {
  try {
    const response = await axios.get<ArtPiecesResponse>(`${API_URL}/art-pieces?populate=*`);
    return response.data;
  } catch (error) {
    console.error('Error fetching art pieces:', error);
    throw error;
  }
};

export const getImageUrl = (image?: ArtPieceImage): string | null => {
  if (!image) return null;
  
  const imageUrl = image.url || image.formats?.medium?.url;
  if (!imageUrl) return null;
  
  return `${API_BASE_URL}${imageUrl}`;
};

export const groupArtPiecesByCategory = (artPieces: ArtPiecesResponse): Record<string, ArtPiece[]> => {
  const grouped: Record<string, ArtPiece[]> = {};
  
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
