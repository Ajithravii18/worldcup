import { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import confetti from 'canvas-confetti';
import api from '../api/axios';

export default function RegisterPage() {
  const { setAuthData } = useAuth();
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
      // Manually set auth context with the returned token and user
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
        <div className="absolute inset-0 -z-10 bg-white/90 backdrop-blur-md" />
        <div className="text-8xl mb-6 animate-bounce">🎖️</div>
        <h1 className="font-display text-5xl text-theme-primary tracking-widest animate-pulse mb-3 font-black">WARRIOR REGISTERED!</h1>
        <p className="text-gray-600 text-lg uppercase tracking-wide font-bold">Welcome to the battle of predictions</p>
        <div className="mt-8 flex items-center justify-center gap-2 text-gray-500 animate-pulse">
          <div className="w-2.5 h-2.5 bg-theme-primary rounded-full animate-ping" />
          <span className="text-xs uppercase tracking-widest font-bold">Entering Arena...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center relative overflow-hidden px-4 bg-transparent">

      <Link to="/" className="absolute top-6 left-6 text-gray-500 hover:text-gray-900 flex items-center gap-2 text-xs tracking-widest uppercase transition-colors z-50 font-bold">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back
      </Link>

      <div className="mb-8 text-center relative z-10 animate-fade-in">
        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl leading-none tracking-[0.25em] font-black text-gray-900 drop-shadow-sm animate-pulse">LUCKY STAR FC</h1>
        <p className="text-xs sm:text-sm text-theme-primary tracking-[0.4em] uppercase leading-none mt-3 font-bold">PREDICTIONS</p>
      </div>

      <div className="w-full max-w-sm animate-slide-up relative z-10">
        <div className="relative p-8 bg-white border border-gray-100 rounded-xl overflow-hidden shadow-2xl">

          {/* Loading bar */}
          {loading && (
            <div className="absolute top-0 left-0 w-full h-[3px] bg-gray-100 overflow-hidden">
              <div className="h-full bg-theme-primary w-1/2 animate-[slide_1s_ease-in-out_infinite]" />
            </div>
          )}

          {/* Step indicator */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className={`w-2 h-2 rounded-full transition-all ${step === 'form' ? 'bg-theme-primary scale-125' : 'bg-emerald-500'}`} />
            <div className={`h-px w-8 transition-all ${step === 'otp' || step === 'success' ? 'bg-emerald-500' : 'bg-gray-200'}`} />
            <div className={`w-2 h-2 rounded-full transition-all ${step === 'otp' ? 'bg-theme-primary scale-125' : step === 'success' ? 'bg-emerald-500' : 'bg-gray-200'}`} />
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg text-sm text-red-600 font-bold animate-fade-in"
              style={{ background: 'rgba(220, 38, 38, 0.05)', border: '1px solid rgba(220, 38, 38, 0.2)' }}>
              ⚠️ {error}
            </div>
          )}

          {/* ── STEP 1: Registration Form ── */}
          {step === 'form' && (
            <>
              <h2 className="font-display text-xl text-gray-900 tracking-[0.2em] mb-8 text-center uppercase font-black">CREATE ACCOUNT</h2>
              <form id="register-form" onSubmit={handleSendOtp} className={`space-y-6 transition-opacity duration-300 ${loading ? 'opacity-50' : ''}`}>
                <div className="relative group pt-4">
                  <input id="register-name" type="text" value={name} onChange={(e) => setName(e.target.value)}
                    placeholder=" " required autoComplete="name"
                    className="peer w-full bg-transparent border-b-2 border-gray-200 px-0 py-2 text-gray-900 placeholder-transparent focus:border-theme-primary focus:outline-none transition-colors duration-300 font-body font-medium" />
                  <label className="absolute left-0 top-6 text-gray-400 text-xs tracking-[0.2em] uppercase transition-all duration-300 peer-focus:top-0 peer-focus:text-[10px] peer-focus:text-theme-primary peer-valid:top-0 peer-valid:text-[10px] peer-valid:text-gray-400 font-bold" htmlFor="register-name">Full Name</label>
                </div>

                <div className="relative group pt-4">
                  <input id="register-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder=" " required autoComplete="email"
                    className="peer w-full bg-transparent border-b-2 border-gray-200 px-0 py-2 text-gray-900 placeholder-transparent focus:border-theme-primary focus:outline-none transition-colors duration-300 font-body font-medium" />
                  <label className="absolute left-0 top-6 text-gray-400 text-xs tracking-[0.2em] uppercase transition-all duration-300 peer-focus:top-0 peer-focus:text-[10px] peer-focus:text-theme-primary peer-valid:top-0 peer-valid:text-[10px] peer-valid:text-gray-400 font-bold" htmlFor="register-email">Email</label>
                </div>

                <div className="relative group pt-4">
                  <input id="register-password" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)}
                    placeholder=" " required autoComplete="new-password"
                    className="peer w-full bg-transparent border-b-2 border-gray-200 px-0 py-2 pr-10 text-gray-900 placeholder-transparent focus:border-theme-primary focus:outline-none transition-colors duration-300 font-body font-medium" />
                  <label className="absolute left-0 top-6 text-gray-400 text-xs tracking-[0.2em] uppercase transition-all duration-300 peer-focus:top-0 peer-focus:text-[10px] peer-focus:text-theme-primary peer-valid:top-0 peer-valid:text-[10px] peer-valid:text-gray-400 font-bold" htmlFor="register-password">Password</label>
                  <button type="button" onClick={() => setShowPassword(v => !v)} className="absolute right-0 top-6 text-gray-400 hover:text-theme-primary text-xs uppercase tracking-widest transition-colors duration-300 font-bold" aria-label="Toggle password visibility">
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>

                <div className="relative group pt-4">
                  <input id="register-confirm" type={showPassword ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder=" " required autoComplete="new-password"
                    className="peer w-full bg-transparent border-b-2 border-gray-200 px-0 py-2 text-gray-900 placeholder-transparent focus:border-theme-primary focus:outline-none transition-colors duration-300 font-body font-medium" />
                  <label className="absolute left-0 top-6 text-gray-400 text-xs tracking-[0.2em] uppercase transition-all duration-300 peer-focus:top-0 peer-focus:text-[10px] peer-focus:text-theme-primary peer-valid:top-0 peer-valid:text-[10px] peer-valid:text-gray-400 font-bold" htmlFor="register-confirm">Confirm Password</label>
                </div>

                <button id="register-submit-btn" type="submit" disabled={loading}
                  className="w-full py-4 text-xs tracking-[0.2em] uppercase font-black text-white bg-theme-primary hover:bg-blue-700 transition-all duration-300 mt-8 rounded-lg disabled:opacity-50 shadow-md hover:shadow-lg">
                  {loading ? 'Sending OTP...' : 'Send Verification Code'}
                </button>
              </form>
            </>
          )}

          {/* ── STEP 2: OTP Verification ── */}
          {step === 'otp' && (
            <>
              <h2 className="font-display text-xl text-gray-900 tracking-[0.2em] mb-2 text-center uppercase font-black">VERIFY EMAIL</h2>
              <p className="text-center text-gray-400 text-[11px] tracking-widest uppercase mb-8 font-bold">
                Code sent to <span className="text-gray-600">{email}</span>
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
                      className={`w-11 h-14 text-center text-2xl font-black text-gray-900 bg-transparent border-b-2 transition-all outline-none ${
                        digit ? 'border-theme-primary' : 'border-gray-200 focus:border-theme-primary'
                      }`}
                    />
                  ))}
                </div>

                <button id="otp-verify-btn" type="submit" disabled={loading}
                  className="w-full py-4 text-xs tracking-[0.2em] uppercase font-black text-white bg-theme-primary hover:bg-blue-700 transition-all duration-300 rounded-lg shadow-md hover:shadow-lg disabled:opacity-50">
                  {loading ? 'Verifying...' : 'Confirm & Create Account'}
                </button>
              </form>

              <div className="mt-6 flex flex-col items-center gap-3">
                <button onClick={handleResendOtp} disabled={resendCooldown > 0 || loading}
                  className="text-xs text-gray-500 hover:text-theme-primary uppercase tracking-widest transition-colors disabled:opacity-30 font-bold">
                  {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Code'}
                </button>
                <button onClick={() => { setStep('form'); setOtp(['','','','','','']); setError(''); }}
                  className="text-xs text-gray-400 hover:text-gray-600 uppercase tracking-widest transition-colors font-bold">
                  ← Change Email
                </button>
              </div>
            </>
          )}

          <p className="mt-8 text-center text-xs tracking-widest text-gray-500 uppercase font-bold">
            Already have an account?{' '}
            <Link to="/login" className="text-theme-primary hover:text-blue-700 hover:underline">Login</Link>
          </p>
        </div>
      </div>

      <p className="mt-8 text-gray-400 text-[10px] uppercase tracking-[0.3em] text-center animate-fade-in relative z-10 font-bold">
        Predict. Compete. Glory awaits.
      </p>
    </div>
  );
}
