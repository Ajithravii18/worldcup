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
        <div className="w-20 h-14 rounded-xl shadow-md border border-white/20 bg-black flex items-center justify-center overflow-hidden -skew-x-6">
          <TeamFlag teamName={teamName} fallbackEmoji={teamFlag} className="w-full h-full object-cover skew-x-6" />
        </div>
        <span className="font-display text-lg uppercase text-white tracking-widest line-clamp-1 drop-shadow-sm font-black">
          {teamName}
        </span>
      </div>

      {/* Goal controls */}
      <div className="flex flex-col items-center gap-4 w-full max-w-[120px] mt-2">
        {/* Goal input/display */}
        <div className={`relative w-full aspect-[4/5] rounded-xl flex items-center justify-center transition-all shadow-inner border-2 ${
          disabled 
            ? 'bg-black/40 border-white/10 opacity-70' 
            : 'bg-black/50 border-white/20 focus-within:border-primary shadow-[inset_0_0_15px_rgba(0,0,0,0.8)]'
        }`}>
          <input 
            className="w-full h-full bg-transparent border-none text-center font-display text-6xl sm:text-7xl text-primary font-black focus:ring-0 cursor-pointer p-0 drop-shadow-[0_0_15px_rgba(0,255,135,0.6)]"
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
                ? 'bg-black/40 border-white/10 text-outline-variant opacity-50 cursor-not-allowed'
                : 'bg-white/5 border-white/20 text-white hover:bg-white/10 hover:border-white/30 shadow-sm'
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
                ? 'bg-black/40 border-white/10 text-outline-variant opacity-50 cursor-not-allowed'
                : 'bg-white/5 border-white/20 text-white hover:bg-white/10 hover:border-white/30 shadow-sm'
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
