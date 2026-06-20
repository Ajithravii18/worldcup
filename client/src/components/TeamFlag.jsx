import { getTeamFlagUrl } from '../utils/flags';

/**
 * TeamFlag — Displays a country flag logo image from FlagCDN
 * with a fallback to the standard emoji flag if mapping is unavailable.
 */
export default function TeamFlag({ teamName, fallbackEmoji, className = "w-10 h-7" }) {
  const url = getTeamFlagUrl(teamName);

  if (url) {
    return (
      <img
        src={url}
        alt={teamName}
        className={`${className} object-cover rounded shadow-md border border-white/20 inline-block`}
        onError={(e) => {
          // Fallback to emoji if image fails to load
          e.target.style.display = 'none';
          const parent = e.target.parentNode;
          const span = document.createElement('span');
          span.className = "text-2xl";
          span.innerText = fallbackEmoji || '🏳️';
          parent.appendChild(span);
        }}
      />
    );
  }

  return (
    <span className="text-2xl select-none" title={teamName}>
      {fallbackEmoji || '🏳️'}
    </span>
  );
}
