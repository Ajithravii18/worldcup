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
      <div className="min-h-dvh flex flex-col items-center justify-center text-center p-6 animate-fade-in" style={{ background: '#f8fafc' }}>
        <div className="text-8xl mb-6 animate-bounce">🏆</div>
        <h1 className="font-display text-4xl tracking-widest animate-pulse mb-3 font-black" style={{ color: '#F26522' }}>WELCOME BACK!</h1>
        <p className="text-sm uppercase tracking-widest font-bold" style={{ color: '#64748b' }}>Entering the Arena...</p>
        <div className="mt-8 flex items-center justify-center gap-2 animate-pulse">
          <div className="w-2 h-2 animate-ping" style={{ background: '#F26522' }} />
          <span className="text-xs uppercase tracking-widest font-bold" style={{ color: '#64748b' }}>Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-4" style={{ background: '#f8fafc' }}>

      {/* Back */}
      <Link
        to="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-xs tracking-widest uppercase font-bold transition-colors z-50"
        style={{ color: '#64748b' }}
        onMouseEnter={e => e.currentTarget.style.color = '#0f172a'}
        onMouseLeave={e => e.currentTarget.style.color = '#64748b'}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back
      </Link>

      {/* Branding */}
      <div className="mb-8 text-center animate-fade-in">
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="w-10 h-10 flex items-center justify-center font-black text-white text-2xl font-display" style={{ background: '#F26522' }}>
            K
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-black tracking-[0.2em] uppercase" style={{ color: '#0f172a' }}>
            Lucky Star FC
          </h1>
        </div>
        <p className="text-xs tracking-[0.4em] uppercase font-bold" style={{ color: '#F26522' }}>Predictions</p>
      </div>

      {/* Card */}
      <div className="w-full max-w-sm animate-slide-up">
        <div className="relative p-8 overflow-hidden" style={{ background: '#ffffff', border: '1px solid #e2e8f0' }}>

          {/* Loading bar */}
          {loading && (
            <div className="absolute top-0 left-0 w-full h-[2px] overflow-hidden" style={{ background: '#e2e8f0' }}>
              <div className="h-full w-1/2 animate-[slide_1s_ease-in-out_infinite]" style={{ background: '#F26522' }} />
            </div>
          )}

          <h2 className="font-display text-lg font-black tracking-[0.2em] mb-8 text-center uppercase" style={{ color: '#0f172a' }}>
            Sign In
          </h2>

          {error && (
            <div className="mb-5 p-3 text-sm font-bold animate-fade-in" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171' }}>
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
                className="peer w-full bg-transparent px-0 py-2 placeholder-transparent outline-none font-body font-medium transition-colors duration-200"
                style={{ borderBottom: '2px solid #e2e8f0', color: '#0f172a' }}
                onFocus={e => e.currentTarget.style.borderBottomColor = '#F26522'}
                onBlur={e => e.currentTarget.style.borderBottomColor = '#e2e8f0'}
              />
              <label
                className="absolute left-0 top-6 text-xs tracking-[0.2em] uppercase font-bold transition-all duration-300 peer-focus:top-0 peer-focus:text-[10px] peer-valid:top-0 peer-valid:text-[10px]"
                style={{ color: '#6b7280' }}
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
                 className="peer w-full bg-transparent px-0 py-2 pr-12 placeholder-transparent outline-none font-body font-medium transition-colors duration-200"
                style={{ borderBottom: '2px solid #e2e8f0', color: '#0f172a' }}
                onFocus={e => e.currentTarget.style.borderBottomColor = '#F26522'}
                onBlur={e => e.currentTarget.style.borderBottomColor = '#e2e8f0'}
              />
              <label
                className="absolute left-0 top-6 text-xs tracking-[0.2em] uppercase font-bold transition-all duration-300 peer-focus:top-0 peer-focus:text-[10px] peer-valid:top-0 peer-valid:text-[10px]"
                style={{ color: '#6b7280' }}
                htmlFor="login-password"
              >
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                className="absolute right-0 top-6 text-xs uppercase tracking-widest font-bold transition-colors"
                style={{ color: '#6b7280' }}
                onMouseEnter={e => e.currentTarget.style.color = '#F26522'}
                onMouseLeave={e => e.currentTarget.style.color = '#6b7280'}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>

            <button
              id="login-submit-btn"
              type="submit"
              disabled={loading}
              className="w-full py-3.5 text-xs tracking-[0.2em] uppercase font-black text-white mt-8 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: '#F26522' }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>

            <div className="text-center mt-3">
              <Link
                to="/forgot-password"
                className="text-xs uppercase tracking-widest font-bold transition-colors"
                style={{ color: '#6b7280' }}
                onMouseEnter={e => e.currentTarget.style.color = '#F26522'}
                onMouseLeave={e => e.currentTarget.style.color = '#6b7280'}
              >
                Forgot Password?
              </Link>
            </div>
          </form>

          <p className="mt-8 text-center text-xs tracking-widest uppercase font-bold" style={{ color: '#6b7280' }}>
            No account?{' '}
            <Link
              to="/register"
              className="font-black transition-colors"
              style={{ color: '#F26522' }}
            >
              Register
            </Link>
          </p>
        </div>
      </div>

      <p className="mt-8 text-[10px] uppercase tracking-[0.3em] text-center font-bold animate-fade-in" style={{ color: '#cbd5e1' }}>
        Predict · Compete · Glory
      </p>
    </div>
  );
}
