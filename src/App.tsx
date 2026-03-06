import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import LandingPage from './pages/LandingPage';
import SetupPage from './pages/SetupPage';

function App() {
  return (
    <BrowserRouter>
      {/* Settings for React Hot Toast mapping */}
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: 'var(--bg-card)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-color)',
            borderRadius: '1rem',
          },
        }}
      />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/configure" element={<SetupPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
