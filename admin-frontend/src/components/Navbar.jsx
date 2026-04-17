import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';
import { BrainCircuit } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="glass-panel sticky top-0 z-50 px-6 py-4 flex justify-between items-center mb-8 mx-4 mt-4">
      <Link to="/" className="flex items-center space-x-2 text-primary-500 hover:text-primary-400 transition-colors">
        <BrainCircuit size={28} className="drop-shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
        <span className="text-xl font-bold tracking-wider text-gray-900 dark:text-gray-100">
          AI<span className="text-primary-500">Port</span>
        </span>
      </Link>
      
      <div className="flex items-center space-x-6">
        <ThemeToggle />
        {user ? (
          <>
            <button onClick={logout} className="btn-secondary">
              Logout
            </button>
          </>
        ) : (
          <div className="flex space-x-4">
            <Link to="/login" className="text-gray-600 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 font-medium py-2 transition-colors">
              Admin Login
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
