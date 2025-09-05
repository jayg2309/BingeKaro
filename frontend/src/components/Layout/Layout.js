import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Home, 
  Search, 
  Heart, 
  User, 
  LogOut, 
  Menu, 
  X, 
  Plus,
  Film
} from 'lucide-react';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Search', href: '/search', icon: Search },
    { name: 'Recommendations', href: '/recommendations', icon: Heart },
    { name: 'Profile', href: '/profile', icon: User },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Film className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">BingeKaro</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive(item.href)
                        ? 'text-white bg-gray-800 shadow-sm'
                        : 'text-gray-300 hover:text-white hover:bg-gray-800'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              {/* Create Recommendation Button */}
              <Link
                to="/recommendations/create"
                className="hidden md:flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-lg hover:scale-105"
              >
                <Plus className="w-4 h-4" />
                <span>Create List</span>
              </Link>

              {/* User Avatar */}
              <div className="flex items-center space-x-3">
                {user?.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-gray-600 hover:ring-blue-500 transition-all duration-200"
                  />
                ) : (
                  <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center hover:bg-gray-500 transition-all duration-200">
                    <User className="w-4 h-4 text-gray-300" />
                  </div>
                )}
                <span className="hidden md:block text-sm font-medium text-gray-200">
                  {user?.name}
                </span>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="hidden md:flex items-center space-x-2 text-gray-300 hover:text-white hover:bg-gray-800 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm">Logout</span>
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800 transition-all duration-200"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-700 bg-gray-900">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-base font-medium transition-all duration-200 ${
                      isActive(item.href)
                        ? 'text-white bg-gray-800'
                        : 'text-gray-300 hover:text-white hover:bg-gray-800'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
              
              {/* Mobile Create Button */}
              <Link
                to="/recommendations/create"
                className="flex items-center space-x-3 px-3 py-2 rounded-lg text-base font-medium bg-blue-600 text-white hover:bg-blue-700 transition-all duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Plus className="w-5 h-5" />
                <span>Create List</span>
              </Link>
              
              {/* Mobile Logout */}
              <button
                onClick={() => {
                  handleLogout();
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center space-x-3 px-3 py-2 rounded-lg text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800 transition-all duration-200 w-full text-left"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-700 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Film className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-white">BingeKaro</span>
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <span>Powered by OMDb API</span>
              <span>© 2024 BingeKaro. All rights reserved.</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
