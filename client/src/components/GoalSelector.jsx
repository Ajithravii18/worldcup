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
      className={`flex flex-col items-center gap-3 flex-1 ${
        side === 'right' ? 'items-end' : 'items-start'
      }`}
    >
      {/* Team info */}
      <div className={`flex flex-col items-center gap-2 w-full text-center`}>
        <div className="flex items-center justify-center h-10 mb-1">
          <TeamFlag teamName={teamName} fallbackEmoji={teamFlag} />
        </div>
        <span className="font-display text-lg sm:text-xl text-white font-bold tracking-wide leading-tight line-clamp-1 px-1 drop-shadow-sm">
          {teamName}
        </span>
      </div>

      {/* Goal controls */}
      <div className="flex flex-col items-center gap-2 mt-2">
        {/* Increase button (▲) */}
        <button
          id={`increase-${teamName.replace(/\s+/g, '-').toLowerCase()}`}
          onClick={onIncrease}
          disabled={disabled}
          aria-label={`Increase ${teamName} goals`}
          className="goal-btn goal-btn-up"
        >
          +
        </button>

        {/* Goal count display */}
        <div
          className={`w-14 h-14 flex items-center justify-center rounded-md font-mono text-3xl font-bold transition-all duration-150 ${
            disabled
              ? 'bg-white/5 text-fm-muted border border-white/10'
              : 'bg-black/30 text-white border border-white/20 shadow-[inset_0_2px_8px_rgba(0,0,0,0.5)]'
          }`}
        >
          {goals}
        </div>

        {/* Decrease button (▼) */}
        <button
          id={`decrease-${teamName.replace(/\s+/g, '-').toLowerCase()}`}
          onClick={onDecrease}
          disabled={disabled || goals === 0}
          aria-label={`Decrease ${teamName} goals`}
          className="goal-btn goal-btn-down"
        >
          -
        </button>
      </div>
    </div>
  );
}
