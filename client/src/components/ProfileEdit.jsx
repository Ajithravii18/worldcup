import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import UserAvatar, { AVATARS } from './UserAvatar';
import api from '../api/axios';
import confetti from 'canvas-confetti';

/**
 * ProfileEdit — component allowing users to customize their display name
 * and select their custom player jersey pose avatar.
 */
export default function ProfileEdit() {
  const { user, updateUserProfile } = useAuth();
  
  const [name, setName] = useState(user?.name || '');
  const [selectedAvatar, setSelectedAvatar] = useState(user?.avatar || 'br_dribbler');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

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

      // Update auth context state and localstorage
      updateUserProfile(res.data);
      setSuccess(true);
      
      // Trigger gold confetti celebration
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.7 },
        colors: ['#5ce6c6', '#FFD700', '#FF8C00', '#ffffff']
      });

      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-4 animate-slide-up">
      <div
        className="rounded-none p-6 relative overflow-hidden"
        style={{
          background: 'rgba(15, 23, 42, 0.55)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(92, 230, 198, 0.25)',
          boxShadow: '0 4px 24px rgba(0, 0, 0, 0.4)',
        }}
      >
        <h2 className="font-display text-2xl text-wc-text tracking-wide mb-6 text-center text-gold-shimmer">
          🛡️ CUSTOMIZE PROFILE
        </h2>

        {error && (
          <div className="mb-4 p-3 rounded-none text-sm text-red-300 font-medium animate-fade-in"
            style={{ background: 'rgba(220, 38, 38, 0.15)', border: '1px solid rgba(220, 38, 38, 0.3)' }}>
            ⚠️ {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 rounded-none text-sm text-green-300 font-semibold animate-fade-in text-center"
            style={{ background: 'rgba(45, 106, 79, 0.2)', border: '1px solid rgba(45, 106, 79, 0.4)' }}>
            🎉 Profile updated successfully!
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          {/* Display Name */}
          <div>
            <label className="block text-xs font-bold text-wc-muted uppercase tracking-widest mb-2">
              Display Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your display name"
              required
              maxLength={50}
              className="input-wc border-wc-border focus:border-wc-gold"
            />
          </div>

          {/* Email (Read Only) */}
          <div>
            <label className="block text-xs font-bold text-wc-muted uppercase tracking-widest mb-2">
              Email Address (Locked)
            </label>
            <input
              type="email"
              value={user?.email || ''}
              disabled
              className="w-full bg-wc-surface/40 border border-wc-border/50 rounded-none px-4 py-3 text-wc-muted cursor-not-allowed font-body"
            />
          </div>

          {/* Avatar Selector */}
          <div>
            <label className="block text-xs font-bold text-wc-muted uppercase tracking-widest mb-3">
              Select Jersey Avatar ({AVATARS.length} Options)
            </label>
            
            {/* Avatar Preview */}
            <div className="flex items-center gap-4 bg-wc-surface/40 border border-wc-border/30 rounded-none p-3.5 mb-4 justify-center">
              <UserAvatar avatarId={selectedAvatar} className="w-16 h-16 text-3xl border-4" />
              <div className="text-left">
                <span className="text-xs text-wc-muted uppercase tracking-widest font-semibold">Active Jersey</span>
                <div className="text-sm font-semibold text-wc-text">
                  {AVATARS.find(a => a.id === selectedAvatar)?.name || 'Unknown'}
                </div>
              </div>
            </div>

            {/* Avatar Selection Grid */}
            <div className="grid grid-cols-4 gap-3 max-h-56 overflow-y-auto p-1 custom-scrollbar border border-wc-border/20 rounded-none bg-wc-surface/20">
              {AVATARS.map((av) => {
                const isSelected = selectedAvatar === av.id;
                return (
                  <button
                    key={av.id}
                    type="button"
                    onClick={() => setSelectedAvatar(av.id)}
                    className={`flex flex-col items-center justify-center p-2 rounded-none transition-all duration-200 border-2 active:scale-95 ${
                      isSelected 
                        ? 'border-wc-gold bg-wc-gold/15 scale-105 shadow-md' 
                        : 'border-transparent bg-wc-surface/45 hover:border-wc-border/60'
                    }`}
                  >
                    <UserAvatar avatarId={av.id} className="w-11 h-11 text-xl border-2" />
                    <span className="text-[9px] text-wc-muted mt-1 truncate max-w-full text-center">
                      {av.name.split(' ')[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={saving}
            className="btn-wc-primary w-full py-3.5 text-base mt-2"
          >
            {saving ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Saving Profile...
              </span>
            ) : (
              '💾 Save Profile'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
