import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import ArtworkDetail from './components/ArtworkDetail';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/artwork/:id" element={<ArtworkDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
