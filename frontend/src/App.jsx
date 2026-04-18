import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import UserDashboard from './pages/UserDashboard';
import AnalysisDashboard from './pages/AnalysisDashboard';

function App() {
  const { user, loading } = useContext(AuthContext);

  if (loading) return (
    <div className="flex bg-gray-50 dark:bg-dark-900 justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary-500"></div>
    </div>
  );

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-dark-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 pb-12">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
            <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={user ? <UserDashboard /> : <Navigate to="/login" />} />
            <Route path="/analysis" element={user ? <AnalysisDashboard /> : <Navigate to="/login" />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
