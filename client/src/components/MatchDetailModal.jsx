import { useState, useCallback, useEffect } from 'react';
import GoalSelector from './GoalSelector';
import TeamFlag from './TeamFlag';
import UserAvatar from './UserAvatar';
import api from '../api/axios';
import confetti from 'canvas-confetti';
import MatchComments from './MatchComments';
import { useAuth } from '../context/AuthContext';

export default function MatchDetailModal({
  isOpenModal,
  onClose,
  match,
  prediction = null,
  onPredicted,
  globalMode = false,
  globalPreds = [],
}) {
  const { user } = useAuth();
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
        colors: ['#4be277', '#22c55e', '#6bff8f']
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
      await api.put(`/matches/${match._id}/result`, {
        homeScore: match.homeScore ?? 0,
        awayScore: match.awayScore ?? 0,
        status: 'completed'
      });
      onPredicted && onPredicted(); // Refresh matches
      handleClose();
    } catch (err) {
      console.error('Failed to simulate match end:', err);
      alert('Failed to simulate match end');
    }
  };

  const handleUpdateLiveScore = async (newHomeScore, newAwayScore) => {
    try {
      const hScore = Math.max(0, newHomeScore ?? 0);
      const aScore = Math.max(0, newAwayScore ?? 0);
      await api.put(`/matches/${match._id}/result`, {
        homeScore: hScore,
        awayScore: aScore,
        status: 'live'
      });
      onPredicted && onPredicted();
    } catch (err) {
      console.error('Failed to update live score:', err);
      alert('Failed to update live score');
    }
  };

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
      className={`fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm transition-opacity duration-300 px-4 ${
        animate ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div
        className={`w-full max-w-lg rounded-t-[1.5rem] sm:rounded-xl p-6 relative overflow-hidden transition-all duration-300 ${
          animate ? 'translate-y-0 sm:scale-100' : 'translate-y-full sm:translate-y-0 sm:scale-95'
        }`}
        style={{
          background: 'rgba(5, 20, 36, 0.95)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 -10px 40px rgba(0, 0, 0, 0.5)',
        }}
      >
        <div className="sm:hidden w-12 h-1 bg-white/20 rounded-full mx-auto mb-5" />

        <button
          onClick={handleClose}
          className="absolute right-5 top-5 w-8 h-8 rounded border border-white/10 bg-white/5 hover:bg-white/10 flex items-center justify-center text-fm-muted hover:text-white transition-colors text-sm font-bold"
        >
          ✕
        </button>

        <div className="flex flex-col items-center mb-6 mt-2">
          <span className="text-[10px] font-mono font-bold text-fm-gold uppercase tracking-widest bg-fm-gold/10 px-3 py-1 rounded border border-fm-gold/20 mb-2">
            {match.group}
          </span>
          <span className="text-[10px] text-fm-muted font-mono tracking-widest">{match.venue}</span>
        </div>

        {/* ===== COMPLETED MATCH ===== */}
        {match.status === 'completed' && (
          <div className="px-2 pb-4">
            <div className="flex items-center justify-center gap-2 sm:gap-4 py-3">
              <div className="flex-1 text-center flex flex-col items-center max-w-[90px]">
                <div className="flex items-center justify-center h-10 mb-2 drop-shadow-md">
                  <TeamFlag teamName={match.homeTeam} fallbackEmoji={match.homeFlag} className="w-12 h-9 flex-shrink-0" />
                </div>
                <div className="font-display text-sm text-white font-bold tracking-wide truncate w-full">{match.homeTeam}</div>
              </div>
              <div className="px-2 text-center flex-shrink-0">
                <div className="font-mono text-4xl text-white px-4 py-2 rounded bg-white/5 border border-white/10 shadow-sm whitespace-nowrap font-bold">
                  {match.homeScore} – {match.awayScore}
                </div>
                {match.winner && (
                  <div className="mt-3 text-[10px] font-mono font-bold text-fm-gold tracking-widest uppercase">
                    {match.winner === 'Draw' ? 'DRAW' : `WINNER: ${match.winner}`}
                  </div>
                )}
              </div>
              <div className="flex-1 text-center flex flex-col items-center max-w-[90px]">
                <div className="flex items-center justify-center h-10 mb-2 drop-shadow-md">
                  <TeamFlag teamName={match.awayTeam} fallbackEmoji={match.awayFlag} className="w-12 h-9 flex-shrink-0" />
                </div>
                <div className="font-display text-sm text-white font-bold tracking-wide truncate w-full">{match.awayTeam}</div>
              </div>
            </div>
            
            {/* Global predictions for completed matches */}
            {globalPreds.length > 0 && (
              <div className="mt-6 border-t border-white/10 pt-4">
                <div className="text-[10px] text-fm-muted font-mono uppercase tracking-widest mb-3 font-bold text-center">
                  COMMUNITY PREDICTIONS
                </div>

                <div className="mb-4 px-2">
                  <div className="flex items-center justify-between text-[9px] font-bold text-fm-muted font-mono uppercase tracking-widest mb-1.5">
                    <span className="text-fm-green">{match.homeTeam} {homePct}%</span>
                    <span className="text-white/50">DRAW {drawPct}%</span>
                    <span className="text-fm-orange">{match.awayTeam} {awayPct}%</span>
                  </div>
                  <div className="h-2 w-full flex rounded overflow-hidden bg-black/40 border border-white/5">
                    {homePct > 0 && <div className="bg-fm-green transition-all duration-500" style={{ width: `${homePct}%` }} />}
                    {drawPct > 0 && <div className="bg-white/20 transition-all duration-500" style={{ width: `${drawPct}%` }} />}
                    {awayPct > 0 && <div className="bg-fm-orange transition-all duration-500" style={{ width: `${awayPct}%` }} />}
                  </div>
                </div>
                <div className="max-h-48 overflow-y-auto space-y-2 pr-1 scrollbar-none">
                  {globalPreds.map((pred) => (
                    <div key={pred._id} className="flex items-center justify-between glass-card px-4 py-3">
                      <div className="flex items-center gap-3">
                        <UserAvatar avatarId={pred.user?.avatar} className="w-8 h-8 flex-shrink-0 text-xs border border-white/20 rounded-full" />
                        <span className="text-sm text-white font-display font-bold truncate max-w-[150px]">
                          {pred.user?.name || 'Unknown'}
                        </span>
                      </div>
                      <div className="font-mono text-xl text-white font-black bg-black/30 px-3 py-1 rounded border border-white/10">
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
                  <span className="inline-block w-2.5 h-2.5 rounded-full bg-fm-green drop-shadow-[0_0_6px_rgba(75,226,119,0.8)] animate-pulse" />
                  <span className="text-[10px] text-fm-green font-mono font-bold uppercase tracking-widest">
                    PREDICTION OPEN · {timeUntilKickoff()}
                  </span>
                </div>

                <div className="flex items-start justify-between gap-3 py-4 bg-white/5 rounded border border-white/10 mb-6 shadow-sm">
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
                    <div className="font-display text-2xl text-white/30 font-black tracking-widest italic">VS</div>
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
                  <div className="text-fm-red text-xs text-center mb-3 px-2 font-mono font-bold uppercase tracking-widest bg-fm-red/10 py-2 rounded border border-fm-red/20">
                    ⚠️ {submitError}
                  </div>
                )}
                {submitSuccess && (
                  <div className="text-fm-green text-xs text-center mb-3 font-mono font-bold animate-fade-in uppercase tracking-widest bg-fm-green/10 py-2 rounded border border-fm-green/20">
                    PREDICTION SAVED
                  </div>
                )}

                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="btn-primary w-full py-4 text-sm tracking-[0.2em]"
                >
                  {submitting ? 'SAVING...' : 'SUBMIT PREDICTION'}
                </button>

                <MatchComments matchId={match._id} />
              </>
            ) : globalMode ? (
              // Global Mode / Viewing others
              <>
                {prediction && (
                  <div className="mb-6 bg-fm-green/10 border border-fm-green/30 rounded p-4 flex flex-col justify-center items-center shadow-sm">
                    <span className="text-[10px] text-fm-green uppercase font-mono tracking-[0.2em] font-bold mb-2">YOUR LOCKED PREDICTION</span>
                    <div className="flex items-center gap-4">
                       <span className="text-white font-mono text-4xl font-bold bg-black/40 px-4 py-2 rounded border border-fm-green/20 drop-shadow-[0_0_8px_rgba(75,226,119,0.3)]">{prediction.homeGoals} – {prediction.awayGoals}</span>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-center gap-2 sm:gap-4 py-4">
                  <div className="flex-1 text-center flex flex-col items-center max-w-[90px]">
                    <div className="flex items-center justify-center h-10 mb-2 drop-shadow-md">
                      <TeamFlag teamName={match.homeTeam} fallbackEmoji={match.homeFlag} className="w-12 h-9 flex-shrink-0" />
                    </div>
                    <div className="font-display text-sm text-white font-bold tracking-wide uppercase truncate w-full">{match.homeTeam}</div>
                  </div>
                  <div className="px-2 text-center flex-shrink-0">
                    <div className="font-display text-3xl text-white/30 italic font-black">VS</div>
                    {isOpen && (
                      <div className="text-[10px] font-mono font-bold text-fm-muted mt-2 tracking-widest">{timeUntilKickoff()} LEFT</div>
                    )}
                  </div>
                  <div className="flex-1 text-center flex flex-col items-center max-w-[90px]">
                    <div className="flex items-center justify-center h-10 mb-2 drop-shadow-md">
                      <TeamFlag teamName={match.awayTeam} fallbackEmoji={match.awayFlag} className="w-12 h-9 flex-shrink-0" />
                    </div>
                    <div className="font-display text-sm text-white font-bold tracking-wide uppercase truncate w-full">{match.awayTeam}</div>
                  </div>
                </div>

                {globalPreds.length > 0 ? (
                  <div className="mt-4 border-t border-white/10 pt-4">
                    <div className="text-[10px] text-fm-muted font-mono uppercase tracking-widest mb-3 font-bold text-center">
                      COMMUNITY PREDICTIONS ({globalPreds.length})
                    </div>

                    <div className="mb-4 px-2">
                      <div className="flex items-center justify-between text-[9px] font-bold text-fm-muted font-mono uppercase tracking-widest mb-1.5">
                        <span className="text-fm-green">{match.homeTeam} {homePct}%</span>
                        <span className="text-white/50">DRAW {drawPct}%</span>
                        <span className="text-fm-orange">{match.awayTeam} {awayPct}%</span>
                      </div>
                      <div className="h-2 w-full flex rounded overflow-hidden bg-black/40 border border-white/5">
                        {homePct > 0 && <div className="bg-fm-green transition-all duration-500" style={{ width: `${homePct}%` }} />}
                        {drawPct > 0 && <div className="bg-white/20 transition-all duration-500" style={{ width: `${drawPct}%` }} />}
                        {awayPct > 0 && <div className="bg-fm-orange transition-all duration-500" style={{ width: `${awayPct}%` }} />}
                      </div>
                    </div>
                    <div className="max-h-48 overflow-y-auto space-y-2 pr-1 scrollbar-none">
                      {globalPreds.map((pred) => (
                        <div key={pred._id} className="flex items-center justify-between glass-card px-4 py-3">
                          <div className="flex items-center gap-3">
                            <UserAvatar avatarId={pred.user?.avatar} className="w-8 h-8 flex-shrink-0 text-xs border border-white/20 rounded-full object-cover" />
                            <span className="text-sm text-white font-display font-bold truncate max-w-[150px]">
                              {pred.user?.name || 'Unknown'}
                            </span>
                          </div>
                          <div className="font-mono text-xl text-white font-black bg-black/30 px-3 py-1 rounded border border-white/10">
                            {pred.homeGoals} – {pred.awayGoals}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-fm-muted text-[10px] py-8 uppercase tracking-[0.2em] font-mono font-bold bg-white/5 border border-dashed border-white/20 rounded mt-4">
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
                        <div className="flex items-center justify-center h-10 mb-2 drop-shadow-md">
                          <TeamFlag teamName={match.homeTeam} fallbackEmoji={match.homeFlag} className="w-12 h-9 flex-shrink-0" />
                        </div>
                        <div className="font-display text-sm text-white font-bold tracking-wide uppercase truncate w-full">{match.homeTeam}</div>
                      </div>
                      <div className="px-2 text-center opacity-60 flex-shrink-0">
                        <div className="font-display text-3xl text-white/30 italic font-black">VS</div>
                      </div>
                      <div className="flex-1 text-center flex flex-col items-center opacity-60 max-w-[90px]">
                        <div className="flex items-center justify-center h-10 mb-2 drop-shadow-md">
                          <TeamFlag teamName={match.awayTeam} fallbackEmoji={match.awayFlag} className="w-12 h-9 flex-shrink-0" />
                        </div>
                        <div className="font-display text-sm text-white font-bold tracking-wide uppercase truncate w-full">{match.awayTeam}</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-center gap-2 px-6 py-4 rounded text-xs text-fm-muted font-mono font-bold uppercase tracking-widest bg-white/5 border border-white/10 text-center">
                      PREDICTIONS OPEN {timeUntilWindow()} BEFORE KICKOFF
                    </div>
                  </>
                )}

                {isOpen && prediction && (
                  <>
                    <div className="py-2 flex items-center justify-center mb-4">
                      <span className="text-[10px] text-white/60 font-mono font-bold uppercase tracking-[0.2em] bg-white/5 px-4 py-1.5 rounded border border-white/10">
                        PREDICTION LOCKED IN
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-4 py-4 px-2">
                      <div className="flex-1 text-center">
                        <div className="font-display text-lg text-white font-bold uppercase tracking-wide">{match.homeTeam}</div>
                      </div>
                      <div className="px-6 py-4 bg-black/40 border border-white/10 rounded shadow-sm text-center min-w-[140px]">
                        <div className="font-mono text-5xl text-fm-green font-bold drop-shadow-[0_0_12px_rgba(75,226,119,0.3)]">
                          {prediction.homeGoals} – {prediction.awayGoals}
                        </div>
                      </div>
                      <div className="flex-1 text-center">
                        <div className="font-display text-lg text-white font-bold uppercase tracking-wide">{match.awayTeam}</div>
                      </div>
                    </div>
                    
                    {globalPreds.length > 0 && (
                      <div className="mt-6 border-t border-white/10 pt-4">
                        <div className="text-[10px] text-fm-muted font-mono uppercase tracking-widest mb-3 font-bold text-center">
                          COMMUNITY PREDICTIONS ({globalPreds.length})
                        </div>
                        <div className="mb-4 px-2">
                          <div className="flex items-center justify-between text-[9px] font-bold text-fm-muted font-mono uppercase tracking-widest mb-1.5">
                            <span className="text-fm-green">{match.homeTeam} {homePct}%</span>
                            <span className="text-white/50">DRAW {drawPct}%</span>
                            <span className="text-fm-orange">{match.awayTeam} {awayPct}%</span>
                          </div>
                          <div className="h-2 w-full flex rounded overflow-hidden bg-black/40 border border-white/5">
                            {homePct > 0 && <div className="bg-fm-green transition-all duration-500" style={{ width: `${homePct}%` }} />}
                            {drawPct > 0 && <div className="bg-white/20 transition-all duration-500" style={{ width: `${drawPct}%` }} />}
                            {awayPct > 0 && <div className="bg-fm-orange transition-all duration-500" style={{ width: `${awayPct}%` }} />}
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {isLocked && (
                  <>
                    <div className="py-2 flex items-center justify-center mb-4">
                      <span className="text-[10px] text-white/60 font-mono font-bold uppercase tracking-[0.2em] bg-white/5 px-4 py-1.5 rounded border border-white/10">
                        MATCH STARTED — LOCKED
                      </span>
                    </div>
                    <div className="flex items-center justify-center gap-2 sm:gap-4 py-6">
                      <div className="flex-1 text-center flex flex-col items-center opacity-70 max-w-[90px]">
                        <div className="flex items-center justify-center h-10 mb-2 drop-shadow-md">
                          <TeamFlag teamName={match.homeTeam} fallbackEmoji={match.homeFlag} className="w-12 h-9 flex-shrink-0" />
                        </div>
                        <div className="font-display text-sm text-white font-bold tracking-wide uppercase truncate w-full">{match.homeTeam}</div>
                      </div>
                      
                      {match.status === 'live' ? (
                        <div className="px-2 text-center flex-shrink-0 flex flex-col items-center">
                          <div className="font-mono text-4xl text-white px-5 py-2.5 rounded border border-fm-orange/30 bg-fm-orange/10 flex items-center gap-2 font-bold shadow-[0_0_15px_rgba(236,106,6,0.2)]">
                            <span className="w-2.5 h-2.5 rounded-full bg-fm-orange animate-pulse shadow-[0_0_6px_rgba(236,106,6,0.8)]"></span>
                            <span>{match.homeScore ?? 0} – {match.awayScore ?? 0}</span>
                          </div>
                          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-fm-orange mt-2 animate-pulse">
                            {match.shortStatus && match.shortStatus !== '1H' && match.shortStatus !== '2H' ? match.shortStatus : match.elapsed ? `LIVE ${match.elapsed}'` : 'LIVE NOW'}
                          </span>
                        </div>
                      ) : (
                        <div className="px-2 text-center opacity-70 flex-shrink-0">
                          <div className="font-display text-3xl text-white/30 italic font-black">VS</div>
                        </div>
                      )}

                      <div className="flex-1 text-center flex flex-col items-center opacity-70 max-w-[90px]">
                        <div className="flex items-center justify-center h-10 mb-2 drop-shadow-md">
                          <TeamFlag teamName={match.awayTeam} fallbackEmoji={match.awayFlag} className="w-12 h-9 flex-shrink-0" />
                        </div>
                        <div className="font-display text-sm text-white font-bold tracking-wide uppercase truncate w-full">{match.awayTeam}</div>
                      </div>
                    </div>

                    {user?.role === 'admin' && match.status === 'live' && (
                      <div className="mt-6 border-t border-white/10 pt-4 text-center">
                        <span className="text-[10px] text-fm-muted uppercase tracking-widest font-mono font-bold block mb-3">
                          Live Score Simulator (Admin)
                        </span>
                        <div className="flex items-center justify-center gap-6 mb-4">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-fm-muted">{match.homeTeam}</span>
                            <button
                              onClick={() => handleUpdateLiveScore((match.homeScore ?? 0) - 1, match.awayScore ?? 0)}
                              disabled={(match.homeScore ?? 0) <= 0}
                              className="w-8 h-8 rounded border border-white/10 hover:bg-white/5 flex items-center justify-center font-bold text-white active:scale-95 transition-transform"
                            >
                              -
                            </button>
                            <span className="font-mono text-xl font-bold w-6">{match.homeScore ?? 0}</span>
                            <button
                              onClick={() => handleUpdateLiveScore((match.homeScore ?? 0) + 1, match.awayScore ?? 0)}
                              className="w-8 h-8 rounded border border-white/10 hover:bg-white/5 flex items-center justify-center font-bold text-white active:scale-95 transition-transform"
                            >
                              +
                            </button>
                          </div>
                          
                          <div className="w-[1px] h-8 bg-white/20"></div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleUpdateLiveScore(match.homeScore ?? 0, (match.awayScore ?? 0) - 1)}
                              disabled={(match.awayScore ?? 0) <= 0}
                              className="w-8 h-8 rounded border border-white/10 hover:bg-white/5 flex items-center justify-center font-bold text-white active:scale-95 transition-transform"
                            >
                              -
                            </button>
                            <span className="font-mono text-xl font-bold w-6">{match.awayScore ?? 0}</span>
                            <button
                              onClick={() => handleUpdateLiveScore(match.homeScore ?? 0, (match.awayScore ?? 0) + 1)}
                              className="w-8 h-8 rounded border border-white/10 hover:bg-white/5 flex items-center justify-center font-bold text-white active:scale-95 transition-transform"
                            >
                              +
                            </button>
                            <span className="text-xs font-bold text-fm-muted">{match.awayTeam}</span>
                          </div>
                        </div>

                        <button
                          onClick={handleSimulateEnd}
                          className="w-full py-2.5 bg-fm-red/20 border border-fm-red/40 hover:bg-fm-red/30 text-fm-red rounded text-xs font-bold uppercase tracking-widest transition-colors active:scale-95 mb-4"
                        >
                          End Match & Finalize Results
                        </button>
                      </div>
                    )}

                    {prediction ? (
                      <div className="text-center text-sm text-fm-muted font-mono font-bold py-4 rounded mt-2 bg-white/5 border border-white/10 uppercase tracking-widest shadow-sm">
                        YOUR SCORE: <span className="text-white font-black ml-2">{prediction.homeGoals} – {prediction.awayGoals}</span>
                      </div>
                    ) : (
                      <div className="text-center text-[10px] text-fm-muted font-mono font-bold py-4 rounded mt-2 bg-black/40 border border-white/5 uppercase tracking-widest">
                        MISSED THIS MATCH
                      </div>
                    )}

                    {globalPreds.length > 0 && (
                      <div className="mt-6 border-t border-white/10 pt-4">
                        <div className="text-[10px] text-fm-muted font-mono uppercase tracking-widest mb-3 font-bold text-center">
                          COMMUNITY PREDICTIONS ({globalPreds.length})
                        </div>
                        <div className="mb-4 px-2">
                          <div className="flex items-center justify-between text-[9px] font-bold text-fm-muted font-mono uppercase tracking-widest mb-1.5">
                            <span className="text-fm-green">{match.homeTeam} {homePct}%</span>
                            <span className="text-white/50">DRAW {drawPct}%</span>
                            <span className="text-fm-orange">{match.awayTeam} {awayPct}%</span>
                          </div>
                          <div className="h-2 w-full flex rounded overflow-hidden bg-black/40 border border-white/5">
                            {homePct > 0 && <div className="bg-fm-green transition-all duration-500" style={{ width: `${homePct}%` }} />}
                            {drawPct > 0 && <div className="bg-white/20 transition-all duration-500" style={{ width: `${drawPct}%` }} />}
                            {awayPct > 0 && <div className="bg-fm-orange transition-all duration-500" style={{ width: `${awayPct}%` }} />}
                          </div>
                        </div>
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
