import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import UserAvatar, { AVATARS } from './UserAvatar';
import api from '../api/axios';
import confetti from 'canvas-confetti';

export default function ProfileModal({ isOpen, onClose }) {
  const { user, updateUserProfile } = useAuth();
  
  const [name, setName] = useState(user?.name || '');
  const [selectedAvatar, setSelectedAvatar] = useState(user?.avatar || 'br_dribbler');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [animate, setAnimate] = useState(false);

  const [pwSection, setPwSection] = useState(false);
  const [pwStep, setPwStep] = useState('idle');
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
        colors: ['#001278', '#1b6d24', '#ff5a00']
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
      className={`fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
        animate ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div
        className={`w-full max-w-lg rounded-t-[1.5rem] p-6 relative overflow-hidden transition-transform duration-300 bg-surface-container-lowest subtle-card-shadow border-t border-outline-variant ${
          animate ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="w-12 h-1 bg-outline-variant rounded-full mx-auto mb-5" />

        <button
          onClick={handleClose}
          className="absolute right-5 top-5 w-8 h-8 rounded border border-outline-variant bg-surface hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors text-sm font-bold"
        >
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>

        <h2 className="font-headline-md text-headline-md text-primary mb-6 text-center font-bold uppercase">
          CUSTOMIZE PROFILE
        </h2>

        {error && (
          <div className="mb-4 p-3 rounded font-label-sm text-label-sm uppercase tracking-widest text-error bg-error-container border border-error">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 rounded font-label-sm text-label-sm uppercase tracking-widest text-secondary bg-secondary-container border border-secondary text-center">
            PROFILE UPDATED
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          <div>
            <label className="block font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant mb-2">
              Display Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your display name"
              required
              maxLength={50}
              className="w-full bg-surface border border-outline-variant text-on-surface rounded-lg px-4 py-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all font-body-md"
            />
          </div>

          <div>
            <label className="block font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant mb-3">
              Choose Avatar
            </label>
            
            <div className="grid grid-cols-4 gap-3 max-h-48 overflow-y-auto p-2 scrollbar-none border border-outline-variant rounded-lg bg-surface">
              {AVATARS.map((av) => {
                const isSelected = selectedAvatar === av.id;
                return (
                  <button
                    key={av.id}
                    type="button"
                    onClick={() => setSelectedAvatar(av.id)}
                    className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-200 border active:scale-95 ${
                      isSelected 
                        ? 'border-primary bg-primary-fixed shadow-sm scale-105 z-10' 
                        : 'border-transparent bg-surface hover:border-outline-variant hover:bg-surface-container'
                    }`}
                  >
                    <UserAvatar avatarId={av.id} className={`w-10 h-10 object-cover rounded-full border-2 ${isSelected ? 'border-primary' : 'border-surface-variant'}`} />
                    <span className={`font-label-sm text-[9px] mt-1.5 truncate max-w-full text-center uppercase tracking-widest ${isSelected ? 'text-primary' : 'text-on-surface-variant'}`}>
                      {av.name.split(' ')[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <button type="submit" disabled={saving} className="w-full py-4 bg-primary text-on-primary font-label-md text-label-md uppercase tracking-wider rounded-lg shadow-md hover:bg-on-primary-fixed-variant active:scale-[0.98] transition-all mt-4">
            {saving ? 'SAVING PROFILE...' : 'SAVE & SYNC'}
          </button>
        </form>

        <div className="mt-6 border-t border-outline-variant pt-4">
          <button
            onClick={() => { setPwSection(v => !v); setPwStep('idle'); setPwError(''); setPwOtp(['','','','','','']); }}
            className="w-full font-label-sm text-[10px] text-on-surface-variant uppercase tracking-widest hover:text-primary transition-colors py-2 flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[16px]">{pwSection ? 'visibility_off' : 'lock'}</span> {pwSection ? 'Hide' : 'Change Password'}
          </button>

          {pwSection && (
            <div className="mt-4 animate-fade-in">
              {pwError && (
                <div className="mb-3 p-2 rounded font-label-sm text-[10px] text-error uppercase tracking-widest bg-error-container border border-error">
                  ⚠️ {pwError}
                </div>
              )}

              {pwStep === 'done' ? (
                <div className="text-center py-4 text-secondary font-label-sm text-[10px] uppercase tracking-widest animate-fade-in">
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
                      className="w-full bg-surface border border-outline-variant text-on-surface rounded-lg px-4 py-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all font-body-md"
                    />
                  </div>
                  <button onClick={handleSendPwOtp} disabled={pwLoading}
                    className="w-full py-3 bg-surface text-primary border border-outline-variant hover:bg-surface-container-low rounded-lg font-label-sm text-label-sm uppercase tracking-widest transition-colors">
                    {pwLoading ? 'Sending...' : 'Send OTP to Email'}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleVerifyPwOtp} className="space-y-4">
                  <p className="font-label-sm text-[10px] text-on-surface-variant text-center uppercase tracking-widest">Enter the 6-digit code sent to your email</p>
                  <div className="flex justify-center gap-2">
                    {pwOtp.map((d, i) => (
                      <input key={i} ref={pwOtpRefs[i]} type="text" inputMode="numeric" maxLength={1} value={d}
                        onChange={(e) => handlePwOtpInput(i, e.target.value)}
                        onKeyDown={(e) => handlePwOtpKeyDown(i, e)}
                        className={`w-10 h-12 text-center text-xl font-display-lg bg-surface rounded-md border-b-2 outline-none transition-all ${d ? 'border-primary text-primary' : 'border-outline-variant text-on-surface focus:border-primary'}`}
                      />
                    ))}
                  </div>
                  <button type="submit" disabled={pwLoading}
                    className="w-full py-3 bg-primary text-on-primary font-label-sm text-label-sm uppercase tracking-wider rounded-lg shadow-md hover:bg-on-primary-fixed-variant transition-all mt-2">
                    {pwLoading ? 'Verifying...' : 'Confirm New Password'}
                  </button>
                  <button type="button" onClick={() => { setPwStep('idle'); setPwOtp(['','','','','','']); }}
                    className="w-full font-label-sm text-[10px] text-on-surface-variant hover:text-primary uppercase tracking-widest transition-colors mt-2">
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
