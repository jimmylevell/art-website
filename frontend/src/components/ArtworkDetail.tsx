import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchArtPieceById, ArtPiece, getImageUrl } from '../services/api';

const ArtworkDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [piece, setPiece] = useState<ArtPiece | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadArtPiece = async () => {
      if (!id) {
        setError('No artwork ID provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const artPiece = await fetchArtPieceById(id);
        setPiece(artPiece);
        setError(null);
      } catch (err) {
        setError('Failed to load art piece. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadArtPiece();
  }, [id]);

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

  if (error || !piece) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-4">
        <div className="text-center space-y-6">
          <p className="text-neutral-500">{error || 'Artwork not found'}</p>
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

  const imageUrl = getImageUrl(piece.image);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Header */}
      <nav className="border-b border-neutral-200 py-6 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-neutral-800 hover:text-neutral-500 transition-colors group"
          >
            <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-sm uppercase tracking-wider font-medium">Back</span>
          </button>

          {piece.category && (
            <button
              onClick={() => navigate(`/category/${piece.category!.slug}`)}
              className="text-sm uppercase tracking-wider text-neutral-400 hover:text-neutral-800 transition-colors font-medium"
            >
              {piece.category.name}
            </button>
          )}
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Artwork Display */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start mb-16">
          {/* Image Section */}
          {imageUrl && (
            <div className="bg-neutral-50 aspect-square flex items-center justify-center p-8">
              <img
                src={imageUrl}
                alt={`${piece.title || 'Art piece'} - ${piece.category?.name || 'Uncategorized'}`}
                className="w-full h-full object-contain"
              />
            </div>
          )}

          {/* Details Section */}
          <div className="space-y-8 lg:pt-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-light tracking-tight text-neutral-900">
                {piece.title || 'Untitled'}
              </h1>

              {piece.category && (
                <p className="text-sm uppercase tracking-widest text-neutral-400 font-medium">
                  {piece.category.name}
                </p>
              )}
            </div>

            <div className="border-t border-neutral-200 pt-8">
              <h2 className="text-xs uppercase tracking-widest text-neutral-400 font-medium mb-4">
                Description
              </h2>
              <p className="text-neutral-600 leading-relaxed whitespace-pre-wrap">
                {piece.description}
              </p>
            </div>

            {piece.createdAt && (
              <div className="border-t border-neutral-200 pt-8">
                <p className="text-xs uppercase tracking-widest text-neutral-400 font-medium">
                  Added {new Date(piece.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ArtworkDetail;
