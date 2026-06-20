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
        <div className="absolute inset-0 -z-10 bg-white/90 backdrop-blur-md" />
        <div className="text-8xl mb-6 animate-bounce">🏆</div>
        <h1 className="font-display text-5xl text-theme-primary tracking-widest animate-pulse mb-3 font-black">PROFILE SYNCED!</h1>
        <p className="text-gray-600 text-lg uppercase tracking-wide font-bold">Ready for the Matchday</p>
        <div className="mt-8 flex items-center justify-center gap-2 text-gray-500 animate-pulse">
          <div className="w-2.5 h-2.5 bg-theme-primary rounded-full animate-ping" />
          <span className="text-xs uppercase tracking-widest font-bold">Entering Arena...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center relative overflow-hidden px-4 bg-transparent">

      {/* Back Navigation */}
      <Link 
        to="/" 
        className="absolute top-6 left-6 text-gray-500 hover:text-gray-900 flex items-center gap-2 text-xs tracking-widest uppercase transition-colors z-50 font-bold"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back
      </Link>

      {/* Branding matching LandingPage */}
      <div className="mb-8 text-center relative z-10 animate-fade-in">
        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl leading-none tracking-[0.25em] font-black text-gray-900 drop-shadow-sm animate-pulse">
          LUCKY STAR FC
        </h1>
        <p className="text-xs sm:text-sm text-theme-primary tracking-[0.4em] uppercase leading-none mt-3 font-bold">
          PREDICTIONS
        </p>
      </div>

      {/* Login card */}
      <div
        className="w-full max-w-sm animate-slide-up relative z-10"
      >
        <div className="relative p-8 bg-white border border-gray-100 rounded-xl overflow-hidden shadow-2xl">
          {/* Sleek loading bar */}
          {loading && (
            <div className="absolute top-0 left-0 w-full h-[3px] bg-gray-100 overflow-hidden">
              <div className="h-full bg-theme-primary w-1/2 animate-[slide_1s_ease-in-out_infinite]" />
            </div>
          )}

        <h2 className="font-display text-xl text-gray-900 tracking-[0.2em] mb-8 text-center uppercase font-black">
          SIGN IN
        </h2>

        {error && (
          <div className="mb-4 p-3 rounded-lg text-sm text-red-600 font-bold animate-fade-in"
            style={{ background: 'rgba(220, 38, 38, 0.05)', border: '1px solid rgba(220, 38, 38, 0.2)' }}>
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
              className="peer w-full bg-transparent border-b-2 border-gray-200 px-0 py-2 text-gray-900 placeholder-transparent focus:border-theme-primary focus:outline-none transition-colors duration-300 font-body font-medium"
              autoComplete="email"
            />
            <label 
              className="absolute left-0 top-6 text-gray-400 text-xs tracking-[0.2em] uppercase transition-all duration-300 peer-focus:top-0 peer-focus:text-[10px] peer-focus:text-theme-primary peer-valid:top-0 peer-valid:text-[10px] peer-valid:text-gray-400 font-bold"
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
              className="peer w-full bg-transparent border-b-2 border-gray-200 px-0 py-2 pr-10 text-gray-900 placeholder-transparent focus:border-theme-primary focus:outline-none transition-colors duration-300 font-body font-medium"
              autoComplete="current-password"
            />
            <label 
              className="absolute left-0 top-6 text-gray-400 text-xs tracking-[0.2em] uppercase transition-all duration-300 peer-focus:top-0 peer-focus:text-[10px] peer-focus:text-theme-primary peer-valid:top-0 peer-valid:text-[10px] peer-valid:text-gray-400 font-bold"
              htmlFor="login-password"
            >
              Password
            </label>
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-0 top-6 text-gray-400 hover:text-theme-primary text-xs uppercase tracking-widest transition-colors duration-300 font-bold"
              aria-label="Toggle password visibility"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>

          <button
            id="login-submit-btn"
            type="submit"
            disabled={loading}
            className="w-full py-4 text-xs tracking-[0.2em] uppercase font-black text-white bg-theme-primary hover:bg-blue-700 transition-all duration-300 mt-8 rounded-lg disabled:opacity-50 shadow-md hover:shadow-lg"
          >
            Sign In
          </button>

          <div className="text-center mt-4">
            <Link to="/forgot-password" className="text-gray-500 hover:text-theme-primary text-xs uppercase tracking-widest transition-colors font-bold">
              Forgot Password?
            </Link>
          </div>
        </form>

        <p className="mt-8 text-center text-xs tracking-widest text-gray-500 uppercase font-bold">
          Don't have an account?{' '}
          <Link to="/register" className="text-theme-primary hover:text-blue-700 hover:underline">
            Create Account
          </Link>
        </p>
        </div>
      </div>

      {/* Bottom tagline */}
      <p className="mt-8 text-gray-400 text-[10px] uppercase tracking-[0.3em] text-center animate-fade-in relative z-10 font-bold">
        Predict. Compete. Glory awaits.
      </p>
    </div>
  );
}
