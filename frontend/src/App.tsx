import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import ArtworkDetail from './components/ArtworkDetail';
import CategoryView from './components/CategoryView';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/category/:slug" element={<CategoryView />} />
        <Route path="/artwork/:id" element={<ArtworkDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
