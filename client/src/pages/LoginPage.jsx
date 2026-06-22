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
      confetti({ particleCount: 150, spread: 85, origin: { y: 0.5 } });
      setTimeout(() => navigate('/app'), 1600);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center text-center p-6 animate-fade-in bg-surface">
        <div className="text-8xl mb-6 animate-bounce">🏆</div>
        <h1 className="font-display text-4xl tracking-widest animate-pulse mb-3 font-black text-primary">WELCOME BACK!</h1>
        <p className="text-sm uppercase tracking-widest font-bold text-on-surface-variant">Entering the Arena...</p>
        <div className="mt-8 flex items-center justify-center gap-2 animate-pulse">
          <div className="w-2 h-2 animate-ping bg-primary rounded-full" />
          <span className="text-xs uppercase tracking-widest font-bold text-on-surface-variant">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-4 bg-surface">

      {/* Back */}
      <Link
        to="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-xs tracking-widest uppercase font-bold transition-colors z-50 text-on-surface-variant hover:text-on-surface"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back
      </Link>

      {/* Branding */}
      <div className="mb-8 text-center animate-fade-in">
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="w-10 h-10 flex items-center justify-center font-black text-white text-2xl font-display bg-primary shadow-neon-primary rounded">
            K
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-black tracking-[0.2em] uppercase text-on-surface">
            Lucky Star FC
          </h1>
        </div>
        <p className="text-xs tracking-[0.4em] uppercase font-bold text-primary">Predictions</p>
      </div>

      {/* Card */}
      <div className="w-full max-w-sm animate-slide-up">
        <div className="relative p-8 overflow-hidden bg-white border border-outline-variant/30 shadow-md rounded-xl">

          {/* Loading bar */}
          {loading && (
            <div className="absolute top-0 left-0 w-full h-[2px] overflow-hidden bg-outline-variant/30">
              <div className="h-full w-1/2 animate-[slide_1s_ease-in-out_infinite] bg-primary" />
            </div>
          )}

          <h2 className="font-display text-lg font-black tracking-[0.2em] mb-8 text-center uppercase text-on-surface">
            Sign In
          </h2>

          {error && (
            <div className="mb-5 p-3 text-sm font-bold animate-fade-in bg-error/10 border border-error/30 text-error rounded">
              ⚠ {error}
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
                autoComplete="email"
                className="peer w-full bg-transparent px-0 py-2 placeholder-transparent outline-none font-body font-medium transition-colors duration-200 border-b-2 border-outline-variant/50 focus:border-primary text-on-surface"
              />
              <label
                className="absolute left-0 top-6 text-xs tracking-[0.2em] uppercase font-bold transition-all duration-300 peer-focus:top-0 peer-focus:text-[10px] peer-valid:top-0 peer-valid:text-[10px] text-on-surface-variant peer-focus:text-primary"
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
                autoComplete="current-password"
                 className="peer w-full bg-transparent px-0 py-2 pr-12 placeholder-transparent outline-none font-body font-medium transition-colors duration-200 border-b-2 border-outline-variant/50 focus:border-primary text-on-surface"
              />
              <label
                className="absolute left-0 top-6 text-xs tracking-[0.2em] uppercase font-bold transition-all duration-300 peer-focus:top-0 peer-focus:text-[10px] peer-valid:top-0 peer-valid:text-[10px] text-on-surface-variant peer-focus:text-primary"
                htmlFor="login-password"
              >
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                className="absolute right-0 top-6 text-xs uppercase tracking-widest font-bold transition-colors text-on-surface-variant hover:text-primary"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>

            <button
              id="login-submit-btn"
              type="submit"
              disabled={loading}
              className="w-full py-3.5 text-xs tracking-[0.2em] uppercase font-black text-white mt-8 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed bg-primary shadow-neon-primary rounded"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>

            <div className="text-center mt-3">
              <Link
                to="/forgot-password"
                className="text-xs uppercase tracking-widest font-bold transition-colors text-on-surface-variant hover:text-primary"
              >
                Forgot Password?
              </Link>
            </div>
          </form>

          <p className="mt-8 text-center text-xs tracking-widest uppercase font-bold text-on-surface-variant">
            No account?{' '}
            <Link
              to="/register"
              className="font-black transition-colors text-primary hover:text-primary/80"
            >
              Register
            </Link>
          </p>
        </div>
      </div>

      <p className="mt-8 text-[10px] uppercase tracking-[0.3em] text-center font-bold animate-fade-in text-outline-variant">
        Predict · Compete · Glory
      </p>
    </div>
  );
}
