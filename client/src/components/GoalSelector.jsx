import TeamFlag from './TeamFlag';

/**
 * GoalSelector — Up/Down arrow button controls for selecting goal count.
 * Does NOT use <input type="number">.
 * Maps to increaseGoal and decreaseGoal state handlers via onIncrease/onDecrease props.
 */
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
      className={`flex flex-col items-center gap-2 flex-1 ${
        side === 'right' ? 'items-end' : 'items-start'
      }`}
    >
      {/* Team info */}
      <div className={`flex flex-col items-center gap-1 w-full text-center`}>
        <div className="flex items-center justify-center h-8 mb-1">
          <TeamFlag teamName={teamName} fallbackEmoji={teamFlag} />
        </div>
        <span className="font-display text-base sm:text-lg text-gray-900 font-bold tracking-wide leading-tight line-clamp-1 px-1">
          {teamName}
        </span>
      </div>

      {/* Goal controls */}
      <div className="flex flex-col items-center gap-1.5 mt-1">
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
          className={`w-12 h-12 flex items-center justify-center rounded-none font-display text-3xl transition-all duration-150 border-2 ${
            disabled
              ? 'bg-gray-100 text-gray-400 border-gray-200'
              : 'bg-white text-gray-900 border-gray-300 shadow-sm'
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
