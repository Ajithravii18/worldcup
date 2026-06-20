import { useState } from 'react';

/**
 * Custom Avatars metadata representing different poses of different team jerseys.
 */
export const AVATARS = [
  { id: 'ar_champion', name: 'Argentina (Messi) 🇦🇷', emoji: '🇦🇷', bg: 'bg-[#74ACDF]', border: 'border-white', text: 'text-white' },
  { id: 'br_dribbler', name: 'Brazil (Vinicius/Neymar) 🇧🇷', emoji: '🇧🇷', bg: 'bg-[#FFD700]', border: 'border-[#009c3b]', text: 'text-[#009c3b]' },
  { id: 'pt_champion', name: 'Portugal (Ronaldo) 🇵🇹', emoji: '🇵🇹', bg: 'bg-[#E42518]', border: 'border-[#046A38]', text: 'text-[#046A38]' },
  { id: 'fr_silent', name: 'France (Mbappe) 🇫🇷', emoji: '🇫🇷', bg: 'bg-[#002395]', border: 'border-[#ED2939]', text: 'text-[#ED2939]' },
  { id: 'es_dribbler', name: 'Spain (Pedri/Lamine) 🇪🇸', emoji: '🇪🇸', bg: 'bg-[#C60B1E]', border: 'border-[#F1BF00]', text: 'text-[#F1BF00]' },
  { id: 'eng_silent', name: 'England (Kane) 🏴󠁧󠁢󠁥󠁮󠁧󠁿', emoji: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', bg: 'bg-white', border: 'border-[#CE1126]', text: 'text-[#CE1126]' },
  { id: 'us_silent', name: 'USA (Pulisic) 🇺🇸', emoji: '🇺🇸', bg: 'bg-[#0A3161]', border: 'border-[#B22234]', text: 'text-white' },
  { id: 'no_champion', name: 'Norway (Haaland) 🇳🇴', emoji: '🇳🇴', bg: 'bg-[#BA0C2F]', border: 'border-[#00205B]', text: 'text-white' },
  { id: 'kr_champion', name: 'South Korea (Son) 🇰🇷', emoji: '🇰🇷', bg: 'bg-[#C60C30]', border: 'border-[#000000]', text: 'text-white' },
  { id: 'eg_champion', name: 'Egypt (Salah) 🇪🇬', emoji: '🇪🇬', bg: 'bg-[#CE1126]', border: 'border-[#000000]', text: 'text-white' },
  { id: 'de_champion', name: 'Germany (Havertz) 🇩🇪', emoji: '🇩🇪', bg: 'bg-white', border: 'border-black', text: 'text-black' }
];

/**
 * UserAvatar — Renders the circular avatar badge based on selected avatarId.
 */
export default function UserAvatar({ avatarId, className = "w-10 h-10 text-lg border-2" }) {
  const av = AVATARS.find((a) => a.id === avatarId) || AVATARS[0];
  const [imageError, setImageError] = useState(false);

  return (
    <div
      className={`${className} flex items-center justify-center font-bold ${av.bg} ${av.border} ${av.text} shadow-md overflow-hidden relative select-none rounded-[30%]`}
      style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}
    >
      {!imageError ? (
        <img 
          src={`/avatars/${av.id}.png`} 
          alt={av.name} 
          className="w-full h-full object-cover relative z-10"
          onError={() => setImageError(true)}
        />
      ) : (
        <span className="relative z-10 leading-none">{av.emoji}</span>
      )}
      {/* Light sheen effect */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/20 pointer-events-none" />
    </div>
  );
}
