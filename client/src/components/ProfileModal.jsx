import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import UserAvatar, { AVATARS } from './UserAvatar';
import api from '../api/axios';
import confetti from 'canvas-confetti';

/**
 * ProfileModal — A bottom-sheet style drawer containing the user settings
 * to customize display name and jersey avatar. Opened from Navbar.
 */
export default function ProfileModal({ isOpen, onClose }) {
  const { user, updateUserProfile } = useAuth();
  
  const [name, setName] = useState(user?.name || '');
  const [selectedAvatar, setSelectedAvatar] = useState(user?.avatar || 'br_dribbler');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [animate, setAnimate] = useState(false);

  // Change-password state
  const [pwSection, setPwSection] = useState(false); // show/hide section
  const [pwStep, setPwStep] = useState('idle'); // 'idle' | 'sent' | 'done'
  const [newPassword, setNewPassword] = useState('');
  const [pwOtp, setPwOtp] = useState(['', '', '', '', '', '']);
  const pwOtpRefs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];
  const [pwLoading, setPwLoading] = useState(false);
  const [pwError, setPwError] = useState('');
  const [pwCooldown, setPwCooldown] = useState(0);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setName(user?.name || '');
      setSelectedAvatar(user?.avatar || 'br_dribbler');
      const timer = setTimeout(() => setAnimate(true), 50);
      return () => clearTimeout(timer);
    } else {
      document.body.style.overflow = '';
      setAnimate(false);
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!name.trim()) {
      setError('Display name is required');
      return;
    }

    setSaving(true);
    try {
      const res = await api.put('/users/profile', {
        name: name.trim(),
        avatar: selectedAvatar,
      });

      updateUserProfile(res.data);
      setSuccess(true);
      
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.5 },
        colors: ['#4be277', '#22c55e', '#6bff8f']
      });

      setTimeout(() => {
        setSuccess(false);
        handleClose();
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    setAnimate(false);
    setTimeout(() => {
      onClose();
      setPwSection(false);
      setPwStep('idle');
      setPwOtp(['','','','','','']);
      setNewPassword('');
      setPwError('');
    }, 250);
  };

  const handleSendPwOtp = async () => {
    setPwError('');
    if (!newPassword || newPassword.length < 6) return setPwError('Password must be at least 6 characters');
    setPwLoading(true);
    try {
      await api.post('/auth/change-password/send-otp');
      setPwStep('sent');
      startPwCooldown();
    } catch (err) {
      setPwError(err.response?.data?.message || 'Failed to send OTP.');
    } finally {
      setPwLoading(false);
    }
  };

  const handleVerifyPwOtp = async (e) => {
    e.preventDefault();
    setPwError('');
    const code = pwOtp.join('');
    if (code.length < 6) return setPwError('Enter the full 6-digit code');
    setPwLoading(true);
    try {
      await api.post('/auth/change-password/verify-otp', { otp: code, newPassword });
      setPwStep('done');
      setPwOtp(['','','','','','']);
      setNewPassword('');
    } catch (err) {
      setPwError(err.response?.data?.message || 'Invalid OTP.');
    } finally {
      setPwLoading(false);
    }
  };

  const startPwCooldown = () => {
    setPwCooldown(60);
    const iv = setInterval(() => setPwCooldown(c => { if (c <= 1) { clearInterval(iv); return 0; } return c - 1; }), 1000);
  };

  const handlePwOtpInput = (i, val) => {
    if (!/^\d*$/.test(val)) return;
    const n = [...pwOtp]; n[i] = val.slice(-1); setPwOtp(n);
    if (val && i < 5) pwOtpRefs[i + 1].current?.focus();
  };

  const handlePwOtpKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !pwOtp[i] && i > 0) pwOtpRefs[i - 1].current?.focus();
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  return (
    <div
      onClick={handleBackdropClick}
      className={`fixed inset-0 z-50 flex items-end justify-center bg-black/80 backdrop-blur-md transition-opacity duration-300 ${
        animate ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      {/* Bottom Sheet Card */}
      <div
        className={`w-full max-w-lg rounded-t-[1.5rem] p-6 relative overflow-hidden transition-transform duration-300 ${
          animate ? 'translate-y-0' : 'translate-y-full'
        }`}
        style={{
          background: 'rgba(5, 20, 36, 0.95)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 -10px 40px rgba(0, 0, 0, 0.5)',
        }}
      >
        {/* Drag handle decoration */}
        <div className="w-12 h-1 bg-white/20 rounded-full mx-auto mb-5" />

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute right-5 top-5 w-8 h-8 rounded border border-white/10 bg-white/5 hover:bg-white/10 flex items-center justify-center text-fm-muted hover:text-white transition-colors text-sm font-bold"
        >
          ✕
        </button>

        <h2 className="font-display text-xl tracking-[0.2em] text-fm-green mb-6 text-center font-black uppercase drop-shadow-[0_0_8px_rgba(75,226,119,0.5)]">
          CUSTOMIZE PROFILE
        </h2>

        {error && (
          <div className="mb-4 p-3 rounded text-[10px] font-mono uppercase tracking-widest text-fm-red font-bold animate-fade-in bg-fm-red/10 border border-fm-red/20">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 rounded text-[10px] font-mono uppercase tracking-widest text-fm-green font-bold animate-fade-in text-center bg-fm-green/10 border border-fm-green/20">
            PROFILE UPDATED. SYNCHRONIZING...
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          {/* Display Name */}
          <div>
            <label className="block text-[10px] font-mono font-bold text-fm-muted uppercase tracking-widest mb-2">
              Display Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your display name"
              required
              maxLength={50}
              className="input-fm"
            />
          </div>

          {/* Avatar Selector */}
          <div>
            <label className="block text-[10px] font-mono font-bold text-fm-muted uppercase tracking-widest mb-3">
              Choose Jersey Avatar
            </label>
            
            {/* Avatar Selection Grid */}
            <div className="grid grid-cols-4 gap-3 max-h-48 overflow-y-auto p-2 scrollbar-none border border-white/10 rounded bg-black/40 shadow-inner">
              {AVATARS.map((av) => {
                const isSelected = selectedAvatar === av.id;
                return (
                  <button
                    key={av.id}
                    type="button"
                    onClick={() => setSelectedAvatar(av.id)}
                    className={`flex flex-col items-center justify-center p-2 rounded transition-all duration-200 border active:scale-95 ${
                      isSelected 
                        ? 'border-fm-green bg-fm-green/10 shadow-[0_0_12px_rgba(75,226,119,0.3)] scale-105 z-10' 
                        : 'border-transparent bg-white/5 hover:border-white/20 hover:bg-white/10'
                    }`}
                  >
                    <UserAvatar avatarId={av.id} className={`w-10 h-10 text-xl border ${isSelected ? 'border-fm-green' : 'border-white/10'}`} />
                    <span className={`text-[9px] mt-1.5 truncate max-w-full text-center font-mono font-bold uppercase tracking-widest ${isSelected ? 'text-fm-green' : 'text-fm-muted'}`}>
                      {av.name.split(' ')[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit Action */}
          <button type="submit" disabled={saving} className="btn-primary w-full py-4 text-sm tracking-[0.2em] mt-4">
            {saving ? 'SAVING PROFILE...' : 'SAVE & SYNC'}
          </button>
        </form>

        {/* ── Change Password Section ── */}
        <div className="mt-6 border-t border-white/10 pt-4">
          <button
            onClick={() => { setPwSection(v => !v); setPwStep('idle'); setPwError(''); setPwOtp(['','','','','','']); }}
            className="w-full text-[10px] font-mono font-bold text-fm-muted uppercase tracking-widest hover:text-white transition-colors py-2 flex items-center justify-center gap-2"
          >
            🔐 {pwSection ? 'Hide' : 'Change Password'}
          </button>

          {pwSection && (
            <div className="mt-4 animate-fade-in">
              {pwError && (
                <div className="mb-3 p-2 rounded text-[10px] text-fm-red font-mono font-bold uppercase tracking-widest bg-fm-red/10 border border-fm-red/20">
                  ⚠️ {pwError}
                </div>
              )}

              {pwStep === 'done' ? (
                <div className="text-center py-4 text-fm-green font-mono font-bold text-[10px] uppercase tracking-widest animate-fade-in">
                  ✓ Password Changed Successfully!
                </div>
              ) : pwStep === 'idle' ? (
                <div className="space-y-4">
                  <div className="relative">
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="New Password (min 6 chars)"
                      className="input-fm"
                    />
                  </div>
                  <button onClick={handleSendPwOtp} disabled={pwLoading}
                    className="btn-ghost w-full py-3 text-[10px] tracking-widest">
                    {pwLoading ? 'Sending...' : 'Send OTP to Email'}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleVerifyPwOtp} className="space-y-4">
                  <p className="text-[10px] text-fm-muted text-center font-mono uppercase tracking-widest">Enter the 6-digit code sent to your email</p>
                  <div className="flex justify-center gap-2">
                    {pwOtp.map((d, i) => (
                      <input key={i} ref={pwOtpRefs[i]} type="text" inputMode="numeric" maxLength={1} value={d}
                        onChange={(e) => handlePwOtpInput(i, e.target.value)}
                        onKeyDown={(e) => handlePwOtpKeyDown(i, e)}
                        className={`w-10 h-12 text-center text-xl font-mono font-black bg-white/5 rounded border-b-2 outline-none transition-all ${d ? 'border-fm-green text-fm-green' : 'border-white/20 text-white focus:border-fm-green'}`}
                      />
                    ))}
                  </div>
                  <button type="submit" disabled={pwLoading}
                    className="btn-primary w-full py-3 text-[10px] tracking-widest mt-2">
                    {pwLoading ? 'Verifying...' : 'Confirm New Password'}
                  </button>
                  <button type="button" onClick={() => { setPwStep('idle'); setPwOtp(['','','','','','']); }}
                    className="w-full text-[10px] text-fm-muted hover:text-white font-mono uppercase tracking-widest transition-colors font-bold mt-2">
                    {pwCooldown > 0 ? `Resend in ${pwCooldown}s` : 'Resend Code'}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
