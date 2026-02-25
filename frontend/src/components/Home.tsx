import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchCategories, Category, getImageUrl } from '../services/api';

function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        const categoriesResponse = await fetchCategories();
        setCategories(categoriesResponse.data);
        setError(null);
      } catch (err) {
        setError('Failed to load categories. Please make sure the Strapi backend is running.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

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

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-4">
        <div className="text-center max-w-md">
          <p className="text-neutral-500 mb-2">{error}</p>
          <p className="text-sm text-neutral-400">Please ensure the backend is running.</p>
        </div>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-4">
        <div className="text-center">
          <p className="text-sm uppercase tracking-widest text-neutral-400 font-medium">No collections available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Elegant Hero Section */}
      <header className="relative py-20 px-6 border-b border-neutral-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4">
            <h1 className="text-6xl md:text-7xl font-light tracking-tight text-neutral-900">
              Art Gallery
            </h1>
            <p className="text-xl text-neutral-500 font-light max-w-2xl mx-auto">
              Discover curated collections of contemporary art
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-16">
        <div className="mb-12">
          <h2 className="text-sm uppercase tracking-widest text-neutral-400 font-medium mb-8">
            Collections
          </h2>
        </div>

        {/* Masonry-style grid for categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {categories.map((category, index) => {
            const titleImageUrl = getImageUrl(category.titleImage);
            return (
              <Link
                key={category.id}
                to={`/category/${category.slug}`}
                className="group block fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {titleImageUrl && (
                  <div className="relative overflow-hidden bg-neutral-100 mb-4 aspect-[3/4]">
                    <img
                      src={titleImageUrl}
                      alt={category.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300"></div>
                  </div>
                )}
                <div className="space-y-2">
                  <h3 className="text-2xl font-light text-neutral-900 group-hover:text-neutral-600 transition-colors">
                    {category.name}
                  </h3>
                  {category.description && (
                    <p className="text-sm text-neutral-500 line-clamp-2 leading-relaxed">
                      {category.description}
                    </p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}

export default Home;
