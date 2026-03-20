import { Navigate, Route, Routes } from 'react-router-dom';
import { useEffect, useState } from 'react';
import AnimatedBackground from './components/AnimatedBackground';
import Loader from './components/Loader';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyEmail from './pages/VerifyEmail';
import { getAccessToken, refreshAccessToken } from './services/api';

function ProtectedRoute({ children }) {
  const [status, setStatus] = useState('checking');

  useEffect(() => {
    const verify = async () => {
      if (getAccessToken()) {
        setStatus('allowed');
        return;
      }

      try {
        await refreshAccessToken();
        setStatus('allowed');
      } catch {
        setStatus('blocked');
      }
    };

    verify();
  }, []);

  if (status === 'checking') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader label="Authorizing" />
      </div>
    );
  }

  if (status === 'blocked') {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function App() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="animated-gradient absolute inset-0 -z-20" />
      <AnimatedBackground />
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route
          path="/dashboard"
          element={(
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          )}
        />
      </Routes>
    </div>
  );
}

export default App;
