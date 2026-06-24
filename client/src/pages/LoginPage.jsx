import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import confetti from 'canvas-confetti';
import { motion } from 'framer-motion';
import Icon from '../components/Icon';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

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
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} 
        className="min-h-dvh flex flex-col items-center justify-center text-center p-6 bg-transparent"
      >
        <motion.div 
          initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', bounce: 0.5 }}
          className="w-24 h-24 mb-6 flex items-center justify-center bg-primary rounded-3xl shadow-neon-primary"
        >
          <Icon name="check_circle" className="text-black text-6xl" />
        </motion.div>
        <h1 className="font-display text-5xl tracking-widest mb-3 font-black text-white drop-shadow-md uppercase">WELCOME BACK!</h1>
        <p className="text-sm uppercase tracking-widest font-bold text-outline-variant">Entering the Arena...</p>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-x-hidden px-4 py-12 bg-transparent">

      {/* Back */}
      <Link to="/" className="absolute top-6 left-6 z-50">
        <motion.div whileHover={{ x: -5 }} className="flex items-center gap-2 text-xs tracking-[0.2em] uppercase font-bold text-outline-variant hover:text-white">
          <Icon name="chevron_left" className="text-lg" /> Back
        </motion.div>
      </Link>

      <motion.div 
        variants={containerVariants} initial="hidden" animate="visible"
        className="relative z-10 w-full max-w-md flex flex-col items-center"
      >
        {/* Branding */}
        <motion.div variants={itemVariants} className="mb-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <motion.div whileHover={{ scale: 1.05 }} className="flex items-center justify-center">
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/2026_FIFA_World_Cup_emblem.svg/1920px-2026_FIFA_World_Cup_emblem.svg.png" alt="World Cup 2026 Emblem" className="h-10 w-auto drop-shadow-[0_0_15px_rgba(0,255,135,0.4)]" />
            </motion.div>
            <h1 className="font-display text-3xl sm:text-4xl font-black tracking-widest uppercase text-white drop-shadow-lg">
              Lucky Star FC
            </h1>
          </div>
          <p className="text-xs tracking-[0.4em] uppercase font-bold text-outline-variant drop-shadow-sm">Sign in to the arena</p>
        </motion.div>

        {/* Card */}
        <motion.div variants={itemVariants} className="w-full relative p-6 overflow-hidden bg-white/10 backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.5)] rounded-[2rem]">
          {/* Loading bar */}
          {loading && (
            <div className="absolute top-0 left-0 w-full h-[2px] overflow-hidden bg-white/10">
              <div className="h-full w-1/2 animate-[slide_1s_ease-in-out_infinite] bg-primary" />
            </div>
          )}

          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 text-sm font-bold bg-error/20 border border-error/50 text-error-container rounded-xl text-center backdrop-blur-md">
              ⚠ {error}
            </motion.div>
          )}

          <form id="login-form" onSubmit={handleSubmit} className={`space-y-6 transition-opacity duration-300 ${loading ? 'opacity-50 pointer-events-none' : ''}`}>

            <motion.div variants={itemVariants} className="relative group pt-4">
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder=" "
                required
                autoComplete="email"
                className="peer w-full bg-transparent px-0 py-2.5 placeholder-transparent outline-none font-body font-medium transition-colors duration-300 border-b-2 border-white/20 focus:border-primary text-white text-lg"
              />
              <label
                className="absolute left-0 top-7 text-xs tracking-[0.2em] uppercase font-bold transition-all duration-300 peer-focus:top-0 peer-focus:text-[10px] peer-valid:top-0 peer-valid:text-[10px] text-outline-variant peer-focus:text-primary"
                htmlFor="login-email"
              >
                Email Address
              </label>
            </motion.div>

            <motion.div variants={itemVariants} className="relative group pt-4">
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder=" "
                required
                autoComplete="current-password"
                 className="peer w-full bg-transparent px-0 py-2.5 pr-12 placeholder-transparent outline-none font-body font-medium transition-colors duration-300 border-b-2 border-white/20 focus:border-primary text-white text-lg"
              />
              <label
                className="absolute left-0 top-7 text-xs tracking-[0.2em] uppercase font-bold transition-all duration-300 peer-focus:top-0 peer-focus:text-[10px] peer-valid:top-0 peer-valid:text-[10px] text-outline-variant peer-focus:text-primary"
                htmlFor="login-password"
              >
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                className="absolute right-0 top-7 text-[10px] uppercase tracking-widest font-bold transition-colors text-outline-variant hover:text-white"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </motion.div>

            <motion.div variants={itemVariants} className="pt-4">
              <motion.button
                whileHover={{ scale: 1.02, backgroundColor: "#22c55e" }}
                whileTap={{ scale: 0.98 }}
                id="login-submit-btn"
                type="submit"
                disabled={loading}
                className="w-full py-3.5 text-sm tracking-[0.2em] uppercase font-black text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed bg-primary shadow-neon-primary rounded-xl"
              >
                {loading ? 'Authenticating...' : 'Sign In'}
              </motion.button>
            </motion.div>

            <motion.div variants={itemVariants} className="text-center mt-4">
              <Link to="/forgot-password" className="text-[10px] uppercase tracking-widest font-bold transition-colors text-outline-variant hover:text-white">
                Forgot Password?
              </Link>
            </motion.div>
          </form>

          <motion.p variants={itemVariants} className="mt-10 text-center text-[10px] tracking-widest uppercase font-bold text-outline-variant">
            No account?{' '}
            <Link to="/register" className="font-black transition-colors text-primary hover:text-primary/80 ml-1">
              Register Here
            </Link>
          </motion.p>
        </motion.div>

        <motion.p variants={itemVariants} className="mt-8 text-[10px] uppercase tracking-[0.4em] text-center font-bold text-outline-variant/50">
          Predict · Compete · Glory
        </motion.p>
      </motion.div>
    </div>
  );
}
