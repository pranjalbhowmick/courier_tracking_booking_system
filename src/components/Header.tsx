import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Package, Menu, X, LogOut, User, LayoutDashboard, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../store/appStore';

const Header: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAppStore();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { label: 'Home', to: '/' },
    { label: 'Track', to: '/track' },
    ...(isAuthenticated && user?.role === 'customer' ? [{ label: 'Dashboard', to: '/dashboard' }] : []),
    ...(isAuthenticated && user?.role === 'admin' ? [{ label: 'Admin Panel', to: '/admin' }] : []),
  ];

  const isActive = (to: string) => location.pathname === to;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-slate-900/95 backdrop-blur-md shadow-lg shadow-slate-900/20' : 'bg-transparent backdrop-blur-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 bg-amber-500 rounded-lg flex items-center justify-center group-hover:bg-amber-400 transition-colors duration-200">
            <Package size={20} className="text-slate-900" />
          </div>
          <span className="font-heading text-xl font-bold text-white tracking-tight">
            Swift<span className="text-amber-400">Courier</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive(link.to)
                  ? 'text-amber-400 bg-amber-400/10'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated && user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-lg">
                {user.role === 'admin' ? (
                  <Shield size={16} className="text-amber-400" />
                ) : (
                  <User size={16} className="text-slate-300" />
                )}
                <span className="text-sm text-slate-200 font-medium">{user.name.split(' ')[0]}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-white/10 transition-all duration-200"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-white/10 transition-all duration-200"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-5 py-2 rounded-lg text-sm font-semibold bg-amber-500 text-slate-900 hover:bg-amber-400 hover:scale-105 transition-all duration-200"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        <button
          className="md:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-all duration-200"
          onClick={() => setMobileOpen(v => !v)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-slate-900/98 backdrop-blur-md border-t border-white/10 px-6 py-4"
            role="dialog"
            aria-label="Mobile navigation"
          >
            <nav className="flex flex-col gap-1 mb-4">
              {navLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive(link.to)
                      ? 'text-amber-400 bg-amber-400/10'
                      : 'text-slate-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="flex flex-col gap-2 pt-4 border-t border-white/10">
              {isAuthenticated && user ? (
                <>
                  <div className="flex items-center gap-2 px-4 py-2">
                    {user.role === 'admin' ? (
                      <Shield size={16} className="text-amber-400" />
                    ) : (
                      <User size={16} className="text-slate-300" />
                    )}
                    <span className="text-sm text-slate-200">{user.name}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-white/10 transition-all duration-200"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-4 py-3 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-white/10 transition-all duration-200 text-center"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-3 rounded-lg text-sm font-semibold bg-amber-500 text-slate-900 hover:bg-amber-400 transition-all duration-200 text-center"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;