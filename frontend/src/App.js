import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ClientList from './components/ClientList';
import ClientDetail from './components/ClientDetail';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<ClientList />} />
            <Route path="/clients/:clientId" element={<ClientDetail />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
