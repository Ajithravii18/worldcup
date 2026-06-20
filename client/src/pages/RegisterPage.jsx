import { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import confetti from 'canvas-confetti';
import api from '../api/axios';

export default function RegisterPage() {
  const { login: authLogin } = useAuth();
  const navigate = useNavigate();

  // Step: 'form' | 'otp' | 'success'
  const [step, setStep] = useState('form');

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // OTP state
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const otpRefs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  // Step 1 — submit form, send OTP
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

  // Step 2 — verify OTP and create account
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    const otpCode = otp.join('');
    if (otpCode.length < 6) return setError('Please enter the full 6-digit code');

    setLoading(true);
    try {
      const res = await api.post('/auth/register/verify-otp', { email, otp: otpCode });
      // Manually set auth context with the returned token
      authLogin && localStorage.setItem('token', res.data.token);
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
      setResendCooldown((c) => {
        if (c <= 1) { clearInterval(interval); return 0; }
        return c - 1;
      });
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
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs[index - 1].current?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(''));
      otpRefs[5].current?.focus();
    }
  };

  // ─── Success Screen ───────────────────────────────────────────
  if (step === 'success') {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center text-center p-6 animate-fade-in relative z-50">
        <div className="absolute inset-0 -z-10" style={{ background: 'linear-gradient(135deg, rgba(10, 14, 26, 0.85) 0%, rgba(13, 21, 48, 0.92) 100%)' }} />
        <div className="text-8xl mb-6 animate-bounce">🎖️</div>
        <h1 className="font-display text-5xl text-wc-gold tracking-widest animate-pulse mb-3">WARRIOR REGISTERED!</h1>
        <p className="text-white/80 text-lg uppercase tracking-wide">Welcome to the battle of predictions</p>
        <div className="mt-8 flex items-center justify-center gap-2 text-white/50 animate-pulse">
          <div className="w-2.5 h-2.5 bg-wc-gold rounded-full animate-ping" />
          <span className="text-xs uppercase tracking-widest font-semibold">Entering Arena...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center relative overflow-hidden px-4 bg-transparent">

      <Link to="/" className="absolute top-6 left-6 text-white/50 hover:text-white flex items-center gap-2 text-xs tracking-widest uppercase transition-colors z-50">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back
      </Link>

      <div className="mb-6 animate-pulse text-center relative z-10">
        <h1 className="font-display text-4xl sm:text-5xl leading-none tracking-[0.25em] font-black text-white drop-shadow-xl">LUCKY STAR FC</h1>
        <p className="text-xs sm:text-sm text-wc-gold tracking-[0.4em] uppercase leading-none mt-3 font-bold">PREDICTIONS</p>
      </div>

      <div className="w-full max-w-sm animate-slide-up relative z-10">
        <div className="relative p-8 bg-[#050810] border border-white/10 rounded-none overflow-hidden shadow-2xl">

          {/* Loading bar */}
          {loading && (
            <div className="absolute top-0 left-0 w-full h-[2px] bg-white/10 overflow-hidden">
              <div className="h-full bg-[#050810] w-1/2 animate-[slide_1s_ease-in-out_infinite]" />
            </div>
          )}

          {/* Step indicator */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className={`w-2 h-2 rounded-full transition-all ${step === 'form' ? 'bg-[#050810] scale-125' : 'bg-emerald-500'}`} />
            <div className={`h-px w-8 transition-all ${step === 'otp' || step === 'success' ? 'bg-emerald-500' : 'bg-[#050810]/20'}`} />
            <div className={`w-2 h-2 rounded-full transition-all ${step === 'otp' ? 'bg-[#050810] scale-125' : step === 'success' ? 'bg-emerald-500' : 'bg-[#050810]/20'}`} />
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-none text-sm text-red-300 font-medium animate-fade-in"
              style={{ background: 'rgba(220, 38, 38, 0.15)', border: '1px solid rgba(220, 38, 38, 0.3)' }}>
              ⚠️ {error}
            </div>
          )}

          {/* ── STEP 1: Registration Form ── */}
          {step === 'form' && (
            <>
              <h2 className="font-display text-xl text-white tracking-[0.2em] mb-8 text-center uppercase font-bold">CREATE ACCOUNT</h2>
              <form id="register-form" onSubmit={handleSendOtp} className={`space-y-6 transition-opacity duration-300 ${loading ? 'opacity-50' : ''}`}>
                <div className="relative group pt-4">
                  <input id="register-name" type="text" value={name} onChange={(e) => setName(e.target.value)}
                    placeholder=" " required autoComplete="name"
                    className="peer w-full bg-transparent border-b border-white/20 px-0 py-2 text-white placeholder-transparent focus:border-white focus:outline-none transition-colors duration-300 font-body" />
                  <label className="absolute left-0 top-6 text-white/50 text-xs tracking-[0.2em] uppercase transition-all duration-300 peer-focus:top-0 peer-focus:text-[10px] peer-focus:text-white peer-valid:top-0 peer-valid:text-[10px] peer-valid:text-white/40" htmlFor="register-name">Full Name</label>
                </div>

                <div className="relative group pt-4">
                  <input id="register-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder=" " required autoComplete="email"
                    className="peer w-full bg-transparent border-b border-white/20 px-0 py-2 text-white placeholder-transparent focus:border-white focus:outline-none transition-colors duration-300 font-body" />
                  <label className="absolute left-0 top-6 text-white/50 text-xs tracking-[0.2em] uppercase transition-all duration-300 peer-focus:top-0 peer-focus:text-[10px] peer-focus:text-white peer-valid:top-0 peer-valid:text-[10px] peer-valid:text-white/40" htmlFor="register-email">Email</label>
                </div>

                <div className="relative group pt-4">
                  <input id="register-password" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)}
                    placeholder=" " required autoComplete="new-password"
                    className="peer w-full bg-transparent border-b border-white/20 px-0 py-2 pr-10 text-white placeholder-transparent focus:border-white focus:outline-none transition-colors duration-300 font-body" />
                  <label className="absolute left-0 top-6 text-white/50 text-xs tracking-[0.2em] uppercase transition-all duration-300 peer-focus:top-0 peer-focus:text-[10px] peer-focus:text-white peer-valid:top-0 peer-valid:text-[10px] peer-valid:text-white/40" htmlFor="register-password">Password</label>
                  <button type="button" onClick={() => setShowPassword(v => !v)} className="absolute right-0 top-6 text-white/50 hover:text-white text-xs uppercase tracking-widest transition-colors duration-300" aria-label="Toggle password visibility">
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>

                <div className="relative group pt-4">
                  <input id="register-confirm" type={showPassword ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder=" " required autoComplete="new-password"
                    className="peer w-full bg-transparent border-b border-white/20 px-0 py-2 text-white placeholder-transparent focus:border-white focus:outline-none transition-colors duration-300 font-body" />
                  <label className="absolute left-0 top-6 text-white/50 text-xs tracking-[0.2em] uppercase transition-all duration-300 peer-focus:top-0 peer-focus:text-[10px] peer-focus:text-white peer-valid:top-0 peer-valid:text-[10px] peer-valid:text-white/40" htmlFor="register-confirm">Confirm Password</label>
                </div>

                <button id="register-submit-btn" type="submit" disabled={loading}
                  className="w-full py-4 text-xs tracking-[0.2em] uppercase font-bold text-white bg-transparent border border-white hover:bg-white hover:text-black transition-all duration-300 mt-8 disabled:opacity-50">
                  {loading ? 'Sending OTP...' : 'Send Verification Code'}
                </button>
              </form>
            </>
          )}

          {/* ── STEP 2: OTP Verification ── */}
          {step === 'otp' && (
            <>
              <h2 className="font-display text-xl text-white tracking-[0.2em] mb-2 text-center uppercase font-bold">VERIFY EMAIL</h2>
              <p className="text-center text-white/50 text-[11px] tracking-widest uppercase mb-8">
                Code sent to <span className="text-white/70">{email}</span>
              </p>

              <form id="otp-form" onSubmit={handleVerifyOtp} className={`transition-opacity duration-300 ${loading ? 'opacity-50' : ''}`}>
                {/* 6-box OTP input */}
                <div className="flex justify-center gap-3 mb-8" onPaste={handleOtpPaste}>
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      ref={otpRefs[i]}
                      id={`otp-${i}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpInput(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                      className={`w-11 h-14 text-center text-2xl font-black text-white bg-transparent border-b-2 transition-all outline-none ${
                        digit ? 'border-emerald-400' : 'border-white/20 focus:border-white'
                      }`}
                    />
                  ))}
                </div>

                <button id="otp-verify-btn" type="submit" disabled={loading}
                  className="w-full py-4 text-xs tracking-[0.2em] uppercase font-bold text-white bg-transparent border border-white hover:bg-white hover:text-black transition-all duration-300 disabled:opacity-50">
                  {loading ? 'Verifying...' : 'Confirm & Create Account'}
                </button>
              </form>

              <div className="mt-6 flex flex-col items-center gap-3">
                <button onClick={handleResendOtp} disabled={resendCooldown > 0 || loading}
                  className="text-xs text-white/50 hover:text-white uppercase tracking-widest transition-colors disabled:opacity-30">
                  {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Code'}
                </button>
                <button onClick={() => { setStep('form'); setOtp(['','','','','','']); setError(''); }}
                  className="text-xs text-white/30 hover:text-white/60 uppercase tracking-widest transition-colors">
                  ← Change Email
                </button>
              </div>
            </>
          )}

          <p className="mt-8 text-center text-xs tracking-widest text-white/50 uppercase">
            Already have an account?{' '}
            <Link to="/login" className="text-white font-bold hover:underline">Login</Link>
          </p>
        </div>
      </div>

      <p className="mt-8 text-white/30 text-[10px] uppercase tracking-[0.3em] text-center animate-fade-in relative z-10">
        Predict. Compete. Glory awaits.
      </p>
    </div>
  );
}
