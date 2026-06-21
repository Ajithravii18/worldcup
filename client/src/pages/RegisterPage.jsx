import { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import confetti from 'canvas-confetti';
import api from '../api/axios';

// Reusable floating label input for FotMob dark theme
function FMInput({ id, label, type, value, onChange, required, autoComplete, extra }) {
  const [focused, setFocused] = useState(false);
  const filled = value.length > 0;
  return (
    <div className="relative pt-5">
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        autoComplete={autoComplete}
        placeholder=" "
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="peer w-full bg-transparent px-0 py-2 placeholder-transparent outline-none font-body font-medium transition-colors duration-200"
        style={{
          borderBottom: `2px solid ${focused ? '#F26522' : '#e2e8f0'}`,
          color: '#0f172a',
        }}
        {...extra}
      />
      <label
        htmlFor={id}
        className={`absolute left-0 font-bold text-xs tracking-[0.2em] uppercase transition-all duration-200 ${focused || filled ? 'top-0 text-[10px]' : 'top-5'}`}
        style={{ color: focused ? '#F26522' : '#6b7280' }}
      >
        {label}
      </label>
    </div>
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

  // ── Success ──────────────────────────────────────────────────────────────────
  if (step === 'success') {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center text-center p-6 animate-fade-in" style={{ background: '#141921' }}>
        <div className="text-8xl mb-6 animate-bounce">🎖️</div>
        <h1 className="font-display text-4xl tracking-widest animate-pulse mb-3 font-black" style={{ color: '#F26522' }}>REGISTERED!</h1>
        <p className="text-sm uppercase tracking-widest font-bold" style={{ color: '#6b7280' }}>Welcome to Lucky Star FC Predictions</p>
        <div className="mt-8 flex items-center justify-center gap-2 animate-pulse">
          <div className="w-2 h-2 animate-ping" style={{ background: '#F26522' }} />
          <span className="text-xs uppercase tracking-widest font-bold" style={{ color: '#6b7280' }}>Entering Arena...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-4 py-8" style={{ background: '#f8fafc' }}>

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
      <div className="mb-6 text-center animate-fade-in">
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="w-10 h-10 flex items-center justify-center font-black text-white text-2xl font-display" style={{ background: '#F26522' }}>K</div>
          <h1 className="font-display text-3xl font-black tracking-[0.2em] uppercase" style={{ color: '#0f172a' }}>Lucky Star FC</h1>
        </div>
        <p className="text-xs tracking-[0.4em] uppercase font-bold" style={{ color: '#F26522' }}>Predictions</p>
      </div>

      <div className="w-full max-w-sm animate-slide-up">
        <div className="relative p-8 overflow-hidden" style={{ background: '#ffffff', border: '1px solid #e2e8f0' }}>

          {/* Loading bar */}
          {loading && (
            <div className="absolute top-0 left-0 w-full h-[2px] overflow-hidden" style={{ background: '#e2e8f0' }}>
              <div className="h-full w-1/2 animate-[slide_1s_ease-in-out_infinite]" style={{ background: '#F26522' }} />
            </div>
          )}

          {/* Step dots */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-6 h-0.5 transition-all" style={{ background: step === 'form' ? '#F26522' : '#22c55e' }} />
            <div className="w-2 h-2 transition-all" style={{ background: step === 'form' ? '#F26522' : '#22c55e' }} />
            <div className="w-6 h-0.5 transition-all" style={{ background: step === 'otp' ? '#F26522' : step === 'success' ? '#22c55e' : '#e2e8f0' }} />
            <div className="w-2 h-2 transition-all" style={{ background: step === 'otp' ? '#F26522' : '#e2e8f0' }} />
          </div>

          {error && (
            <div className="mb-5 p-3 text-sm font-bold animate-fade-in" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171' }}>
              ⚠ {error}
            </div>
          )}

          {/* ── Step 1: Form ── */}
          {step === 'form' && (
            <>
              <h2 className="font-display text-lg font-black tracking-[0.2em] mb-7 text-center uppercase" style={{ color: '#0f172a' }}>
                Create Account
              </h2>
              <form id="register-form" onSubmit={handleSendOtp} className={`space-y-5 transition-opacity ${loading ? 'opacity-50' : ''}`}>
                <FMInput id="register-name" label="Full Name" type="text" value={name} onChange={e => setName(e.target.value)} required autoComplete="name" />
                <FMInput id="register-email" label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email" />

                <div className="relative pt-5">
                  <input
                    id="register-password" type={showPassword ? 'text' : 'password'} value={password}
                    onChange={e => setPassword(e.target.value)} required autoComplete="new-password" placeholder=" "
                    className="peer w-full bg-transparent px-0 py-2 pr-12 placeholder-transparent outline-none font-body font-medium"
                    style={{ borderBottom: '2px solid #e2e8f0', color: '#0f172a' }}
                    onFocus={e => e.currentTarget.style.borderBottomColor = '#F26522'}
                    onBlur={e => e.currentTarget.style.borderBottomColor = '#e2e8f0'}
                  />
                  <label className="absolute left-0 top-5 text-xs tracking-[0.2em] uppercase font-bold transition-all duration-200 peer-focus:top-0 peer-focus:text-[10px] peer-valid:top-0 peer-valid:text-[10px]"
                    style={{ color: '#6b7280' }} htmlFor="register-password">Password</label>
                  <button type="button" onClick={() => setShowPassword(v => !v)}
                    className="absolute right-0 top-5 text-xs uppercase tracking-widest font-bold"
                    style={{ color: '#6b7280' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#F26522'}
                    onMouseLeave={e => e.currentTarget.style.color = '#6b7280'}>
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>

                <FMInput id="register-confirm" label="Confirm Password" type={showPassword ? 'text' : 'password'} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required autoComplete="new-password" />

                <button id="register-submit-btn" type="submit" disabled={loading}
                  className="w-full py-3.5 text-xs tracking-[0.2em] uppercase font-black text-white mt-4 active:scale-95 transition-all disabled:opacity-40"
                  style={{ background: '#F26522' }}>
                  {loading ? 'Sending Code...' : 'Send Verification Code'}
                </button>
              </form>
            </>
          )}

          {/* ── Step 2: OTP ── */}
          {step === 'otp' && (
            <>
              <h2 className="font-display text-lg font-black tracking-[0.2em] mb-2 text-center uppercase" style={{ color: '#0f172a' }}>
                Verify Email
              </h2>
              <p className="text-center text-[11px] tracking-widest uppercase mb-7 font-bold" style={{ color: '#64748b' }}>
                Code sent to <span style={{ color: '#0f172a' }}>{email}</span>
              </p>

              <form id="otp-form" onSubmit={handleVerifyOtp} className={`transition-opacity ${loading ? 'opacity-50' : ''}`}>
                <div className="flex justify-center gap-3 mb-7" onPaste={handleOtpPaste}>
                  {otp.map((digit, i) => (
                    <input key={i} ref={otpRefs[i]} id={`otp-${i}`}
                      type="text" inputMode="numeric" maxLength={1} value={digit}
                      onChange={e => handleOtpInput(i, e.target.value)}
                      onKeyDown={e => handleOtpKeyDown(i, e)}
                      className="w-11 h-14 text-center text-2xl font-black bg-transparent outline-none transition-colors"
                      style={{
                        borderBottom: `2px solid ${digit ? '#F26522' : '#e2e8f0'}`,
                        color: '#0f172a',
                      }}
                    />
                  ))}
                </div>

                <button id="otp-verify-btn" type="submit" disabled={loading}
                  className="w-full py-3.5 text-xs tracking-[0.2em] uppercase font-black text-white active:scale-95 transition-all disabled:opacity-40"
                  style={{ background: '#F26522' }}>
                  {loading ? 'Verifying...' : 'Confirm & Create Account'}
                </button>
              </form>

              <div className="mt-6 flex flex-col items-center gap-3">
                <button onClick={handleResendOtp} disabled={resendCooldown > 0 || loading}
                  className="text-xs uppercase tracking-widest font-bold transition-colors disabled:opacity-30"
                  style={{ color: '#6b7280' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#F26522'}
                  onMouseLeave={e => e.currentTarget.style.color = '#6b7280'}>
                  {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Code'}
                </button>
                <button onClick={() => { setStep('form'); setOtp(['','','','','','']); setError(''); }}
                  className="text-xs uppercase tracking-widest font-bold transition-colors"
                  style={{ color: '#6b7280' }}>
                  ← Change Email
                </button>
              </div>
            </>
          )}

          <p className="mt-8 text-center text-xs tracking-widest uppercase font-bold" style={{ color: '#6b7280' }}>
            Already have an account?{' '}
            <Link to="/login" className="font-black" style={{ color: '#F26522' }}>Login</Link>
          </p>
        </div>
      </div>

      <p className="mt-6 text-[10px] uppercase tracking-[0.3em] text-center font-bold animate-fade-in" style={{ color: '#cbd5e1' }}>
        Predict · Compete · Glory
      </p>
    </div>
  );
}
