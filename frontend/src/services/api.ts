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

export interface Category {
  id: number;
  documentId?: string;
  name: string;
  slug: string;
  description?: string;
  titleImage: ArtPieceImage;
  art_pieces?: ArtPiece[];
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
}

export interface ArtPiece {
  id: number;
  documentId?: string;
  title?: string;
  description: string;
  category?: Category;
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

export interface CategoriesResponse {
  data: Category[];
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
    const response = await axios.get<CategoriesResponse>(
      `${API_URL}/categories?populate[art_pieces][populate][image]=true&populate=titleImage`
    );
    const artPieces = flattenArtPieces(response.data.data);

    return {
      data: artPieces,
      meta: response.data.meta,
    };
  } catch (error) {
    console.error('Error fetching art pieces:', error);
    throw error;
  }
};

export const fetchArtPieceById = async (id: string): Promise<ArtPiece> => {
  try {
    const response = await axios.get<CategoriesResponse>(
      `${API_URL}/categories?populate[art_pieces][populate][image]=true&populate=titleImage`
    );
    const artPieces = flattenArtPieces(response.data.data);

    const match = artPieces.find((piece) =>
      String(piece.id) === id || piece.documentId === id
    );

    if (!match) {
      throw new Error('Art piece not found');
    }

    return match;
  } catch (error) {
    console.error('Error fetching art piece:', error);
    throw error;
  }
};

export const fetchCategories = async (): Promise<CategoriesResponse> => {
  try {
    const response = await axios.get<CategoriesResponse>(`${API_URL}/categories?populate=titleImage`);
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

export const fetchCategoryBySlug = async (slug: string): Promise<Category | null> => {
  try {
    // Fetch all categories and filter client-side for better compatibility
    const response = await axios.get<CategoriesResponse>(
      `${API_URL}/categories?populate=titleImage`
    );

    // Find the category with matching slug
    const category = response.data.data.find(cat => cat.slug === slug);
    return category || null;
  } catch (error) {
    console.error('Error fetching category:', error);
    throw error;
  }
};

export const fetchArtPiecesByCategory = async (categoryDocumentId: string): Promise<ArtPiecesResponse> => {
  try {
    const response = await axios.get<CategoriesResponse>(
      `${API_URL}/categories?populate[art_pieces][populate][image]=true&populate=titleImage`
    );

    const category = response.data.data.find((cat) =>
      cat.documentId === categoryDocumentId ||
      String(cat.id) === categoryDocumentId ||
      cat.slug === categoryDocumentId
    );

    const artPieces = flattenArtPieces(category ? [category] : []);

    return {
      data: artPieces,
      meta: response.data.meta,
    };
  } catch (error) {
    console.error('Error fetching art pieces by category:', error);
    throw error;
  }
};

const flattenArtPieces = (categories: Category[]): ArtPiece[] =>
  categories.flatMap((category) => {
    const { art_pieces: artPieces, ...categoryInfo } = category;
    return (artPieces || []).map((piece) => ({
      ...piece,
      category: categoryInfo,
    }));
  });

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
    const categoryName = piece.category?.name || 'Uncategorized';
    if (!grouped[categoryName]) {
      grouped[categoryName] = [];
    }
    grouped[categoryName].push(piece);
  });

  return grouped;
};
