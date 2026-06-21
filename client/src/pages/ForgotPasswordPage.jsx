import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();

  // step: 'email' | 'otp' | 'done'
  const [step, setStep] = useState('email');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const otpRefs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  // Step 1 — send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    if (newPassword.length < 6) return setError('Password must be at least 6 characters');
    setLoading(true);
    try {
      await api.post('/auth/forgot-password/send-otp', { email });
      setStep('otp');
      startResendCooldown();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP. Try again.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2 — verify OTP and reset
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    const code = otp.join('');
    if (code.length < 6) return setError('Please enter the full 6-digit code');
    setLoading(true);
    try {
      await api.post('/auth/forgot-password/verify-otp', { email, otp: code, newPassword });
      setStep('done');
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
      await api.post('/auth/forgot-password/send-otp', { email });
      startResendCooldown();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend OTP.');
    } finally {
      setLoading(false);
    }
  };

  const startResendCooldown = () => {
    setResendCooldown(60);
    const iv = setInterval(() => {
      setResendCooldown(c => { if (c <= 1) { clearInterval(iv); return 0; } return c - 1; });
    }, 1000);
  };

  const handleOtpInput = (i, val) => {
    if (!/^\d*$/.test(val)) return;
    const n = [...otp]; n[i] = val.slice(-1); setOtp(n);
    if (val && i < 5) otpRefs[i + 1].current?.focus();
  };

  const handleOtpKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) otpRefs[i - 1].current?.focus();
  };

  const handleOtpPaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) { setOtp(pasted.split('')); otpRefs[5].current?.focus(); }
  };

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-4" style={{ background: '#141921' }}>

      <Link to="/login" className="absolute top-6 left-6 flex items-center gap-2 text-xs tracking-widest uppercase font-bold transition-colors z-50"
        style={{ color: '#6b7280' }}
        onMouseEnter={e => e.currentTarget.style.color = '#f0f0f0'}
        onMouseLeave={e => e.currentTarget.style.color = '#6b7280'}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Login
      </Link>

      <div className="mb-6 text-center relative z-10">
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="w-10 h-10 flex items-center justify-center font-black text-white text-2xl font-display" style={{ background: '#F26522' }}>K</div>
          <h1 className="font-display text-3xl font-black tracking-[0.2em] uppercase" style={{ color: '#f0f0f0' }}>Lucky Star FC</h1>
        </div>
        <p className="text-xs tracking-[0.4em] uppercase font-bold" style={{ color: '#F26522' }}>Predictions</p>
      </div>

      <div className="w-full max-w-sm animate-slide-up relative z-10">
        <div className="relative p-8 overflow-hidden" style={{ background: '#1e2636', border: '1px solid #2a3347' }}>

          {/* Loading bar */}
          {loading && (
            <div className="absolute top-0 left-0 w-full h-[2px] overflow-hidden" style={{ background: '#2a3347' }}>
              <div className="h-full w-1/2 animate-[slide_1s_ease-in-out_infinite]" style={{ background: '#F26522' }} />
            </div>
          )}

          {/* Step dots */}
          <div className="flex items-center justify-center gap-2 mb-6">
            {['email', 'otp', 'done'].map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className="w-2 h-2 transition-all duration-300" style={{ background: ['email','otp','done'].indexOf(step) >= i ? '#F26522' : '#2a3347' }} />
                {i < 2 && <div className="h-px w-8 transition-all" style={{ background: ['email','otp','done'].indexOf(step) > i ? '#F26522' : '#2a3347' }} />}
              </div>
            ))}
          </div>

          {error && (
            <div className="mb-4 p-3 text-sm font-bold animate-fade-in" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171' }}>
              ⚠ {error}
            </div>
          )}

          {/* Step 1: Email + New Password */}
          {step === 'email' && (
            <>
              <h2 className="font-display text-lg font-black tracking-[0.2em] mb-2 text-center uppercase" style={{ color: '#f0f0f0' }}>Forgot Password</h2>
              <p className="text-center text-[11px] tracking-widest uppercase mb-7 font-bold" style={{ color: '#6b7280' }}>Enter your email and a new password</p>

              <form onSubmit={handleSendOtp} className={`space-y-5 transition-opacity ${loading ? 'opacity-50' : ''}`}>
                <div className="relative pt-4">
                  <input id="forgot-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder=" " required autoComplete="email"
                    className="peer w-full bg-transparent px-0 py-2 placeholder-transparent outline-none font-body font-medium"
                    style={{ borderBottom: '2px solid #2a3347', color: '#f0f0f0' }}
                    onFocus={e => e.currentTarget.style.borderBottomColor = '#F26522'}
                    onBlur={e => e.currentTarget.style.borderBottomColor = '#2a3347'} />
                  <label className="absolute left-0 top-4 text-xs tracking-[0.2em] uppercase font-bold transition-all duration-300 peer-focus:top-0 peer-focus:text-[10px] peer-valid:top-0 peer-valid:text-[10px]" style={{ color: '#6b7280' }} htmlFor="forgot-email">Email</label>
                </div>

                <div className="relative pt-4">
                  <input id="forgot-new-password" type={showPassword ? 'text' : 'password'} value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                    placeholder=" " required autoComplete="new-password"
                    className="peer w-full bg-transparent px-0 py-2 pr-12 placeholder-transparent outline-none font-body font-medium"
                    style={{ borderBottom: '2px solid #2a3347', color: '#f0f0f0' }}
                    onFocus={e => e.currentTarget.style.borderBottomColor = '#F26522'}
                    onBlur={e => e.currentTarget.style.borderBottomColor = '#2a3347'} />
                  <label className="absolute left-0 top-4 text-xs tracking-[0.2em] uppercase font-bold transition-all duration-300 peer-focus:top-0 peer-focus:text-[10px] peer-valid:top-0 peer-valid:text-[10px]" style={{ color: '#6b7280' }} htmlFor="forgot-new-password">New Password</label>
                  <button type="button" onClick={() => setShowPassword(v => !v)}
                    className="absolute right-0 top-4 text-xs uppercase tracking-widest font-bold transition-colors" style={{ color: '#6b7280' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#F26522'} onMouseLeave={e => e.currentTarget.style.color = '#6b7280'}>
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>

                <button type="submit" disabled={loading}
                  className="w-full py-3.5 text-xs tracking-[0.2em] uppercase font-black text-white mt-4 active:scale-95 transition-all disabled:opacity-40"
                  style={{ background: '#F26522' }}>
                  {loading ? 'Sending Code...' : 'Send Verification Code'}
                </button>
              </form>
            </>
          )}

          {/* Step 2: OTP */}
          {step === 'otp' && (
            <>
              <h2 className="font-display text-lg font-black tracking-[0.2em] mb-2 text-center uppercase" style={{ color: '#f0f0f0' }}>Verify Code</h2>
              <p className="text-center text-[11px] tracking-widest uppercase mb-7 font-bold" style={{ color: '#6b7280' }}>
                Code sent to <span style={{ color: '#f0f0f0' }}>{email}</span>
              </p>

              <form onSubmit={handleVerifyOtp} className={`transition-opacity ${loading ? 'opacity-50' : ''}`}>
                <div className="flex justify-center gap-3 mb-7" onPaste={handleOtpPaste}>
                  {otp.map((digit, i) => (
                    <input key={i} ref={otpRefs[i]} id={`forgot-otp-${i}`}
                      type="text" inputMode="numeric" maxLength={1} value={digit}
                      onChange={(e) => handleOtpInput(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                      className="w-11 h-14 text-center text-2xl font-black bg-transparent outline-none transition-colors"
                      style={{ borderBottom: `2px solid ${digit ? '#F26522' : '#2a3347'}`, color: '#f0f0f0' }}
                    />
                  ))}
                </div>

                <button type="submit" disabled={loading}
                  className="w-full py-3.5 text-xs tracking-[0.2em] uppercase font-black text-white active:scale-95 transition-all disabled:opacity-40"
                  style={{ background: '#F26522' }}>
                  {loading ? 'Resetting...' : 'Reset Password'}
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
                <button onClick={() => { setStep('email'); setOtp(['','','','','','']); setError(''); }}
                  className="text-xs uppercase tracking-widest font-bold transition-colors"
                  style={{ color: '#6b7280' }}>
                  ← Change Email
                </button>
              </div>
            </>
          )}

          {/* Step 3: Done */}
          {step === 'done' && (
            <div className="text-center py-4 animate-fade-in">
              <div className="text-6xl mb-4">🔓</div>
              <h2 className="font-display text-xl font-black tracking-[0.2em] mb-2 uppercase" style={{ color: '#22c55e' }}>PASSWORD RESET!</h2>
              <p className="text-[11px] tracking-widest uppercase mb-8 font-bold" style={{ color: '#6b7280' }}>Your password has been updated successfully.</p>
              <button onClick={() => navigate('/login')}
                className="w-full py-3.5 text-xs tracking-[0.2em] uppercase font-black text-white active:scale-95 transition-all"
                style={{ background: '#F26522' }}>
                Back to Login
              </button>
            </div>
          )}

          {step !== 'done' && (
            <p className="mt-8 text-center text-xs tracking-widest uppercase font-bold" style={{ color: '#6b7280' }}>
              Remember your password?{' '}
              <Link to="/login" className="font-black" style={{ color: '#F26522' }}>Login</Link>
            </p>
          )}
        </div>
      </div>

      <p className="mt-8 text-[10px] uppercase tracking-[0.3em] text-center font-bold animate-fade-in" style={{ color: '#2a3347' }}>
        Predict · Compete · Glory
      </p>
    </div>
  );
}
