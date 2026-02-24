import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    fetchCategoryBySlug,
    fetchArtPiecesByCategory,
    Category,
    ArtPiece as ArtPieceType,
    getImageUrl
} from '../services/api';
import ArtPiece from './ArtPiece';

const CategoryView = () => {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const [category, setCategory] = useState<Category | null>(null);
    const [artPieces, setArtPieces] = useState<ArtPieceType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadCategoryData = async () => {
            if (!slug) {
                setError('No category specified');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const categoryData = await fetchCategoryBySlug(slug);

                if (!categoryData) {
                    setError('Category not found');
                    setLoading(false);
                    return;
                }

                setCategory(categoryData);
                console.log('Category loaded:', categoryData);

                const categoryDocId = categoryData.documentId || String(categoryData.id);
                console.log('Using category ID:', categoryDocId);

                const artPiecesResponse = await fetchArtPiecesByCategory(categoryDocId);
                setArtPieces(artPiecesResponse.data);
                setError(null);
            } catch (err) {
                setError('Failed to load category. Please try again later.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        loadCategoryData();
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto mb-4"></div>
                    <p className="text-xl text-indigo-600 font-semibold">Loading category...</p>
                </div>
            </div>
        );
    }

    if (error || !category) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
                <div className="text-center">
                    <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-xl text-red-600 mb-4">{error || 'Category not found'}</p>
                    <button
                        onClick={() => navigate('/')}
                        className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        Back to Gallery
                    </button>
                </div>
            </div>
        );
    }

    const titleImageUrl = getImageUrl(category.titleImage);

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-8 px-8">
                <div className="max-w-7xl mx-auto">
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center gap-2 text-white hover:text-gray-200 transition-colors mb-4"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Gallery
                    </button>
                    <h1 className="text-4xl font-bold">{category.name}</h1>
                    {category.description && (
                        <p className="text-xl opacity-90 mt-2">{category.description}</p>
                    )}
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {titleImageUrl && (
                    <div className="mb-12 rounded-xl overflow-hidden shadow-lg">
                        <img
                            src={titleImageUrl}
                            alt={category.name}
                            className="w-full h-80 object-cover"
                        />
                    </div>
                )}

                {artPieces.length === 0 ? (
                    <div className="text-center py-12">
                        <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-xl text-gray-600">No art pieces in this category yet.</p>
                    </div>
                ) : (
                    <>
                        <div className="mb-6">
                            <h2 className="text-2xl font-semibold text-gray-800">
                                {artPieces.length} {artPieces.length === 1 ? 'piece' : 'pieces'} in this category
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {artPieces.map((piece) => (
                                <ArtPiece key={piece.id} piece={piece} />
                            ))}
                        </div>
                    </>
                )}
            </main>
        </div>
    );
};

export default CategoryView;
