import React from 'react';
import { Link } from 'react-router-dom';
import { Package, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md"
      >
        <div className="w-20 h-20 bg-amber-500/20 rounded-2xl flex items-center justify-center mx-auto mb-8">
          <Package size={40} className="text-amber-400" />
        </div>
        <h1 className="font-heading text-6xl font-bold text-white mb-4">404</h1>
        <h2 className="font-heading text-2xl font-bold text-white mb-3">Page Not Found</h2>
        <p className="text-slate-400 text-base mb-8 leading-relaxed">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-amber-500 text-slate-900 font-semibold hover:bg-amber-400 hover:scale-105 transition-all duration-200"
        >
          <ArrowLeft size={18} />
          Back to Home
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;