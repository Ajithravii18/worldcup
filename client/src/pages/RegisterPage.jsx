import { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import confetti from 'canvas-confetti';
import api from '../api/axios';

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
        className={`peer w-full bg-transparent px-0 py-2 placeholder-transparent outline-none font-body font-medium transition-colors duration-200 border-b-2 text-on-surface ${focused ? 'border-primary' : 'border-outline-variant/50'}`}
        {...extra}
      />
      <label
        htmlFor={id}
        className={`absolute left-0 font-bold text-xs tracking-[0.2em] uppercase transition-all duration-200 ${focused || filled ? 'top-0 text-[10px]' : 'top-5'} ${focused ? 'text-primary' : 'text-on-surface-variant'}`}
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

  if (step === 'success') {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center text-center p-6 animate-fade-in bg-surface">
        <div className="text-8xl mb-6 animate-bounce">🎖️</div>
        <h1 className="font-display text-4xl tracking-widest animate-pulse mb-3 font-black text-primary">REGISTERED!</h1>
        <p className="text-sm uppercase tracking-widest font-bold text-on-surface-variant">Welcome to Lucky Star FC Predictions</p>
        <div className="mt-8 flex items-center justify-center gap-2 animate-pulse">
          <div className="w-2 h-2 animate-ping bg-primary rounded-full" />
          <span className="text-xs uppercase tracking-widest font-bold text-on-surface-variant">Entering Arena...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-4 py-8 bg-surface">

      <Link
        to="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-xs tracking-widest uppercase font-bold transition-colors z-50 text-on-surface-variant hover:text-on-surface"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back
      </Link>

      <div className="mb-6 text-center animate-fade-in">
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="w-10 h-10 flex items-center justify-center font-black text-white text-2xl font-display bg-primary shadow-neon-primary rounded">K</div>
          <h1 className="font-display text-3xl font-black tracking-[0.2em] uppercase text-on-surface">Lucky Star FC</h1>
        </div>
        <p className="text-xs tracking-[0.4em] uppercase font-bold text-primary">Predictions</p>
      </div>

      <div className="w-full max-w-sm animate-slide-up">
        <div className="relative p-8 overflow-hidden bg-white border border-outline-variant/30 shadow-md rounded-xl">

          {loading && (
            <div className="absolute top-0 left-0 w-full h-[2px] overflow-hidden bg-outline-variant/30">
              <div className="h-full w-1/2 animate-[slide_1s_ease-in-out_infinite] bg-primary" />
            </div>
          )}

          <div className="flex items-center justify-center gap-2 mb-6">
            <div className={`w-6 h-0.5 transition-all ${step === 'form' ? 'bg-primary' : 'bg-[#22c55e]'}`} />
            <div className={`w-2 h-2 rounded-full transition-all ${step === 'form' ? 'bg-primary' : 'bg-[#22c55e]'}`} />
            <div className={`w-6 h-0.5 transition-all ${step === 'otp' ? 'bg-primary' : step === 'success' ? 'bg-[#22c55e]' : 'bg-outline-variant/30'}`} />
            <div className={`w-2 h-2 rounded-full transition-all ${step === 'otp' ? 'bg-primary' : 'bg-outline-variant/30'}`} />
          </div>

          {error && (
            <div className="mb-5 p-3 text-sm font-bold animate-fade-in bg-error/10 border border-error/30 text-error rounded">
              ⚠ {error}
            </div>
          )}

          {step === 'form' && (
            <>
              <h2 className="font-display text-lg font-black tracking-[0.2em] mb-7 text-center uppercase text-on-surface">
                Create Account
              </h2>
              <form id="register-form" onSubmit={handleSendOtp} className={`space-y-5 transition-opacity ${loading ? 'opacity-50' : ''}`}>
                <FMInput id="register-name" label="Full Name" type="text" value={name} onChange={e => setName(e.target.value)} required autoComplete="name" />
                <FMInput id="register-email" label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email" />

                <div className="relative pt-5">
                  <input
                    id="register-password" type={showPassword ? 'text' : 'password'} value={password}
                    onChange={e => setPassword(e.target.value)} required autoComplete="new-password" placeholder=" "
                    className="peer w-full bg-transparent px-0 py-2 pr-12 placeholder-transparent outline-none font-body font-medium border-b-2 border-outline-variant/50 focus:border-primary text-on-surface transition-colors duration-200"
                  />
                  <label className="absolute left-0 top-5 text-xs tracking-[0.2em] uppercase font-bold transition-all duration-200 peer-focus:top-0 peer-focus:text-[10px] peer-valid:top-0 peer-valid:text-[10px] text-on-surface-variant peer-focus:text-primary"
                    htmlFor="register-password">Password</label>
                  <button type="button" onClick={() => setShowPassword(v => !v)}
                    className="absolute right-0 top-5 text-xs uppercase tracking-widest font-bold text-on-surface-variant hover:text-primary transition-colors">
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>

                <FMInput id="register-confirm" label="Confirm Password" type={showPassword ? 'text' : 'password'} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required autoComplete="new-password" />

                <button id="register-submit-btn" type="submit" disabled={loading}
                  className="w-full py-3.5 text-xs tracking-[0.2em] uppercase font-black text-white mt-4 active:scale-95 transition-all disabled:opacity-40 bg-primary shadow-neon-primary rounded">
                  {loading ? 'Sending Code...' : 'Send Verification Code'}
                </button>
              </form>
            </>
          )}

          {step === 'otp' && (
            <>
              <h2 className="font-display text-lg font-black tracking-[0.2em] mb-2 text-center uppercase text-on-surface">
                Verify Email
              </h2>
              <p className="text-center text-[11px] tracking-widest uppercase mb-7 font-bold text-on-surface-variant">
                Code sent to <span className="text-on-surface">{email}</span>
              </p>

              <form id="otp-form" onSubmit={handleVerifyOtp} className={`transition-opacity ${loading ? 'opacity-50' : ''}`}>
                <div className="flex justify-center gap-3 mb-7" onPaste={handleOtpPaste}>
                  {otp.map((digit, i) => (
                    <input key={i} ref={otpRefs[i]} id={`otp-${i}`}
                      type="text" inputMode="numeric" maxLength={1} value={digit}
                      onChange={e => handleOtpInput(i, e.target.value)}
                      onKeyDown={e => handleOtpKeyDown(i, e)}
                      className={`w-11 h-14 text-center text-2xl font-black bg-transparent outline-none transition-colors border-b-2 text-on-surface ${digit ? 'border-primary' : 'border-outline-variant/50'}`}
                    />
                  ))}
                </div>

                <button id="otp-verify-btn" type="submit" disabled={loading}
                  className="w-full py-3.5 text-xs tracking-[0.2em] uppercase font-black text-white active:scale-95 transition-all disabled:opacity-40 bg-primary shadow-neon-primary rounded">
                  {loading ? 'Verifying...' : 'Confirm & Create Account'}
                </button>
              </form>

              <div className="mt-6 flex flex-col items-center gap-3">
                <button onClick={handleResendOtp} disabled={resendCooldown > 0 || loading}
                  className="text-xs uppercase tracking-widest font-bold transition-colors disabled:opacity-30 text-on-surface-variant hover:text-primary">
                  {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Code'}
                </button>
                <button onClick={() => { setStep('form'); setOtp(['','','','','','']); setError(''); }}
                  className="text-xs uppercase tracking-widest font-bold transition-colors text-on-surface-variant hover:text-on-surface">
                  ← Change Email
                </button>
              </div>
            </>
          )}

          <p className="mt-8 text-center text-xs tracking-widest uppercase font-bold text-on-surface-variant">
            Already have an account?{' '}
            <Link to="/login" className="font-black text-primary hover:text-primary/80 transition-colors">Login</Link>
          </p>
        </div>
      </div>

      <p className="mt-6 text-[10px] uppercase tracking-[0.3em] text-center font-bold animate-fade-in text-outline-variant">
        Predict · Compete · Glory
      </p>
    </div>
  );
}
