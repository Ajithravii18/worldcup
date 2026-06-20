import { useState, useCallback, useEffect } from 'react';
import GoalSelector from './GoalSelector';
import TeamFlag from './TeamFlag';
import UserAvatar from './UserAvatar';
import api from '../api/axios';
import confetti from 'canvas-confetti';
import MatchComments from './MatchComments';

export default function MatchDetailModal({
  isOpenModal,
  onClose,
  match,
  prediction = null,
  onPredicted,
  globalMode = false,
  globalPreds = [],
}) {
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [homeGoals, setHomeGoals] = useState(prediction?.homeGoals ?? 0);
  const [awayGoals, setAwayGoals] = useState(prediction?.awayGoals ?? 0);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (!isOpenModal) return;
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpenModal]);

  useEffect(() => {
    if (isOpenModal) {
      document.body.style.overflow = 'hidden';
      const timer = setTimeout(() => setAnimate(true), 10);
      return () => {
        clearTimeout(timer);
        document.body.style.overflow = '';
      };
    } else {
      document.body.style.overflow = '';
      setAnimate(false);
    }
  }, [isOpenModal]);

  // Reset inputs when opening a new match
  useEffect(() => {
    setHomeGoals(prediction?.homeGoals ?? 0);
    setAwayGoals(prediction?.awayGoals ?? 0);
    setSubmitError('');
    setSubmitSuccess(false);
  }, [match?._id, prediction]);

  const increaseGoal = useCallback((team) => {
    if (team === 'home') setHomeGoals((g) => Math.min(g + 1, 20));
    else setAwayGoals((g) => Math.min(g + 1, 20));
  }, []);

  const decreaseGoal = useCallback((team) => {
    if (team === 'home') setHomeGoals((g) => Math.max(g - 1, 0));
    else setAwayGoals((g) => Math.max(g - 1, 0));
  }, []);

  if (!match || !isOpenModal) return null;

  const getModalTimeState = () => {
    const kickoff = new Date(match.kickoffTime).getTime();
    const fiveHoursMs = 5 * 60 * 60 * 1000;
    const windowOpen = kickoff - fiveHoursMs;
    if (currentTime < windowOpen) return 'early';
    if (currentTime >= windowOpen && currentTime < kickoff) return 'open';
    return 'locked';
  };

  const timeState = getModalTimeState();
  const isLocked = timeState === 'locked';
  const isEarly = timeState === 'early';
  const isOpen = timeState === 'open';

  const handleClose = () => {
    setAnimate(false);
    setTimeout(onClose, 300);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setSubmitError('');
    setSubmitSuccess(false);
    try {
      await api.post('/predictions', {
        matchId: match._id,
        homeGoals,
        awayGoals,
      });
      setSubmitSuccess(true);
      
      // Play success sound
      try {
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3');
        audio.volume = 0.5;
        audio.play();
      } catch (e) {
        console.error('Audio playback failed', e);
      }

      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#00BFFF', '#1E90FF', '#87CEFA']
      });
      onPredicted && onPredicted();
      setTimeout(() => {
        setSubmitSuccess(false);
        handleClose();
      }, 1500);
    } catch (err) {
      setSubmitError(err.response?.data?.message || 'Failed to submit prediction');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSimulateEnd = async () => {
    try {
      const hScore = Math.floor(Math.random() * 4);
      const aScore = Math.floor(Math.random() * 4);
      await api.put(`/matches/${match._id}/result`, {
        homeScore: hScore,
        awayScore: aScore,
        status: 'completed'
      });
      onPredicted && onPredicted(); // This will refresh matches in HomePage
      handleClose();
    } catch (err) {
      console.error('Failed to simulate match end:', err);
      alert('Failed to simulate match end');
    }
  };

  // Compute time until prediction window opens (for early state)
  const timeUntilWindow = () => {
    const windowOpen = new Date(match.kickoffTime).getTime() - 5 * 60 * 60 * 1000;
    const diff = windowOpen - currentTime;
    if (diff <= 0) return '';
    const h = Math.floor(diff / (60 * 60 * 1000));
    const m = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000));
    const s = Math.floor((diff % (60 * 1000)) / 1000);
    return `${h}h ${m}m ${s}s`;
  };

  const timeUntilKickoff = () => {
    const kick = new Date(match.kickoffTime).getTime();
    const diff = kick - currentTime;
    if (diff <= 0) return '';
    const h = Math.floor(diff / (60 * 60 * 1000));
    const m = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000));
    const s = Math.floor((diff % (60 * 1000)) / 1000);
    return h > 0 ? `${h}h ${m}m ${s}s` : `${m}m ${s}s`;
  };

  const totalPreds = globalPreds.length;
  let homeWins = 0, draws = 0, awayWins = 0;
  globalPreds.forEach((p) => {
    if (p.homeGoals > p.awayGoals) homeWins++;
    else if (p.homeGoals < p.awayGoals) awayWins++;
    else draws++;
  });
  const homePct = totalPreds ? Math.round((homeWins / totalPreds) * 100) : 0;
  const drawPct = totalPreds ? Math.round((draws / totalPreds) * 100) : 0;
  const awayPct = totalPreds ? (100 - homePct - drawPct) : 0;

  return (
    <div
      onClick={handleBackdropClick}
      className={`fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm transition-opacity duration-300 px-4 ${
        animate ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div
        className={`w-full max-w-lg rounded-t-[2.5rem] sm:rounded-[2.5rem] p-6 shadow-2xl relative overflow-hidden transition-all duration-300 bg-white border-t sm:border border-gray-200 ${
          animate ? 'translate-y-0 sm:scale-100' : 'translate-y-full sm:translate-y-0 sm:scale-95'
        }`}
      >
        <div className="sm:hidden w-12 h-1 bg-gray-300 rounded-full mx-auto mb-5" />

        <button
          onClick={handleClose}
          className="absolute right-5 top-5 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-black transition-colors text-sm font-bold border border-gray-200"
        >
          ✕
        </button>

        <div className="flex flex-col items-center mb-6 mt-2">
          <span className="text-[11px] font-bold text-theme-secondary uppercase tracking-widest bg-theme-primary/10 px-3 py-1 rounded-full border border-theme-primary/20 mb-2">
            {match.group}
          </span>
          <span className="text-[10px] text-gray-500 font-semibold">{match.venue}</span>
        </div>

        {/* ===== COMPLETED MATCH ===== */}
        {match.status === 'completed' && (
          <div className="px-2 pb-4">
            <div className="flex items-center justify-center gap-2 sm:gap-4 py-3">
              <div className="flex-1 text-center flex flex-col items-center max-w-[90px]">
                <div className="flex items-center justify-center h-10 mb-2">
                  <TeamFlag teamName={match.homeTeam} fallbackEmoji={match.homeFlag} className="w-12 h-9 flex-shrink-0" />
                </div>
                <div className="font-display text-sm text-gray-900 font-bold tracking-wide truncate w-full">{match.homeTeam}</div>
              </div>
              <div className="px-2 text-center flex-shrink-0">
                <div className="font-display text-4xl text-gray-900 px-4 py-2 rounded-xl bg-gray-50 border border-gray-200 shadow-sm whitespace-nowrap">
                  {match.homeScore} – {match.awayScore}
                </div>
                {match.winner && (
                  <div className="mt-3 text-[11px] font-bold text-gray-500 tracking-widest uppercase">
                    {match.winner === 'Draw' ? 'DRAW' : `WINNER: ${match.winner}`}
                  </div>
                )}
              </div>
              <div className="flex-1 text-center flex flex-col items-center max-w-[90px]">
                <div className="flex items-center justify-center h-10 mb-2">
                  <TeamFlag teamName={match.awayTeam} fallbackEmoji={match.awayFlag} className="w-12 h-9 flex-shrink-0" />
                </div>
                <div className="font-display text-sm text-gray-900 font-bold tracking-wide truncate w-full">{match.awayTeam}</div>
              </div>
            </div>
            
            {/* Global predictions for completed matches */}
            {globalPreds.length > 0 && (
              <div className="mt-6 border-t border-gray-200 pt-4">
                <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-3 font-bold text-center">
                  COMMUNITY PREDICTIONS
                </div>

                {/* Prediction Bar */}
                <div className="mb-4 px-2">
                  <div className="flex items-center justify-between text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">
                    <span className="text-theme-secondary">{match.homeTeam} {homePct}%</span>
                    <span className="text-gray-400">DRAW {drawPct}%</span>
                    <span className="text-theme-primary">{match.awayTeam} {awayPct}%</span>
                  </div>
                  <div className="h-1.5 w-full flex rounded-full overflow-hidden bg-gray-100">
                    {homePct > 0 && <div className="bg-theme-secondary transition-all duration-500" style={{ width: `${homePct}%` }} />}
                    {drawPct > 0 && <div className="bg-gray-300 transition-all duration-500" style={{ width: `${drawPct}%` }} />}
                    {awayPct > 0 && <div className="bg-theme-primary transition-all duration-500" style={{ width: `${awayPct}%` }} />}
                  </div>
                </div>
                <div className="max-h-48 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                  {globalPreds.map((pred) => (
                    <div key={pred._id} className="flex items-center justify-between bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-sm">
                      <div className="flex items-center gap-3">
                        <UserAvatar avatarId={pred.user?.avatar} className="w-8 h-8 flex-shrink-0 text-xs border border-gray-300" />
                        <span className="text-sm text-gray-900 font-bold truncate max-w-[150px]">
                          {pred.user?.name || 'Unknown'}
                        </span>
                      </div>
                      <div className="font-display text-xl text-gray-900 font-black">
                        {pred.homeGoals} – {pred.awayGoals}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <MatchComments matchId={match._id} />
          </div>
        )}

        {/* ===== NOT COMPLETED MATCH ===== */}
        {match.status !== 'completed' && (
          <div className="px-2 pb-4">
            {/* If open and predicting */}
            {isOpen && !prediction ? (
              <>
                <div className="py-2 mb-3 flex items-center justify-center gap-2">
                  <span className="inline-block w-2.5 h-2.5 rounded-full bg-theme-primary animate-pulse shadow-[0_0_8px_rgba(0,191,255,0.6)]" />
                  <span className="text-xs text-theme-secondary font-black uppercase tracking-widest">
                    PREDICTION OPEN · {timeUntilKickoff()}
                  </span>
                </div>

                <div className="flex items-start justify-between gap-3 py-4 bg-white rounded-xl border border-gray-200 mb-6 shadow-sm">
                  <GoalSelector
                    teamName={match.homeTeam}
                    teamFlag={match.homeFlag}
                    goals={homeGoals}
                    onIncrease={() => increaseGoal('home')}
                    onDecrease={() => decreaseGoal('home')}
                    disabled={false}
                    side="left"
                  />

                  <div className="flex flex-col items-center justify-center gap-1 pt-10">
                    <div className="font-display text-2xl text-gray-300 font-black">VS</div>
                  </div>

                  <GoalSelector
                    teamName={match.awayTeam}
                    teamFlag={match.awayFlag}
                    goals={awayGoals}
                    onIncrease={() => increaseGoal('away')}
                    onDecrease={() => decreaseGoal('away')}
                    disabled={false}
                    side="right"
                  />
                </div>

                {submitError && (
                  <div className="text-red-600 text-xs text-center mb-3 px-2 font-bold uppercase tracking-widest bg-red-50 py-2 rounded-lg border border-red-200">
                    ⚠️ {submitError}
                  </div>
                )}
                {submitSuccess && (
                  <div className="text-green-700 text-xs text-center mb-3 font-bold animate-fade-in uppercase tracking-widest bg-green-50 py-2 rounded-lg border border-green-200">
                    PREDICTION SAVED
                  </div>
                )}

                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="w-full py-4 bg-theme-primary hover:bg-blue-700 text-white rounded-xl font-black tracking-[0.2em] text-sm uppercase transition-all shadow-md active:scale-95"
                >
                  {submitting ? 'SAVING...' : 'SUBMIT PREDICTION'}
                </button>
              </>
            ) : globalMode ? (
              // Global Mode / Viewing others
              <>
                {prediction && (
                  <div className="mb-6 bg-blue-50 border border-blue-200 rounded-xl p-4 flex flex-col justify-center items-center shadow-sm">
                    <span className="text-[10px] text-theme-primary uppercase tracking-[0.2em] font-black mb-2">YOUR LOCKED PREDICTION</span>
                    <div className="flex items-center gap-4">
                       <span className="text-theme-secondary font-display text-4xl tracking-widest font-black">{prediction.homeGoals} – {prediction.awayGoals}</span>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-center gap-2 sm:gap-4 py-4">
                  <div className="flex-1 text-center flex flex-col items-center max-w-[90px]">
                    <div className="flex items-center justify-center h-10 mb-2">
                      <TeamFlag teamName={match.homeTeam} fallbackEmoji={match.homeFlag} className="w-12 h-9 flex-shrink-0" />
                    </div>
                    <div className="font-display text-sm text-gray-900 font-bold tracking-widest uppercase truncate w-full">{match.homeTeam}</div>
                  </div>
                  <div className="px-2 text-center flex-shrink-0">
                    <div className="font-display text-3xl text-gray-300 font-black">VS</div>
                    {isOpen && (
                      <div className="text-[10px] font-bold text-gray-500 mt-2 tracking-widest">{timeUntilKickoff()} LEFT</div>
                    )}
                  </div>
                  <div className="flex-1 text-center flex flex-col items-center max-w-[90px]">
                    <div className="flex items-center justify-center h-10 mb-2">
                      <TeamFlag teamName={match.awayTeam} fallbackEmoji={match.awayFlag} className="w-12 h-9 flex-shrink-0" />
                    </div>
                    <div className="font-display text-sm text-gray-900 font-bold tracking-widest uppercase truncate w-full">{match.awayTeam}</div>
                  </div>
                </div>

                {globalPreds.length > 0 ? (
                  <div className="mt-4 border-t border-gray-200 pt-4">
                    <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-3 font-bold text-center">
                      COMMUNITY PREDICTIONS ({globalPreds.length})
                    </div>

                    {/* Prediction Bar */}
                    <div className="mb-4 px-2">
                      <div className="flex items-center justify-between text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">
                        <span className="text-theme-secondary">{match.homeTeam} {homePct}%</span>
                        <span className="text-gray-400">DRAW {drawPct}%</span>
                        <span className="text-theme-primary">{match.awayTeam} {awayPct}%</span>
                      </div>
                      <div className="h-1.5 w-full flex rounded-full overflow-hidden bg-gray-100">
                        {homePct > 0 && <div className="bg-theme-secondary transition-all duration-500" style={{ width: `${homePct}%` }} />}
                        {drawPct > 0 && <div className="bg-gray-300 transition-all duration-500" style={{ width: `${drawPct}%` }} />}
                        {awayPct > 0 && <div className="bg-theme-primary transition-all duration-500" style={{ width: `${awayPct}%` }} />}
                      </div>
                    </div>
                    <div className="max-h-48 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                      {globalPreds.map((pred) => (
                        <div key={pred._id} className="flex items-center justify-between bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-sm">
                          <div className="flex items-center gap-3">
                            <UserAvatar avatarId={pred.user?.avatar} className="w-8 h-8 flex-shrink-0 text-xs border border-gray-300 rounded-full object-cover" />
                            <span className="text-sm text-gray-900 font-bold truncate max-w-[150px]">
                              {pred.user?.name || 'Unknown'}
                            </span>
                          </div>
                          <div className="font-display text-xl text-gray-900 font-black">
                            {pred.homeGoals} – {pred.awayGoals}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-500 text-[10px] py-8 uppercase tracking-[0.2em] font-bold bg-white rounded-xl border border-gray-200 mt-4 shadow-sm">
                    NO PREDICTIONS YET. BE THE FIRST.
                  </div>
                )}
                
                <MatchComments matchId={match._id} />
              </>
            ) : (
              // Personal View - Early or Locked
              <>
                {isEarly && (
                  <>
                    <div className="flex items-center justify-center gap-2 sm:gap-4 py-6">
                      <div className="flex-1 text-center flex flex-col items-center opacity-60 max-w-[90px]">
                        <div className="flex items-center justify-center h-10 mb-2">
                          <TeamFlag teamName={match.homeTeam} fallbackEmoji={match.homeFlag} className="w-12 h-9 flex-shrink-0" />
                        </div>
                        <div className="font-display text-sm text-gray-900 font-bold tracking-widest uppercase truncate w-full">{match.homeTeam}</div>
                      </div>
                      <div className="px-2 text-center opacity-60 flex-shrink-0">
                        <div className="font-display text-3xl text-gray-300 font-black">VS</div>
                      </div>
                      <div className="flex-1 text-center flex flex-col items-center opacity-60 max-w-[90px]">
                        <div className="flex items-center justify-center h-10 mb-2">
                          <TeamFlag teamName={match.awayTeam} fallbackEmoji={match.awayFlag} className="w-12 h-9 flex-shrink-0" />
                        </div>
                        <div className="font-display text-sm text-gray-900 font-bold tracking-widest uppercase truncate w-full">{match.awayTeam}</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-xs text-gray-500 font-bold uppercase tracking-widest bg-gray-50 border border-gray-200 text-center shadow-sm">
                      PREDICTIONS OPEN {timeUntilWindow()} BEFORE KICKOFF
                    </div>
                  </>
                )}

                {isOpen && prediction && (
                  <>
                    <div className="py-2 flex items-center justify-center mb-4">
                      <span className="text-[11px] text-gray-500 font-black uppercase tracking-[0.2em] bg-gray-100 px-4 py-1.5 rounded-full border border-gray-200">
                        PREDICTION LOCKED IN
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-4 py-4 px-2">
                      <div className="flex-1 text-center">
                        <div className="font-display text-lg text-gray-900 font-bold uppercase tracking-widest">{match.homeTeam}</div>
                      </div>
                      <div className="px-6 py-4 bg-white border border-gray-200 rounded-xl shadow-sm text-center min-w-[140px]">
                        <div className="font-display text-5xl text-gray-900 font-black">
                          {prediction.homeGoals} – {prediction.awayGoals}
                        </div>
                      </div>
                      <div className="flex-1 text-center">
                        <div className="font-display text-lg text-gray-900 font-bold uppercase tracking-widest">{match.awayTeam}</div>
                      </div>
                    </div>
                  </>
                )}

                {isLocked && (
                  <>
                    <div className="py-2 flex items-center justify-center mb-4">
                      <span className="text-[11px] text-gray-500 font-black uppercase tracking-[0.2em] bg-gray-100 px-4 py-1.5 rounded-full border border-gray-200">
                        MATCH STARTED — LOCKED
                      </span>
                    </div>
                    <div className="flex items-center justify-center gap-2 sm:gap-4 py-6">
                      <div className="flex-1 text-center flex flex-col items-center opacity-70 max-w-[90px]">
                        <div className="flex items-center justify-center h-10 mb-2">
                          <TeamFlag teamName={match.homeTeam} fallbackEmoji={match.homeFlag} className="w-12 h-9 flex-shrink-0" />
                        </div>
                        <div className="font-display text-sm text-gray-900 font-bold tracking-widest uppercase truncate w-full">{match.homeTeam}</div>
                      </div>
                      <div className="px-2 text-center opacity-70 flex-shrink-0">
                        <div className="font-display text-3xl text-gray-300 font-black">VS</div>
                      </div>
                      <div className="flex-1 text-center flex flex-col items-center opacity-70 max-w-[90px]">
                        <div className="flex items-center justify-center h-10 mb-2">
                          <TeamFlag teamName={match.awayTeam} fallbackEmoji={match.awayFlag} className="w-12 h-9 flex-shrink-0" />
                        </div>
                        <div className="font-display text-sm text-gray-900 font-bold tracking-widest uppercase truncate w-full">{match.awayTeam}</div>
                      </div>
                    </div>

                    {prediction ? (
                      <div className="text-center text-sm text-gray-500 font-bold py-4 rounded-xl mt-2 bg-white border border-gray-200 uppercase tracking-widest shadow-sm">
                        YOUR SCORE: <span className="text-gray-900 font-black">{prediction.homeGoals} – {prediction.awayGoals}</span>
                      </div>
                    ) : (
                      <div className="text-center text-[10px] text-gray-400 font-bold py-4 rounded-xl mt-2 bg-gray-50 border border-gray-200 uppercase tracking-widest">
                        MISSED THIS MATCH
                      </div>
                    )}
                  </>
                )}
                
                <MatchComments matchId={match._id} />
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
