import React, { Suspense, lazy } from 'react';
import '@radix-ui/themes/styles.css';
import { Theme } from '@radix-ui/themes';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './src/pages/Home';
import NotFound from './src/pages/NotFound';
import ProtectedRoute from './src/components/ProtectedRoute';

const Login = lazy(() => import('./src/pages/Login'));
const Register = lazy(() => import('./src/pages/Register'));
const Dashboard = lazy(() => import('./src/pages/Dashboard'));
const AdminPanel = lazy(() => import('./src/pages/AdminPanel'));
const Track = lazy(() => import('./src/pages/Track'));

const PageLoader: React.FC = () => (
  <div className="min-h-screen bg-slate-950 flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
  </div>
);

const App: React.FC = () => {
  return (
    <Theme appearance="inherit" radius="large" scaling="100%">
      <Router>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/track" element={<Track />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute role="customer">
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute role="admin">
                  <AdminPanel />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          newestOnTop
          closeOnClick
          pauseOnHover
          theme="dark"
        />
      </Router>
    </Theme>
  );
};

export default App;