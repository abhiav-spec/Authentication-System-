import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useLocation, useNavigate } from 'react-router-dom';
import AuthCard from '../components/AuthCard';
import Loader from '../components/Loader';
import { verifyEmailOtp, resendOtp } from '../services/api';

const OTP_LENGTH = 6;

function VerifyEmail() {
  const navigate = useNavigate();
  const location = useLocation();
  const prefilledEmail = location.state?.email || '';

  const cardRef = useRef(null);
  const containerRef = useRef(null);
  const otpRef = useRef([]);
  const btnRef = useRef(null);

  const [email, setEmail] = useState(prefilledEmail);
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(''));
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [devOtp, setDevOtp] = useState(location.state?.devOtp || '');

  useEffect(() => {
    gsap.fromTo(containerRef.current, { opacity: 0 }, { opacity: 1, duration: 0.45 });
    gsap.fromTo(cardRef.current, { y: 52, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' });
    gsap.fromTo(otpRef.current, { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, stagger: 0.08, delay: 0.22 });
  }, []);

  const handleOtpChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;

    const nextOtp = [...otp];
    nextOtp[index] = value;
    setOtp(nextOtp);

    if (value && index < OTP_LENGTH - 1) {
      otpRef.current[index + 1]?.focus();
    }

    gsap.fromTo(otpRef.current[index], { scale: 0.9 }, { scale: 1, duration: 0.18 });
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRef.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const joinedOtp = otp.join('');
    if (joinedOtp.length !== OTP_LENGTH) {
      setError('Please enter 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      await verifyEmailOtp({ email, otp: joinedOtp });
      setSuccess(true);
      await gsap.to(cardRef.current, {
        boxShadow: '0 0 50px rgba(52, 211, 153, 0.45)',
        duration: 0.35,
      });
      setTimeout(() => navigate('/login'), 900);
    } catch (err) {
      const message = err.response?.data?.error || 'OTP verification failed';
      setError(message);
      gsap.fromTo(cardRef.current, { x: -14 }, { x: 14, repeat: 5, yoyo: true, duration: 0.06 });
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) { setError('Please enter your email first'); return; }
    setResendLoading(true);
    setError('');
    try {
      const data = await resendOtp({ email });
      if (data.devOtp) setDevOtp(data.devOtp);
      setResendCooldown(60);
      const timer = setInterval(() => {
        setResendCooldown((c) => { if (c <= 1) { clearInterval(timer); return 0; } return c - 1; });
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to resend OTP');
    } finally {
      setResendLoading(false);
    }
  };

  const buttonHover = (scale) => {
    gsap.to(btnRef.current, { scale, duration: 0.22, ease: 'power2.out' });
  };

  return (
    <section ref={containerRef} className="mx-auto flex min-h-screen w-full max-w-7xl items-center justify-center px-4 py-10">
      <AuthCard cardRef={cardRef}>
        <h1 className="mb-2 text-center text-3xl font-semibold text-slate-100">Verify Email</h1>
        <p className="mb-6 text-center text-sm text-slate-300">Enter the 6-digit OTP sent to your email.</p>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full rounded-xl border border-white/20 bg-slate-950/50 px-4 py-3 text-slate-100 outline-none focus:border-cyan-300/70 focus:ring-2 focus:ring-cyan-400/30"
          />

          <div className="flex items-center justify-between gap-2 sm:gap-3">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => { otpRef.current[index] = el; }}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(index, e)}
                maxLength={1}
                inputMode="numeric"
                className="h-12 w-11 rounded-xl border border-white/25 bg-slate-950/60 text-center text-lg font-semibold text-cyan-100 outline-none transition focus:border-cyan-300 focus:ring-2 focus:ring-cyan-400/30 sm:w-12"
              />
            ))}
          </div>

          {error ? <p className="text-sm text-rose-300">{error}</p> : null}
          {success ? <p className="text-sm text-emerald-300">Email verified! Redirecting to login...</p> : null}

          {devOtp && (
            <div className="rounded-xl border border-amber-400/40 bg-amber-400/10 px-4 py-3 text-center">
              <p className="text-xs font-semibold uppercase tracking-widest text-amber-300">Dev Mode — Email not sent</p>
              <p className="mt-1 text-sm text-amber-100">Your OTP is: <span className="font-bold tracking-widest text-amber-300">{devOtp}</span></p>
            </div>
          )}

          <button
            ref={btnRef}
            type="submit"
            disabled={loading}
            onMouseEnter={() => buttonHover(1.03)}
            onMouseLeave={() => buttonHover(1)}
            className="w-full rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 px-4 py-3 text-sm font-semibold text-slate-950 transition disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? <Loader label="Verifying" /> : 'Verify OTP'}
          </button>

          <button
            type="button"
            onClick={handleResend}
            disabled={resendLoading || resendCooldown > 0}
            className="w-full rounded-xl border border-white/20 bg-transparent px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:border-cyan-400/50 hover:text-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {resendLoading ? <Loader label="Sending" /> : resendCooldown > 0 ? `Resend OTP in ${resendCooldown}s` : 'Resend OTP'}
          </button>
        </form>
      </AuthCard>
    </section>
  );
}

export default VerifyEmail;
