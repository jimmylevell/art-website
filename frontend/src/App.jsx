import { useState, useEffect } from 'react'
import './App.css'
import { fetchArtPieces, groupArtPiecesByCategory } from './services/api'
import CategorySection from './components/CategorySection'

function App() {
  const [categorizedArt, setCategorizedArt] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadArtPieces = async () => {
      try {
        setLoading(true)
        const artPieces = await fetchArtPieces()
        const grouped = groupArtPiecesByCategory(artPieces)
        setCategorizedArt(grouped)
        setError(null)
      } catch (err) {
        setError('Failed to load art pieces. Please make sure the Strapi backend is running.')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadArtPieces()
  }, [])

  if (loading) {
    return <div className="loading">Loading art gallery...</div>
  }

  if (error) {
    return <div className="error">{error}</div>
  }

  const categories = Object.keys(categorizedArt)

  if (categories.length === 0) {
    return <div className="empty">No art pieces found. Please add some art pieces in Strapi admin.</div>
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Art Gallery</h1>
        <p>Explore our collection of beautiful art pieces</p>
      </header>
      <main className="app-main">
        {categories.map((category) => (
          <CategorySection
            key={category}
            category={category}
            pieces={categorizedArt[category]}
            maxPieces={3}
          />
        ))}
      </main>
    </div>
  )
}

export default App
