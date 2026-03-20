import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { Link, useNavigate } from 'react-router-dom';
import AuthCard from '../components/AuthCard';
import InputField from '../components/InputField';
import Loader from '../components/Loader';
import { loginUser } from '../services/api';

function Login() {
  const navigate = useNavigate();
  const cardRef = useRef(null);
  const titleRef = useRef(null);
  const inputRefs = useRef([]);
  const buttonRef = useRef(null);
  const containerRef = useRef(null);

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const tl = gsap.timeline();
    tl.fromTo(containerRef.current, { opacity: 0 }, { opacity: 1, duration: 0.5 })
      .fromTo(cardRef.current, { y: 60, opacity: 0, scale: 0.94 }, { y: 0, opacity: 1, scale: 1, duration: 0.8, ease: 'power3.out' }, '-=0.1')
      .fromTo(titleRef.current, { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, '-=0.35')
      .fromTo(inputRefs.current, { x: -34, opacity: 0 }, { x: 0, opacity: 1, duration: 0.55, stagger: 0.12, ease: 'power2.out' }, '-=0.25')
      .fromTo(buttonRef.current, { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45 }, '-=0.22');
  }, []);

  const onChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await loginUser(formData);
      navigate('/dashboard');
    } catch (err) {
      const message = err.response?.data?.error || 'Login failed';
      setError(message);
      gsap.fromTo(cardRef.current, { x: -14 }, { x: 14, repeat: 5, yoyo: true, duration: 0.06, ease: 'power1.inOut' });
    } finally {
      setLoading(false);
    }
  };

  const animateAndNavigate = (to) => (e) => {
    e.preventDefault();
    gsap.to(containerRef.current, {
      opacity: 0,
      y: -10,
      duration: 0.35,
      onComplete: () => navigate(to),
    });
  };

  const buttonHover = (scale) => {
    gsap.to(buttonRef.current, { scale, duration: 0.25, ease: 'power2.out' });
  };

  return (
    <section ref={containerRef} className="mx-auto flex min-h-screen w-full max-w-7xl items-center justify-center px-4 py-10">
      <AuthCard cardRef={cardRef}>
        <h1 ref={titleRef} className="mb-6 text-center text-3xl font-semibold tracking-tight text-slate-100">
          Welcome Back
        </h1>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div ref={(el) => { inputRefs.current[0] = el; }}>
            <InputField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={onChange}
              autoComplete="email"
            />
          </div>

          <div ref={(el) => { inputRefs.current[1] = el; }}>
            <InputField
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={onChange}
              autoComplete="current-password"
            />
          </div>

          {error ? <p className="text-sm text-rose-300">{error}</p> : null}

          <button
            ref={buttonRef}
            type="submit"
            disabled={loading}
            onMouseEnter={() => buttonHover(1.03)}
            onMouseLeave={() => buttonHover(1)}
            className="mt-2 w-full rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 px-4 py-3 text-sm font-semibold text-slate-950 transition disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? <Loader label="Signing in" /> : 'Login'}
          </button>

          <p className="pt-2 text-center text-sm text-slate-300">
            Don&apos;t have an account?{' '}
            <Link to="/register" onClick={animateAndNavigate('/register')} className="font-semibold text-cyan-300 hover:text-cyan-200">
              Register
            </Link>
          </p>
        </form>
      </AuthCard>
    </section>
  );
}

export default Login;
