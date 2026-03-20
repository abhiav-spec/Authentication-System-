import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useNavigate } from 'react-router-dom';
import AuthCard from '../components/AuthCard';
import Loader from '../components/Loader';
import { getProfile, logout } from '../services/api';

function Dashboard() {
  const navigate = useNavigate();
  const cardRef = useRef(null);
  const buttonRef = useRef(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getProfile();
        setUser(data.user);
      } catch {
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [navigate]);

  useEffect(() => {
    if (!loading && cardRef.current) {
      gsap.fromTo(cardRef.current, { y: 42, opacity: 0, scale: 0.96 }, { y: 0, opacity: 1, scale: 1, duration: 0.7, ease: 'power3.out' });
    }
  }, [loading]);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
      navigate('/login');
    } finally {
      setLoggingOut(false);
    }
  };

  const buttonHover = (scale) => {
    gsap.to(buttonRef.current, { scale, duration: 0.24, ease: 'power2.out' });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader label="Loading dashboard" />
      </div>
    );
  }

  return (
    <section className="mx-auto flex min-h-screen w-full max-w-7xl items-center justify-center px-4 py-10">
      <AuthCard cardRef={cardRef}>
        <h1 className="mb-3 text-center text-3xl font-semibold text-slate-100">Dashboard</h1>
        <p className="mb-7 text-center text-lg text-slate-200">
          Welcome, <span className="font-semibold text-cyan-200">{user?.username || 'User'}</span>
        </p>

        <div className="rounded-2xl border border-white/15 bg-slate-950/35 p-4 text-sm text-slate-200">
          <p className="mb-1">Email: {user?.email}</p>
          <p>Status: {user?.verified ? 'Verified' : 'Not verified'}</p>
        </div>

        <button
          ref={buttonRef}
          type="button"
          onClick={handleLogout}
          onMouseEnter={() => buttonHover(1.03)}
          onMouseLeave={() => buttonHover(1)}
          disabled={loggingOut}
          className="mt-6 w-full rounded-xl bg-gradient-to-r from-rose-400 to-orange-400 px-4 py-3 text-sm font-semibold text-slate-950 transition disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loggingOut ? <Loader label="Logging out" /> : 'Logout'}
        </button>
      </AuthCard>
    </section>
  );
}

export default Dashboard;
