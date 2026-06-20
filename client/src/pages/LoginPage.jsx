import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import confetti from 'canvas-confetti';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      setSuccess(true);
      confetti({
        particleCount: 150,
        spread: 85,
        origin: { y: 0.5 }
      });
      setTimeout(() => {
        navigate('/app');
      }, 1600);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center text-center p-6 animate-fade-in relative z-50">
        <div className="absolute inset-0 -z-10" style={{ background: 'linear-gradient(135deg, rgba(10, 14, 26, 0.85) 0%, rgba(13, 21, 48, 0.92) 100%)' }} />
        <div className="text-8xl mb-6 animate-bounce">🏆</div>
        <h1 className="font-display text-5xl text-wc-gold tracking-widest animate-pulse mb-3">PROFILE SYNCED!</h1>
        <p className="text-white/80 text-lg uppercase tracking-wide">Ready for the Matchday</p>
        <div className="mt-8 flex items-center justify-center gap-2 text-white/50 animate-pulse">
          <div className="w-2.5 h-2.5 bg-wc-gold rounded-full animate-ping" />
          <span className="text-xs uppercase tracking-widest font-semibold">Entering Arena...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center relative overflow-hidden px-4 bg-transparent">

      {/* Back Navigation */}
      <Link 
        to="/" 
        className="absolute top-6 left-6 text-white/50 hover:text-white flex items-center gap-2 text-xs tracking-widest uppercase transition-colors z-50"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back
      </Link>

      {/* Branding matching LandingPage */}
      <div className="mb-6 animate-pulse text-center relative z-10">
        <h1 className="font-display text-4xl sm:text-5xl leading-none tracking-[0.25em] font-black text-white drop-shadow-xl">
          LUCKY STAR FC
        </h1>
        <p className="text-xs sm:text-sm text-wc-gold tracking-[0.4em] uppercase leading-none mt-3 font-bold">
          PREDICTIONS
        </p>
      </div>

      {/* Login card */}
      <div
        className="w-full max-w-sm animate-slide-up relative z-10"
      >
        <div className="relative p-8 bg-[#050810] border border-white/10 rounded-none overflow-hidden shadow-2xl">
          {/* Sleek loading bar */}
          {loading && (
            <div className="absolute top-0 left-0 w-full h-[2px] bg-white/10 overflow-hidden">
              <div className="h-full bg-[#050810] w-1/2 animate-[slide_1s_ease-in-out_infinite]" />
            </div>
          )}

        <h2 className="font-display text-xl text-white tracking-[0.2em] mb-8 text-center uppercase font-bold">
          SIGN IN
        </h2>

        {error && (
          <div className="mb-4 p-3 rounded-none text-sm text-red-300 font-medium animate-fade-in"
            style={{ background: 'rgba(220, 38, 38, 0.15)', border: '1px solid rgba(220, 38, 38, 0.3)' }}>
            ⚠️ {error}
          </div>
        )}

        <form id="login-form" onSubmit={handleSubmit} className={`space-y-6 transition-opacity duration-300 ${loading ? 'opacity-50' : ''}`}>
          <div className="relative group pt-4">
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder=" "
              required
              className="peer w-full bg-transparent border-b border-white/20 px-0 py-2 text-white placeholder-transparent focus:border-white focus:outline-none transition-colors duration-300 font-body"
              autoComplete="email"
            />
            <label 
              className="absolute left-0 top-6 text-white/50 text-xs tracking-[0.2em] uppercase transition-all duration-300 peer-focus:top-0 peer-focus:text-[10px] peer-focus:text-white peer-valid:top-0 peer-valid:text-[10px] peer-valid:text-white/40"
              htmlFor="login-email"
            >
              Email
            </label>
          </div>

          <div className="relative group pt-4">
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder=" "
              required
              className="peer w-full bg-transparent border-b border-white/20 px-0 py-2 pr-10 text-white placeholder-transparent focus:border-white focus:outline-none transition-colors duration-300 font-body"
              autoComplete="current-password"
            />
            <label 
              className="absolute left-0 top-6 text-white/50 text-xs tracking-[0.2em] uppercase transition-all duration-300 peer-focus:top-0 peer-focus:text-[10px] peer-focus:text-white peer-valid:top-0 peer-valid:text-[10px] peer-valid:text-white/40"
              htmlFor="login-password"
            >
              Password
            </label>
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-0 top-6 text-white/50 hover:text-white text-xs uppercase tracking-widest transition-colors duration-300"
              aria-label="Toggle password visibility"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>

          <button
            id="login-submit-btn"
            type="submit"
            disabled={loading}
            className="w-full py-4 text-xs tracking-[0.2em] uppercase font-bold text-white bg-transparent border border-white hover:bg-white hover:text-black transition-all duration-300 mt-8 disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-white"
          >
            Sign In
          </button>

          <div className="text-center mt-4">
            <Link to="/forgot-password" className="text-white/50 hover:text-white text-xs uppercase tracking-widest transition-colors">
              Forgot Password?
            </Link>
          </div>
        </form>

        <p className="mt-8 text-center text-xs tracking-widest text-white/50 uppercase">
          Don't have an account?{' '}
          <Link to="/register" className="text-white font-bold hover:underline">
            Create Account
          </Link>
        </p>
        </div>
      </div>

      {/* Bottom tagline */}
      <p className="mt-8 text-white/30 text-[10px] uppercase tracking-[0.3em] text-center animate-fade-in relative z-10">
        Predict. Compete. Glory awaits.
      </p>
    </div>
  );
}
