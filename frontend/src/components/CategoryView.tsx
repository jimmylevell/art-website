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
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border border-neutral-300 border-t-neutral-800 mx-auto mb-4"></div>
                    <p className="text-sm uppercase tracking-widest text-neutral-400 font-medium">Loading...</p>
                </div>
            </div>
        );
    }

    if (error || !category) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white px-4">
                <div className="text-center space-y-6">
                    <p className="text-neutral-500">{error || 'Category not found'}</p>
                    <button
                        onClick={() => navigate('/')}
                        className="text-sm uppercase tracking-wider text-neutral-800 hover:text-neutral-500 transition-colors font-medium"
                    >
                        Return to Gallery
                    </button>
                </div>
            </div>
        );
    }

    const titleImageUrl = getImageUrl(category.titleImage);

    return (
        <div className="min-h-screen bg-white">
            {/* Navigation Header */}
            <nav className="border-b border-neutral-200 py-6 px-6">
                <div className="max-w-7xl mx-auto">
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center gap-2 text-neutral-800 hover:text-neutral-500 transition-colors group"
                    >
                        <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                        </svg>
                        <span className="text-sm uppercase tracking-wider font-medium">Back</span>
                    </button>
                </div>
            </nav>

            {/* Category Header */}
            <header className="py-16 px-6 border-b border-neutral-200">
                <div className="max-w-7xl mx-auto">
                    <div className="max-w-3xl">
                        <h1 className="text-5xl md:text-6xl font-light tracking-tight text-neutral-900 mb-4">
                            {category.name}
                        </h1>
                        {category.description && (
                            <p className="text-lg text-neutral-500 font-light leading-relaxed">
                                {category.description}
                            </p>
                        )}
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-16">
                {titleImageUrl && (
                    <div className="mb-16 bg-neutral-100 aspect-[21/9] overflow-hidden">
                        <img
                            src={titleImageUrl}
                            alt={category.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}

                {artPieces.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-neutral-400 text-sm uppercase tracking-widest">No artworks available</p>
                    </div>
                ) : (
                    <>
                        <div className="mb-12">
                            <p className="text-sm uppercase tracking-widest text-neutral-400 font-medium">
                                {artPieces.length} {artPieces.length === 1 ? 'Artwork' : 'Artworks'}
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                            {artPieces.map((piece, index) => (
                                <div
                                    key={piece.id}
                                    className="fade-in-up"
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                >
                                    <ArtPiece piece={piece} />
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </main>
        </div>
    );
};

export default CategoryView;
