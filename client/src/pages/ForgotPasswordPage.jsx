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
    <div className="min-h-dvh flex flex-col items-center justify-center relative overflow-hidden px-4 bg-transparent">

      <Link to="/login" className="absolute top-6 left-6 text-white/50 hover:text-white flex items-center gap-2 text-xs tracking-widest uppercase transition-colors z-50">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Login
      </Link>

      <div className="mb-6 text-center relative z-10">
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

          {/* Step dots */}
          <div className="flex items-center justify-center gap-2 mb-6">
            {['email', 'otp', 'done'].map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  step === s ? 'bg-[#050810] scale-125' :
                  ['email', 'otp', 'done'].indexOf(step) > i ? 'bg-emerald-500' : 'bg-[#050810]/20'
                }`} />
                {i < 2 && <div className={`h-px w-8 transition-all ${['email', 'otp', 'done'].indexOf(step) > i ? 'bg-emerald-500' : 'bg-[#050810]/20'}`} />}
              </div>
            ))}
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-none text-sm text-red-300 font-medium animate-fade-in"
              style={{ background: 'rgba(220, 38, 38, 0.15)', border: '1px solid rgba(220, 38, 38, 0.3)' }}>
              ⚠️ {error}
            </div>
          )}

          {/* ── Step 1: Email + New Password ── */}
          {step === 'email' && (
            <>
              <h2 className="font-display text-xl text-white tracking-[0.2em] mb-2 text-center uppercase font-bold">FORGOT PASSWORD</h2>
              <p className="text-center text-white/50 text-[11px] tracking-widest uppercase mb-8">Enter your email and a new password</p>

              <form onSubmit={handleSendOtp} className={`space-y-6 transition-opacity ${loading ? 'opacity-50' : ''}`}>
                <div className="relative group pt-4">
                  <input id="forgot-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder=" " required autoComplete="email"
                    className="peer w-full bg-transparent border-b border-white/20 px-0 py-2 text-white placeholder-transparent focus:border-white focus:outline-none transition-colors font-body" />
                  <label className="absolute left-0 top-6 text-white/50 text-xs tracking-[0.2em] uppercase transition-all duration-300 peer-focus:top-0 peer-focus:text-[10px] peer-focus:text-wc-gold peer-valid:top-0 peer-valid:text-[10px] peer-valid:text-white/40" htmlFor="forgot-email">Email</label>
                </div>

                <div className="relative group pt-4">
                  <input id="forgot-new-password" type={showPassword ? 'text' : 'password'} value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                    placeholder=" " required autoComplete="new-password"
                    className="peer w-full bg-transparent border-b border-white/20 px-0 py-2 pr-10 text-white placeholder-transparent focus:border-white focus:outline-none transition-colors font-body" />
                  <label className="absolute left-0 top-6 text-white/50 text-xs tracking-[0.2em] uppercase transition-all duration-300 peer-focus:top-0 peer-focus:text-[10px] peer-focus:text-wc-gold peer-valid:top-0 peer-valid:text-[10px] peer-valid:text-white/40" htmlFor="forgot-new-password">New Password</label>
                  <button type="button" onClick={() => setShowPassword(v => !v)}
                    className="absolute right-0 top-6 text-white/50 hover:text-white text-xs uppercase tracking-widest transition-colors">
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>

                <button type="submit" disabled={loading}
                  className="w-full py-4 text-xs tracking-[0.2em] uppercase font-bold text-white bg-transparent border border-white hover:bg-[#050810] hover:text-black transition-all duration-300 mt-8 disabled:opacity-50">
                  {loading ? 'Sending Code...' : 'Send Verification Code'}
                </button>
              </form>
            </>
          )}

          {/* ── Step 2: OTP ── */}
          {step === 'otp' && (
            <>
              <h2 className="font-display text-xl text-white tracking-[0.2em] mb-2 text-center uppercase font-bold">VERIFY CODE</h2>
              <p className="text-center text-white/50 text-[11px] tracking-widest uppercase mb-8">
                Code sent to <span className="text-white/70">{email}</span>
              </p>

              <form onSubmit={handleVerifyOtp} className={`transition-opacity ${loading ? 'opacity-50' : ''}`}>
                <div className="flex justify-center gap-3 mb-8" onPaste={handleOtpPaste}>
                  {otp.map((digit, i) => (
                    <input key={i} ref={otpRefs[i]} id={`forgot-otp-${i}`}
                      type="text" inputMode="numeric" maxLength={1} value={digit}
                      onChange={(e) => handleOtpInput(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                      className={`w-11 h-14 text-center text-2xl font-black text-white bg-transparent border-b-2 transition-all outline-none ${
                        digit ? 'border-emerald-400' : 'border-white/20 focus:border-white'
                      }`}
                    />
                  ))}
                </div>

                <button type="submit" disabled={loading}
                  className="w-full py-4 text-xs tracking-[0.2em] uppercase font-bold text-white bg-transparent border border-white hover:bg-[#050810] hover:text-black transition-all duration-300 disabled:opacity-50">
                  {loading ? 'Resetting...' : 'Reset Password'}
                </button>
              </form>

              <div className="mt-6 flex flex-col items-center gap-3">
                <button onClick={handleResendOtp} disabled={resendCooldown > 0 || loading}
                  className="text-xs text-white/50 hover:text-white uppercase tracking-widest transition-colors disabled:opacity-30">
                  {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Code'}
                </button>
                <button onClick={() => { setStep('email'); setOtp(['','','','','','']); setError(''); }}
                  className="text-xs text-white/30 hover:text-white/60 uppercase tracking-widest transition-colors">
                  ← Change Email
                </button>
              </div>
            </>
          )}

          {/* ── Step 3: Done ── */}
          {step === 'done' && (
            <div className="text-center py-4 animate-fade-in">
              <div className="text-6xl mb-4">🔓</div>
              <h2 className="font-display text-xl text-emerald-400 tracking-[0.2em] mb-2 uppercase font-bold">PASSWORD RESET!</h2>
              <p className="text-white/50 text-[11px] tracking-widest uppercase mb-8">Your password has been updated successfully.</p>
              <button onClick={() => navigate('/login')}
                className="w-full py-4 text-xs tracking-[0.2em] uppercase font-bold text-white bg-transparent border border-white hover:bg-[#050810] hover:text-black transition-all duration-300">
                Back to Login
              </button>
            </div>
          )}

          {step !== 'done' && (
            <p className="mt-8 text-center text-xs tracking-widest text-white/50 uppercase">
              Remember your password?{' '}
              <Link to="/login" className="text-white font-bold hover:underline">Login</Link>
            </p>
          )}
        </div>
      </div>

      <p className="mt-8 text-white/30 text-[10px] uppercase tracking-[0.3em] text-center animate-fade-in relative z-10">
        Predict. Compete. Glory awaits.
      </p>
    </div>
  );
}
