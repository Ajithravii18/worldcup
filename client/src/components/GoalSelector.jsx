import TeamFlag from './TeamFlag';

export default function GoalSelector({
  teamName,
  teamFlag,
  goals,
  onIncrease,
  onDecrease,
  disabled = false,
  side = 'left', // 'left' | 'right'
}) {
  return (
    <div
      className={`flex flex-col items-center gap-4 flex-1 ${
        side === 'right' ? 'items-end' : 'items-start'
      }`}
    >
      {/* Team info */}
      <div className={`flex flex-col items-center gap-3 w-full text-center`}>
        <div className="w-20 h-14 rounded shadow-md border border-outline-variant/50 bg-white flex items-center justify-center overflow-hidden">
          <TeamFlag teamName={teamName} fallbackEmoji={teamFlag} className="w-full h-full object-cover" />
        </div>
        <span className="font-headline-md text-lg uppercase text-on-surface tracking-wide line-clamp-1 drop-shadow-sm font-bold">
          {teamName}
        </span>
      </div>

      {/* Goal controls */}
      <div className="flex flex-col items-center gap-4 w-full max-w-[120px] mt-2">
        {/* Goal input/display */}
        <div className={`relative w-full aspect-[4/5] rounded-xl flex items-center justify-center transition-all shadow-subtle-card border-2 ${
          disabled 
            ? 'bg-white border-outline-variant/30 opacity-70' 
            : 'bg-white border-outline-variant/50 focus-within:border-primary shadow-[inset_0_0_15px_rgba(0,0,0,0.8)]'
        }`}>
          <input 
            className="w-full h-full bg-transparent border-none text-center font-display-lg text-6xl sm:text-7xl text-primary focus:ring-0 cursor-pointer p-0 drop-shadow-[0_0_8px_rgba(0,255,135,0.6)]"
            max="9" 
            min="0" 
            readOnly 
            type="number" 
            value={goals}
          />
        </div>
        
        {/* Stepper buttons */}
        <div className="flex items-center justify-between w-full px-1 gap-2">
          <button
            onClick={onDecrease}
            disabled={disabled || goals === 0}
            className={`w-12 h-10 flex flex-1 items-center justify-center rounded-lg border transition-all active:scale-95 ${
              disabled || goals === 0
                ? 'bg-white border-outline-variant/30 text-outline-variant opacity-50 cursor-not-allowed'
                : 'bg-surface border-outline-variant/50 text-on-surface hover:bg-surface-variant hover:border-outline-variant/30 hover:text-white shadow-sm'
            }`}
            aria-label="Decrease goals"
          >
            <span className="material-symbols-outlined text-[20px]">remove</span>
          </button>
          <button
            onClick={onIncrease}
            disabled={disabled}
            className={`w-12 h-10 flex flex-1 items-center justify-center rounded-lg border transition-all active:scale-95 ${
              disabled
                ? 'bg-white border-outline-variant/30 text-outline-variant opacity-50 cursor-not-allowed'
                : 'bg-surface border-outline-variant/50 text-on-surface hover:bg-surface-variant hover:border-outline-variant/30 hover:text-white shadow-sm'
            }`}
            aria-label="Increase goals"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
          </button>
        </div>
      </div>
    </div>
  );
}
