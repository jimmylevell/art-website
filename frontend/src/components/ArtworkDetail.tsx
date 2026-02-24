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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-xl text-indigo-600 font-semibold">Loading artwork...</p>
        </div>
      </div>
    );
  }

  if (error || !piece) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-xl text-red-600 mb-4">{error || 'Art piece not found'}</p>
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

  const imageUrl = getImageUrl(piece.image);

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
          <h1 className="text-4xl font-bold">{piece.title || 'Untitled'}</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {imageUrl && (
            <div className="w-full bg-gray-100">
              <img
                src={imageUrl}
                alt={`${piece.title || 'Art piece'} - ${piece.category?.name || 'Uncategorized'}`}
                className="w-full h-auto object-contain max-h-[70vh] mx-auto"
              />
            </div>
          )}

          <div className="p-8">
            <div className="flex items-center gap-2 mb-6">
              {piece.category && (
                <button
                  onClick={() => navigate(`/category/${piece.category!.slug}`)}
                  className="inline-block bg-indigo-100 text-indigo-800 px-4 py-2 rounded-full text-sm font-semibold hover:bg-indigo-200 transition-colors cursor-pointer"
                >
                  {piece.category.name}
                </button>
              )}
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mb-4">About this piece</h2>
            <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-wrap">{piece.description}</p>

            {piece.createdAt && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                  Added on {new Date(piece.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            )}
          </div>
        </div >
      </main >
    </div >
  );
};

export default ArtworkDetail;
