import { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import confetti from 'canvas-confetti';
import api from '../api/axios';
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

function FMInput({ id, label, type, value, onChange, required, autoComplete, extra }) {
  return (
    <motion.div variants={itemVariants} className="relative group pt-4">
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        autoComplete={autoComplete}
        placeholder=" "
        className="peer w-full bg-transparent px-0 py-2.5 placeholder-transparent outline-none font-body font-medium transition-colors duration-300 border-b-2 border-white/20 focus:border-primary text-white text-lg"
        {...extra}
      />
      <label
        htmlFor={id}
        className="absolute left-0 top-7 text-xs tracking-[0.2em] uppercase font-bold transition-all duration-300 peer-focus:top-0 peer-focus:text-[10px] peer-valid:top-0 peer-valid:text-[10px] text-outline-variant peer-focus:text-primary"
      >
        {label}
      </label>
    </motion.div>
  );
}

export default function RegisterPage() {
  const { setAuthData } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState('form');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const otpRefs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) return setError('Passwords do not match');
    if (password.length < 6) return setError('Password must be at least 6 characters');
    setLoading(true);
    try {
      await api.post('/auth/register/send-otp', { name, email, password });
      setStep('otp');
      startResendCooldown();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    const otpCode = otp.join('');
    if (otpCode.length < 6) return setError('Please enter the full 6-digit code');
    setLoading(true);
    try {
      const res = await api.post('/auth/register/verify-otp', { email, otp: otpCode });
      setAuthData(res.data);
      setStep('success');
      confetti({ particleCount: 150, spread: 85, origin: { y: 0.5 } });
      setTimeout(() => navigate('/app'), 1800);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;
    setError('');
    setLoading(true);
    try {
      await api.post('/auth/register/send-otp', { name, email, password });
      startResendCooldown();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend OTP.');
    } finally {
      setLoading(false);
    }
  };

  const startResendCooldown = () => {
    setResendCooldown(60);
    const interval = setInterval(() => {
      setResendCooldown(c => { if (c <= 1) { clearInterval(interval); return 0; } return c - 1; });
    }, 1000);
  };

  const handleOtpInput = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) otpRefs[index + 1].current?.focus();
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) otpRefs[index - 1].current?.focus();
  };

  const handleOtpPaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) { setOtp(pasted.split('')); otpRefs[5].current?.focus(); }
  };

  if (step === 'success') {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-dvh flex flex-col items-center justify-center text-center p-6 bg-transparent bg-[radial-gradient(#ffffff22_1px,transparent_1px)] [background-size:24px_24px]">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', bounce: 0.5 }} className="w-24 h-24 mb-6 flex items-center justify-center bg-primary rounded-3xl shadow-neon-primary">
          <Icon name="emoji_events" className="text-black text-6xl" />
        </motion.div>
        <h1 className="font-display text-5xl tracking-widest mb-3 font-black text-white drop-shadow-md uppercase">REGISTERED!</h1>
        <p className="text-sm uppercase tracking-widest font-bold text-outline-variant">Welcome to Lucky Star FC</p>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-x-hidden px-4 py-12 bg-transparent bg-[radial-gradient(#ffffff22_1px,transparent_1px)] [background-size:24px_24px]">

      <Link to="/" className="absolute top-6 left-6 z-50">
        <motion.div whileHover={{ x: -5 }} className="flex items-center gap-2 text-xs tracking-[0.2em] uppercase font-bold text-outline-variant hover:text-white">
          <Icon name="chevron_left" className="text-lg" /> Back
        </motion.div>
      </Link>

      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="relative z-10 w-full max-w-md flex flex-col items-center">
        <motion.div variants={itemVariants} className="mb-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <motion.div whileHover={{ scale: 1.05 }} className="flex items-center justify-center">
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/2026_FIFA_World_Cup_emblem.svg/1920px-2026_FIFA_World_Cup_emblem.svg.png" alt="World Cup 2026 Emblem" className="h-10 w-auto drop-shadow-[0_0_15px_rgba(0,255,135,0.4)]" />
            </motion.div>
            <h1 className="font-display text-3xl sm:text-4xl font-black tracking-widest uppercase text-white drop-shadow-lg">Lucky Star FC</h1>
          </div>
          <p className="text-xs tracking-[0.4em] uppercase font-bold text-outline-variant drop-shadow-sm">Join the arena</p>
        </motion.div>

        <motion.div variants={itemVariants} className="w-full relative p-6 overflow-hidden bg-white/10 backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.5)] rounded-[2rem]">

          {loading && (
            <div className="absolute top-0 left-0 w-full h-[2px] overflow-hidden bg-white/10">
              <div className="h-full w-1/2 animate-[slide_1s_ease-in-out_infinite] bg-primary" />
            </div>
          )}

          <div className="flex items-center justify-center gap-2 mb-6">
            <div className={`w-6 h-0.5 transition-all ${step === 'form' ? 'bg-primary shadow-neon-primary' : 'bg-[#22c55e]'}`} />
            <div className={`w-2 h-2 rounded-full transition-all ${step === 'form' ? 'bg-primary shadow-neon-primary' : 'bg-[#22c55e]'}`} />
            <div className={`w-6 h-0.5 transition-all ${step === 'otp' ? 'bg-primary shadow-neon-primary' : step === 'success' ? 'bg-[#22c55e]' : 'bg-white/20'}`} />
            <div className={`w-2 h-2 rounded-full transition-all ${step === 'otp' ? 'bg-primary shadow-neon-primary' : 'bg-white/20'}`} />
          </div>

          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 text-sm font-bold bg-error/20 border border-error/50 text-error-container rounded-xl text-center backdrop-blur-md">
              ⚠ {error}
            </motion.div>
          )}

          {step === 'form' && (
            <>
              <h2 className="font-display text-xl tracking-widest mb-6 text-center uppercase text-white">Create Account</h2>
              <form id="register-form" onSubmit={handleSendOtp} className={`space-y-4 transition-opacity ${loading ? 'opacity-50 pointer-events-none' : ''}`}>
                <FMInput id="register-name" label="Full Name" type="text" value={name} onChange={e => setName(e.target.value)} required autoComplete="name" />
                <FMInput id="register-email" label="Email Address" type="email" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email" />

                <motion.div variants={itemVariants} className="relative group pt-4">
                  <input
                    id="register-password" type={showPassword ? 'text' : 'password'} value={password}
                    onChange={e => setPassword(e.target.value)} required autoComplete="new-password" placeholder=" "
                    className="peer w-full bg-transparent px-0 py-2.5 pr-12 placeholder-transparent outline-none font-body font-medium border-b-2 border-white/20 focus:border-primary text-white text-lg transition-colors duration-300"
                  />
                  <label className="absolute left-0 top-7 text-xs tracking-[0.2em] uppercase font-bold transition-all duration-300 peer-focus:top-0 peer-focus:text-[10px] peer-valid:top-0 peer-valid:text-[10px] text-outline-variant peer-focus:text-primary"
                    htmlFor="register-password">Password</label>
                  <button type="button" onClick={() => setShowPassword(v => !v)}
                    className="absolute right-0 top-7 text-[10px] uppercase tracking-widest font-bold text-outline-variant hover:text-white transition-colors">
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </motion.div>

                <FMInput id="register-confirm" label="Confirm Password" type={showPassword ? 'text' : 'password'} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required autoComplete="new-password" />

                <motion.div variants={itemVariants} className="pt-6">
                  <motion.button 
                    whileHover={{ scale: 1.02, backgroundColor: "#22c55e" }}
                    whileTap={{ scale: 0.98 }}
                    id="register-submit-btn" type="submit" disabled={loading}
                    className="w-full py-3.5 text-sm tracking-[0.2em] uppercase font-black text-white transition-all disabled:opacity-40 bg-primary shadow-neon-primary rounded-xl"
                  >
                    {loading ? 'Sending Code...' : 'Send Verification Code'}
                  </motion.button>
                </motion.div>
              </form>
            </>
          )}

          {step === 'otp' && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <h2 className="font-display text-2xl tracking-widest mb-2 text-center uppercase text-white">Verify Email</h2>
              <p className="text-center text-xs tracking-widest uppercase mb-7 font-bold text-outline-variant">
                Code sent to <span className="text-white">{email}</span>
              </p>

              <form id="otp-form" onSubmit={handleVerifyOtp} className={`transition-opacity ${loading ? 'opacity-50 pointer-events-none' : ''}`}>
                <div className="flex justify-center gap-3 mb-8" onPaste={handleOtpPaste}>
                  {otp.map((digit, i) => (
                    <input key={i} ref={otpRefs[i]} id={`otp-${i}`}
                      type="text" inputMode="numeric" maxLength={1} value={digit}
                      onChange={e => handleOtpInput(i, e.target.value)}
                      onKeyDown={e => handleOtpKeyDown(i, e)}
                      className={`w-12 h-14 text-center text-2xl font-black bg-white/5 outline-none transition-colors border-b-2 text-white rounded-t-lg ${digit ? 'border-primary bg-white/10' : 'border-white/20 focus:border-primary/50'}`}
                    />
                  ))}
                </div>

                <motion.button 
                  whileHover={{ scale: 1.02, backgroundColor: "#22c55e" }}
                  whileTap={{ scale: 0.98 }}
                  id="otp-verify-btn" type="submit" disabled={loading}
                  className="w-full py-3.5 text-sm tracking-[0.2em] uppercase font-black text-white transition-all disabled:opacity-40 bg-primary shadow-neon-primary rounded-xl"
                >
                  {loading ? 'Verifying...' : 'Confirm & Create Account'}
                </motion.button>
              </form>

              <div className="mt-8 flex flex-col items-center gap-4">
                <button onClick={handleResendOtp} disabled={resendCooldown > 0 || loading}
                  className="text-xs uppercase tracking-widest font-bold transition-colors disabled:opacity-30 text-outline-variant hover:text-white">
                  {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Code'}
                </button>
                <button onClick={() => { setStep('form'); setOtp(['','','','','','']); setError(''); }}
                  className="text-xs uppercase tracking-widest font-bold transition-colors text-outline-variant hover:text-white">
                  ← Change Email
                </button>
              </div>
            </motion.div>
          )}

          <motion.p variants={itemVariants} className="mt-8 text-center text-[10px] tracking-widest uppercase font-bold text-outline-variant">
            Already have an account?{' '}
            <Link to="/login" className="font-black text-primary hover:text-primary/80 transition-colors ml-1">Login Here</Link>
          </motion.p>
        </motion.div>

        <motion.p variants={itemVariants} className="mt-8 text-[10px] uppercase tracking-[0.4em] text-center font-bold text-outline-variant/50">
          Predict · Compete · Glory
        </motion.p>
      </motion.div>
    </div>
  );
}
