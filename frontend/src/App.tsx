import { useState, useEffect } from 'react';
import { fetchArtPieces, groupArtPiecesByCategory, ArtPiece } from './services/api';
import CategorySection from './components/CategorySection';
import ArtViewer from './components/ArtViewer';

function App() {
  const [categorizedArt, setCategorizedArt] = useState<Record<string, ArtPiece[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPiece, setSelectedPiece] = useState<ArtPiece | null>(null);

  useEffect(() => {
    const loadArtPieces = async () => {
      try {
        setLoading(true);
        const artPieces = await fetchArtPieces();
        const grouped = groupArtPiecesByCategory(artPieces);
        setCategorizedArt(grouped);
        setError(null);
      } catch (err) {
        setError('Failed to load art pieces. Please make sure the Strapi backend is running.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadArtPieces();
  }, []);

  const handlePieceClick = (piece: ArtPiece) => {
    setSelectedPiece(piece);
  };

  const handleCloseViewer = () => {
    setSelectedPiece(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-xl text-indigo-600 font-semibold">Loading art gallery...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-xl text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  const categories = Object.keys(categorizedArt);

  if (categories.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-xl text-gray-600">No art pieces found. Please add some art pieces in Strapi admin.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-12 px-8 text-center mb-12">
        <h1 className="text-5xl font-bold mb-2">Art Gallery</h1>
        <p className="text-xl opacity-90">Explore our collection of beautiful art pieces</p>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {categories.map((category) => (
          <CategorySection
            key={category}
            category={category}
            pieces={categorizedArt[category]}
            maxPieces={3}
            onPieceClick={handlePieceClick}
          />
        ))}
      </main>

      <ArtViewer piece={selectedPiece} onClose={handleCloseViewer} />
    </div>
  );
}

export default App;
