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
        <div className="w-16 h-16 rounded-full bg-surface-container border border-outline-variant flex items-center justify-center overflow-hidden shadow-sm">
          <TeamFlag teamName={teamName} fallbackEmoji={teamFlag} className="w-10 h-10 object-contain" />
        </div>
        <span className="font-label-md text-label-md uppercase text-on-surface tracking-wider line-clamp-1">
          {teamName}
        </span>
      </div>

      {/* Goal controls */}
      <div className="flex flex-col items-center gap-3 w-full max-w-[100px] mt-2">
        {/* Goal input/display */}
        <div className={`relative w-full aspect-[3/4] rounded-lg flex items-center justify-center transition-all ${
          disabled 
            ? 'bg-surface-container border border-outline-variant opacity-70' 
            : 'bg-surface border border-outline-variant focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 shadow-sm'
        }`}>
          <input 
            className="w-full h-full bg-transparent border-none text-center font-display-lg text-display-lg text-primary focus:ring-0 cursor-pointer p-0"
            max="9" 
            min="0" 
            readOnly 
            type="number" 
            value={goals}
          />
        </div>
        
        {/* Stepper buttons */}
        <div className="flex items-center justify-between w-full px-1">
          <button
            onClick={onDecrease}
            disabled={disabled || goals === 0}
            className={`w-8 h-8 flex items-center justify-center rounded-full bg-surface border transition-colors active:scale-95 ${
              disabled || goals === 0
                ? 'border-surface-variant text-outline opacity-50 cursor-not-allowed'
                : 'border-outline-variant text-on-surface-variant hover:bg-surface-container-high hover:text-primary'
            }`}
            aria-label="Decrease goals"
          >
            <span className="material-symbols-outlined text-sm">remove</span>
          </button>
          <button
            onClick={onIncrease}
            disabled={disabled}
            className={`w-8 h-8 flex items-center justify-center rounded-full bg-surface border transition-colors active:scale-95 ${
              disabled
                ? 'border-surface-variant text-outline opacity-50 cursor-not-allowed'
                : 'border-outline-variant text-on-surface-variant hover:bg-surface-container-high hover:text-primary'
            }`}
            aria-label="Increase goals"
          >
            <span className="material-symbols-outlined text-sm">add</span>
          </button>
        </div>
      </div>
    </div>
  );
}
