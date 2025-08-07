import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import NewsManager from './pages/NewsManager';
import VideoStudio from './pages/VideoStudio';
import Settings from './pages/Settings';
import { NewsProvider } from './context/NewsContext';

function App() {
  return (
    <NewsProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 flex">
          <Sidebar />
          <main className="flex-1 overflow-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/news" element={<NewsManager />} />
              <Route path="/studio" element={<VideoStudio />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </main>
        </div>
      </Router>
    </NewsProvider>
  );
}

export default App;