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
        colors: ['#5ce6c6', '#FFD700', '#FF8C00', '#ffffff']
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
      className={`fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${
        animate ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      {/* Bottom Sheet Card */}
      <div
        className={`w-full max-w-lg rounded-t-[2.5rem] p-6 shadow-[0_-10px_40px_rgba(16,185,129,0.15)] relative overflow-hidden transition-transform duration-300 bg-white border-t-4 border-emerald-500 ${
          animate ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        {/* Drag handle decoration */}
        <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-5 opacity-80" />

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute right-5 top-5 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-900 transition-colors text-sm font-bold"
        >
          ✕
        </button>

        <h2 className="font-display text-xl tracking-[0.2em] text-emerald-600 mb-6 text-center font-black uppercase drop-shadow-sm">
          CUSTOMIZE PROFILE
        </h2>

        {error && (
          <div className="mb-4 p-3 rounded-none text-xs uppercase tracking-widest text-red-300 font-bold animate-fade-in"
            style={{ background: 'rgba(220, 38, 38, 0.15)', border: '1px solid rgba(220, 38, 38, 0.3)' }}>
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 rounded-none text-xs uppercase tracking-widest text-green-300 font-bold animate-fade-in text-center"
            style={{ background: 'rgba(45, 106, 79, 0.2)', border: '1px solid rgba(45, 106, 79, 0.4)' }}>
            PROFILE UPDATED. SYNCHRONIZING...
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          {/* Display Name */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
              Display Name
            </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your display name"
                required
                maxLength={50}
                className="w-full bg-gray-50 border border-gray-200 rounded-none px-4 py-3 text-sm text-black outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors font-bold"
              />
          </div>

          {/* Avatar Selector */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">
              Choose Jersey Avatar
            </label>
            
            {/* Avatar Preview */}
            <div className="flex items-center gap-4 bg-emerald-50/50 border border-emerald-200 rounded-none p-4 mb-4 justify-center shadow-sm">
              <div className="relative">
                <div className="absolute inset-0 bg-emerald-400 blur-md opacity-30 rounded-full"></div>
                <UserAvatar avatarId={selectedAvatar} className="w-16 h-16 text-3xl border-[3px] border-emerald-400 relative z-10 shadow-md bg-white" />
              </div>
              <div className="text-left border-l border-emerald-200 pl-4">
                <span className="text-[10px] text-emerald-600 uppercase tracking-widest font-bold">Active Jersey</span>
                <div className="text-lg font-black text-gray-900 tracking-wide uppercase drop-shadow-sm mt-0.5">
                  {AVATARS.find(a => a.id === selectedAvatar)?.name || 'Unknown'}
                </div>
              </div>
            </div>

            {/* Avatar Selection Grid */}
            <div className="grid grid-cols-4 gap-3 max-h-48 overflow-y-auto p-1.5 custom-scrollbar border border-gray-200 rounded-none bg-gray-50">
              {AVATARS.map((av) => {
                const isSelected = selectedAvatar === av.id;
                return (
                  <button
                    key={av.id}
                    type="button"
                    onClick={() => setSelectedAvatar(av.id)}
                    className={`flex flex-col items-center justify-center p-2 rounded-none transition-all duration-200 border-[2px] active:scale-95 ${
                      isSelected 
                        ? 'border-emerald-500 bg-emerald-50 shadow-[0_4px_10px_rgba(16,185,129,0.2)] scale-105 z-10' 
                        : 'border-transparent bg-gray-50 hover:border-emerald-200 hover:bg-white'
                    }`}
                  >
                    <UserAvatar avatarId={av.id} className={`w-10 h-10 text-xl border-2 ${isSelected ? 'border-emerald-400' : 'border-gray-200'}`} />
                    <span className={`text-[9px] mt-1.5 truncate max-w-full text-center font-bold uppercase tracking-widest ${isSelected ? 'text-emerald-600' : 'text-gray-400'}`}>
                      {av.name.split(' ')[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit Action */}
          <button type="submit" disabled={saving}
            className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-none font-black tracking-[0.2em] text-sm uppercase transition-all shadow-[0_8px_20px_rgba(16,185,129,0.3)] active:scale-95 mt-4">
            {saving ? 'SAVING PROFILE...' : 'SAVE & SYNC'}
          </button>
        </form>

        {/* ── Change Password Section ── */}
        <div className="mt-6 border-t border-gray-200 pt-4">
          <button
            onClick={() => { setPwSection(v => !v); setPwStep('idle'); setPwError(''); setPwOtp(['','','','','','']); }}
            className="w-full text-xs font-bold text-gray-400 uppercase tracking-widest hover:text-emerald-500 transition-colors py-2 flex items-center justify-center gap-2"
          >
            🔐 {pwSection ? 'Hide' : 'Change Password'}
          </button>

          {pwSection && (
            <div className="mt-4 animate-fade-in">
              {pwError && (
                <div className="mb-3 p-2 rounded-none text-xs text-red-400 font-bold uppercase tracking-widest" style={{ background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.25)' }}>
                  ⚠️ {pwError}
                </div>
              )}

              {pwStep === 'done' ? (
                <div className="text-center py-4 text-emerald-600 font-bold text-sm uppercase tracking-widest animate-fade-in">
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
                      className="w-full bg-gray-50 border border-gray-200 rounded-none px-4 py-3 text-sm text-black outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors font-bold"
                    />
                  </div>
                  <button onClick={handleSendPwOtp} disabled={pwLoading}
                    className="w-full py-3 text-xs font-bold uppercase tracking-widest bg-gray-900 text-white rounded-none hover:bg-emerald-600 transition-all active:scale-95 disabled:opacity-50">
                    {pwLoading ? 'Sending...' : 'Send OTP to Email'}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleVerifyPwOtp} className="space-y-4">
                  <p className="text-xs text-gray-500 text-center uppercase tracking-widest">Enter the 6-digit code sent to your email</p>
                  <div className="flex justify-center gap-2">
                    {pwOtp.map((d, i) => (
                      <input key={i} ref={pwOtpRefs[i]} type="text" inputMode="numeric" maxLength={1} value={d}
                        onChange={(e) => handlePwOtpInput(i, e.target.value)}
                        onKeyDown={(e) => handlePwOtpKeyDown(i, e)}
                        className={`w-10 h-12 text-center text-xl font-black bg-transparent border-b-2 outline-none transition-all ${d ? 'border-emerald-500 text-emerald-600' : 'border-gray-300 focus:border-emerald-400'}`}
                      />
                    ))}
                  </div>
                  <button type="submit" disabled={pwLoading}
                    className="w-full py-3 text-xs font-bold uppercase tracking-widest bg-gray-900 text-white rounded-none hover:bg-emerald-600 transition-all active:scale-95 disabled:opacity-50">
                    {pwLoading ? 'Verifying...' : 'Confirm New Password'}
                  </button>
                  <button type="button" onClick={() => { setPwStep('idle'); setPwOtp(['','','','','','']); }}
                    className="w-full text-xs text-gray-400 hover:text-emerald-500 uppercase tracking-widest transition-colors font-bold">
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
