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
        colors: ['#00ff87', '#ffd700', '#ff3d00']
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
      onPredicted && onPredicted(); 
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
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-white backdrop-blur-sm transition-opacity duration-300 ${
        animate ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div
        className={`w-full max-w-xl max-h-[90vh] overflow-y-auto scrollbar-none rounded-2xl p-6 relative transition-all duration-300 glass-panel shadow-xl border border-outline-variant/30 ${
          animate ? 'translate-y-0 scale-100' : 'translate-y-4 scale-95'
        }`}
      >

        <button
          onClick={handleClose}
          className="absolute right-5 top-5 w-10 h-10 rounded-full border border-outline-variant/30 bg-white hover:bg-surface-variant flex items-center justify-center text-on-surface-variant hover:text-white transition-colors text-sm font-bold z-10"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        <div className="flex flex-col items-center mb-8 mt-2">
          <span className="font-label-md text-sm text-primary uppercase tracking-[0.2em] bg-primary/10 px-4 py-1.5 rounded border border-primary/30 mb-2 shadow-neon-primary">
            {match.group}
          </span>
          <span className="font-label-sm text-xs text-on-surface-variant tracking-[0.1em]">{match.venue}</span>
        </div>

        {/* ===== COMPLETED MATCH ===== */}
        {match.status === 'completed' && (
          <div className="px-2 pb-4">
            <div className="flex items-center justify-center gap-4 sm:gap-6 py-4">
              <div className="flex-1 text-center flex flex-col items-center">
                <div className="w-20 h-14 rounded bg-white border border-outline-variant/50 flex items-center justify-center overflow-hidden shadow-md mb-3">
                  <TeamFlag teamName={match.homeTeam} fallbackEmoji={match.homeFlag} className="w-full h-full object-cover" />
                </div>
                <div className="font-headline-md text-lg text-on-surface font-bold tracking-wide uppercase w-full line-clamp-2">{match.homeTeam}</div>
              </div>
              <div className="px-4 text-center flex-shrink-0">
                <div className="font-display-lg text-5xl text-on-surface px-6 py-3 rounded-lg bg-white border-2 border-outline-variant/30 shadow-subtle-card tracking-widest min-w-[120px]">
                  {match.homeScore} - {match.awayScore}
                </div>
                {match.winner && (
                  <div className="mt-4 font-label-md text-sm font-bold text-secondary tracking-widest uppercase drop-shadow-[0_0_5px_rgba(255,215,0,0.5)]">
                    {match.winner === 'Draw' ? 'DRAW' : `WINNER: ${match.winner}`}
                  </div>
                )}
              </div>
              <div className="flex-1 text-center flex flex-col items-center">
                <div className="w-20 h-14 rounded bg-white border border-outline-variant/50 flex items-center justify-center overflow-hidden shadow-md mb-3">
                  <TeamFlag teamName={match.awayTeam} fallbackEmoji={match.awayFlag} className="w-full h-full object-cover" />
                </div>
                <div className="font-headline-md text-lg text-on-surface font-bold tracking-wide uppercase w-full line-clamp-2">{match.awayTeam}</div>
              </div>
            </div>
            
            {/* Global predictions for completed matches */}
            {globalPreds.length > 0 && (
              <div className="mt-8 border-t border-outline-variant/30 pt-6">
                <div className="font-label-md text-xs text-on-surface-variant uppercase tracking-[0.2em] mb-4 text-center">
                  COMMUNITY PREDICTIONS
                </div>

                <div className="mb-6 px-2">
                  <div className="flex items-center justify-between text-[10px] text-on-surface-variant font-label-md uppercase tracking-widest mb-2">
                    <span className="text-secondary">{match.homeTeam} {homePct}%</span>
                    <span className="text-outline-variant">DRAW {drawPct}%</span>
                    <span className="text-[#ff3d00]">{match.awayTeam} {awayPct}%</span>
                  </div>
                  <div className="h-3 w-full flex rounded overflow-hidden bg-white border border-outline-variant/30 shadow-subtle-card">
                    {homePct > 0 && <div className="bg-secondary transition-all duration-500 shadow-[0_0_8px_rgba(255,215,0,0.5)]" style={{ width: `${homePct}%` }} />}
                    {drawPct > 0 && <div className="bg-outline-variant transition-all duration-500" style={{ width: `${drawPct}%` }} />}
                    {awayPct > 0 && <div className="bg-[#ff3d00] transition-all duration-500 shadow-[0_0_8px_rgba(255,61,0,0.5)]" style={{ width: `${awayPct}%` }} />}
                  </div>
                </div>
                <div className="max-h-56 overflow-y-auto space-y-3 pr-2 scrollbar-none">
                  {globalPreds.map((pred) => (
                    <div key={pred._id} className="flex items-center justify-between glass-panel rounded-lg px-5 py-3 shadow-sm border border-outline-variant/20 hover:border-outline-variant/30 transition-colors">
                      <div className="flex items-center gap-4">
                        <UserAvatar avatarId={pred.user?.avatar} className="w-10 h-10 flex-shrink-0 border-2 border-outline-variant/30 rounded-full object-cover shadow-sm" />
                        <span className="text-base text-on-surface font-headline-md font-bold truncate max-w-[150px]">
                          {pred.user?.name || 'Unknown'}
                        </span>
                      </div>
                      <div className="font-display-lg text-2xl tracking-widest text-primary bg-white px-4 py-1 rounded border border-outline-variant/30 shadow-subtle-card">
                        {pred.homeGoals} - {pred.awayGoals}
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
                <div className="py-2 mb-4 flex items-center justify-center gap-3">
                  <span className="inline-block w-3 h-3 rounded-full bg-primary shadow-neon-primary animate-pulse" />
                  <span className="font-label-md text-sm text-primary uppercase tracking-[0.2em] font-bold">
                    PREDICTION OPEN · {timeUntilKickoff()}
                  </span>
                </div>

                <div className="flex items-start justify-between gap-4 py-6 bg-white rounded-2xl border border-outline-variant/30 mb-8 shadow-subtle-card relative overflow-hidden px-6">
                  <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>
                  
                  <GoalSelector
                    teamName={match.homeTeam}
                    teamFlag={match.homeFlag}
                    goals={homeGoals}
                    onIncrease={() => increaseGoal('home')}
                    onDecrease={() => decreaseGoal('home')}
                    disabled={false}
                    side="left"
                  />

                  <div className="flex flex-col items-center justify-center pt-16 px-2">
                    <div className="font-headline-md text-2xl text-outline-variant/50 italic font-light">VS</div>
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
                  <div className="text-error text-xs text-center mb-4 px-2 font-label-md uppercase tracking-widest bg-error/10 py-3 rounded border border-error/30 shadow-neon-accent">
                    ⚠️ {submitError}
                  </div>
                )}
                {submitSuccess && (
                  <div className="text-primary text-xs text-center mb-4 font-label-md animate-fade-in uppercase tracking-widest bg-primary/10 py-3 rounded border border-primary/30 shadow-neon-primary">
                    PREDICTION SAVED
                  </div>
                )}

                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="w-full py-4 btn-primary flex items-center justify-center gap-3 mb-4"
                >
                  {submitting ? 'SAVING...' : 'SUBMIT PREDICTION'}
                  {!submitting && <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>}
                </button>

                <MatchComments matchId={match._id} />
              </>
            ) : globalMode ? (
              // Global Mode / Viewing others
              <>
                {prediction && (
                  <div className="mb-8 bg-primary/5 border border-primary/30 rounded-2xl p-5 flex flex-col justify-center items-center shadow-subtle-card relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent opacity-50 animate-pulse-fast"></div>
                    <span className="font-label-md text-xs text-primary uppercase tracking-[0.2em] mb-3 flex items-center gap-2 drop-shadow-sm">
                      <span className="material-symbols-outlined text-[16px]">lock</span> LOCKED IN PREDICTION
                    </span>
                    <div className="flex items-center gap-4">
                       <span className="text-primary font-display-lg tracking-widest text-5xl font-bold drop-shadow-[0_0_10px_rgba(0,255,135,0.4)]">{prediction.homeGoals} - {prediction.awayGoals}</span>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-center gap-4 sm:gap-6 py-4">
                  <div className="flex-1 text-center flex flex-col items-center">
                    <div className="w-20 h-14 rounded bg-white border border-outline-variant/50 flex items-center justify-center overflow-hidden shadow-md mb-3">
                      <TeamFlag teamName={match.homeTeam} fallbackEmoji={match.homeFlag} className="w-full h-full object-cover" />
                    </div>
                    <div className="font-headline-md text-base text-on-surface font-bold tracking-wide uppercase w-full line-clamp-2">{match.homeTeam}</div>
                  </div>
                  <div className="px-2 text-center flex-shrink-0">
                    <div className="font-headline-md text-3xl text-outline-variant/50 italic font-light">VS</div>
                    {isOpen && (
                      <div className="font-label-md text-xs text-on-surface-variant mt-3 tracking-[0.2em]">{timeUntilKickoff()}</div>
                    )}
                  </div>
                  <div className="flex-1 text-center flex flex-col items-center">
                    <div className="w-20 h-14 rounded bg-white border border-outline-variant/50 flex items-center justify-center overflow-hidden shadow-md mb-3">
                      <TeamFlag teamName={match.awayTeam} fallbackEmoji={match.awayFlag} className="w-full h-full object-cover" />
                    </div>
                    <div className="font-headline-md text-base text-on-surface font-bold tracking-wide uppercase w-full line-clamp-2">{match.awayTeam}</div>
                  </div>
                </div>

                {globalPreds.length > 0 ? (
                  <div className="mt-8 border-t border-outline-variant/30 pt-6">
                    <div className="font-label-md text-xs text-on-surface-variant uppercase tracking-[0.2em] mb-4 text-center">
                      COMMUNITY PREDICTIONS ({globalPreds.length})
                    </div>

                    <div className="mb-6 px-2">
                      <div className="flex items-center justify-between text-[10px] text-on-surface-variant font-label-md uppercase tracking-widest mb-2">
                        <span className="text-secondary">{match.homeTeam} {homePct}%</span>
                        <span className="text-outline-variant">DRAW {drawPct}%</span>
                        <span className="text-[#ff3d00]">{match.awayTeam} {awayPct}%</span>
                      </div>
                      <div className="h-3 w-full flex rounded overflow-hidden bg-white border border-outline-variant/30 shadow-subtle-card">
                        {homePct > 0 && <div className="bg-secondary transition-all duration-500 shadow-[0_0_8px_rgba(255,215,0,0.5)]" style={{ width: `${homePct}%` }} />}
                        {drawPct > 0 && <div className="bg-outline-variant transition-all duration-500" style={{ width: `${drawPct}%` }} />}
                        {awayPct > 0 && <div className="bg-[#ff3d00] transition-all duration-500 shadow-[0_0_8px_rgba(255,61,0,0.5)]" style={{ width: `${awayPct}%` }} />}
                      </div>
                    </div>
                    <div className="max-h-56 overflow-y-auto space-y-3 pr-2 scrollbar-none">
                      {globalPreds.map((pred) => (
                        <div key={pred._id} className="flex items-center justify-between glass-panel rounded-lg px-5 py-3 shadow-sm border border-outline-variant/20 hover:border-outline-variant/30 transition-colors">
                          <div className="flex items-center gap-4">
                            <UserAvatar avatarId={pred.user?.avatar} className="w-10 h-10 flex-shrink-0 border-2 border-outline-variant/30 rounded-full object-cover shadow-sm" />
                            <span className="text-base text-on-surface font-headline-md font-bold truncate max-w-[150px]">
                              {pred.user?.name || 'Unknown'}
                            </span>
                          </div>
                          <div className="font-display-lg text-2xl tracking-widest text-primary bg-white px-4 py-1 rounded border border-outline-variant/30 shadow-subtle-card">
                            {pred.homeGoals} - {pred.awayGoals}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-on-surface-variant text-xs py-10 uppercase tracking-[0.2em] font-label-md bg-white border border-dashed border-outline-variant/30 rounded-xl mt-6">
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
                    <div className="flex items-center justify-center gap-4 py-8">
                      <div className="flex-1 text-center flex flex-col items-center opacity-50 grayscale-[30%]">
                        <div className="w-20 h-14 rounded bg-white border border-outline-variant/50 flex items-center justify-center overflow-hidden shadow-md mb-3">
                          <TeamFlag teamName={match.homeTeam} fallbackEmoji={match.homeFlag} className="w-full h-full object-cover" />
                        </div>
                        <div className="font-headline-md text-base text-on-surface font-bold tracking-wide uppercase w-full line-clamp-2">{match.homeTeam}</div>
                      </div>
                      <div className="px-2 text-center opacity-50 flex-shrink-0">
                        <div className="font-headline-md text-3xl text-outline-variant/50 italic font-light">VS</div>
                      </div>
                      <div className="flex-1 text-center flex flex-col items-center opacity-50 grayscale-[30%]">
                        <div className="w-20 h-14 rounded bg-white border border-outline-variant/50 flex items-center justify-center overflow-hidden shadow-md mb-3">
                          <TeamFlag teamName={match.awayTeam} fallbackEmoji={match.awayFlag} className="w-full h-full object-cover" />
                        </div>
                        <div className="font-headline-md text-base text-on-surface font-bold tracking-wide uppercase w-full line-clamp-2">{match.awayTeam}</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-center gap-2 px-6 py-4 rounded-lg text-sm text-on-surface-variant font-label-md uppercase tracking-[0.2em] bg-white border border-outline-variant/30 text-center mb-4">
                      PREDICTIONS OPEN {timeUntilWindow()} BEFORE KICKOFF
                    </div>
                  </>
                )}

                {isOpen && prediction && (
                  <>
                    <div className="py-2 flex items-center justify-center mb-6">
                      <span className="font-label-md text-xs text-primary uppercase tracking-[0.2em] bg-primary/10 border border-primary/30 px-5 py-2 rounded shadow-neon-primary font-bold">
                        PREDICTION LOCKED IN
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-6 py-6 px-4">
                      <div className="flex-1 text-center">
                        <div className="font-headline-md text-xl text-on-surface font-bold uppercase tracking-wide">{match.homeTeam}</div>
                      </div>
                      <div className="px-8 py-4 bg-white border border-outline-variant/40 rounded-xl shadow-subtle-card text-center min-w-[140px]">
                        <div className="font-display-lg text-6xl tracking-widest text-primary font-bold drop-shadow-sm">
                          {prediction.homeGoals} - {prediction.awayGoals}
                        </div>
                      </div>
                      <div className="flex-1 text-center">
                        <div className="font-headline-md text-xl text-on-surface font-bold uppercase tracking-wide">{match.awayTeam}</div>
                      </div>
                    </div>
                    
                    {globalPreds.length > 0 && (
                      <div className="mt-8 border-t border-outline-variant/30 pt-6">
                        <div className="font-label-md text-xs text-on-surface-variant uppercase tracking-[0.2em] mb-4 text-center">
                          COMMUNITY PREDICTIONS ({globalPreds.length})
                        </div>
                        <div className="mb-4 px-2">
                          <div className="flex items-center justify-between text-[10px] text-on-surface-variant font-label-md uppercase tracking-widest mb-2">
                            <span className="text-secondary">{match.homeTeam} {homePct}%</span>
                            <span className="text-outline-variant">DRAW {drawPct}%</span>
                            <span className="text-[#ff3d00]">{match.awayTeam} {awayPct}%</span>
                          </div>
                          <div className="h-3 w-full flex rounded overflow-hidden bg-white border border-outline-variant/30 shadow-subtle-card">
                            {homePct > 0 && <div className="bg-secondary transition-all duration-500 shadow-[0_0_8px_rgba(255,215,0,0.5)]" style={{ width: `${homePct}%` }} />}
                            {drawPct > 0 && <div className="bg-outline-variant transition-all duration-500" style={{ width: `${drawPct}%` }} />}
                            {awayPct > 0 && <div className="bg-[#ff3d00] transition-all duration-500 shadow-[0_0_8px_rgba(255,61,0,0.5)]" style={{ width: `${awayPct}%` }} />}
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {isLocked && (
                  <>
                    <div className="py-2 flex items-center justify-center mb-6">
                      <span className="font-label-md text-xs text-on-surface-variant uppercase tracking-[0.2em] bg-white px-5 py-2 rounded border border-outline-variant/30 font-bold">
                        MATCH STARTED — LOCKED
                      </span>
                    </div>
                    <div className="flex items-center justify-center gap-4 py-6">
                      <div className="flex-1 text-center flex flex-col items-center opacity-80">
                        <div className="w-20 h-14 rounded bg-white border border-outline-variant/50 flex items-center justify-center overflow-hidden shadow-md mb-3">
                          <TeamFlag teamName={match.homeTeam} fallbackEmoji={match.homeFlag} className="w-full h-full object-cover" />
                        </div>
                        <div className="font-headline-md text-base text-on-surface font-bold tracking-wide uppercase w-full line-clamp-2">{match.homeTeam}</div>
                      </div>
                      
                      {match.status === 'live' ? (
                        <div className="px-4 text-center flex-shrink-0 flex flex-col items-center">
                          <div className="font-display-lg tracking-widest text-5xl text-primary px-6 py-3 rounded-lg border-2 border-primary/40 bg-white flex items-center gap-4 font-bold shadow-subtle-card drop-shadow-[0_0_10px_rgba(0,255,135,0.4)]">
                            <span className="w-3 h-3 rounded-full bg-primary animate-pulse shadow-neon-primary"></span>
                            <span>{match.homeScore ?? 0} - {match.awayScore ?? 0}</span>
                          </div>
                          <span className="font-label-md text-sm font-bold uppercase tracking-[0.2em] text-primary mt-3 animate-pulse">
                            {match.shortStatus && match.shortStatus !== '1H' && match.shortStatus !== '2H' ? match.shortStatus : match.elapsed ? `LIVE ${match.elapsed}'` : 'LIVE NOW'}
                          </span>
                        </div>
                      ) : (
                        <div className="px-2 text-center opacity-70 flex-shrink-0">
                          <div className="font-headline-md text-3xl text-outline-variant/50 italic font-light">VS</div>
                        </div>
                      )}

                      <div className="flex-1 text-center flex flex-col items-center opacity-80">
                        <div className="w-20 h-14 rounded bg-white border border-outline-variant/50 flex items-center justify-center overflow-hidden shadow-md mb-3">
                          <TeamFlag teamName={match.awayTeam} fallbackEmoji={match.awayFlag} className="w-full h-full object-cover" />
                        </div>
                        <div className="font-headline-md text-base text-on-surface font-bold tracking-wide uppercase w-full line-clamp-2">{match.awayTeam}</div>
                      </div>
                    </div>

                    {user?.role === 'admin' && match.status === 'live' && (
                      <div className="mt-8 border-t border-outline-variant/30 pt-6 text-center bg-white p-4 rounded-xl">
                        <span className="font-label-md text-xs text-[#ff3d00] uppercase tracking-[0.2em] font-bold block mb-4">
                          Simulate Live Events (Admin)
                        </span>
                        <div className="flex items-center justify-center gap-8 mb-6">
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-headline-md text-on-surface-variant uppercase">{match.homeTeam}</span>
                            <button
                              onClick={() => handleUpdateLiveScore((match.homeScore ?? 0) - 1, match.awayScore ?? 0)}
                              disabled={(match.homeScore ?? 0) <= 0}
                              className="w-10 h-10 rounded border border-outline-variant/50 bg-white hover:bg-surface-variant flex items-center justify-center font-bold text-on-surface active:scale-95 transition-all text-xl"
                            >
                              -
                            </button>
                            <span className="font-display-lg text-3xl tracking-tighter w-8 text-primary">{match.homeScore ?? 0}</span>
                            <button
                              onClick={() => handleUpdateLiveScore((match.homeScore ?? 0) + 1, match.awayScore ?? 0)}
                              className="w-10 h-10 rounded border border-outline-variant/50 bg-white hover:bg-surface-variant flex items-center justify-center font-bold text-on-surface active:scale-95 transition-all text-xl"
                            >
                              +
                            </button>
                          </div>
                          
                          <div className="w-[1px] h-10 bg-outline-variant/30"></div>

                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => handleUpdateLiveScore(match.homeScore ?? 0, (match.awayScore ?? 0) - 1)}
                              disabled={(match.awayScore ?? 0) <= 0}
                              className="w-10 h-10 rounded border border-outline-variant/50 bg-white hover:bg-surface-variant flex items-center justify-center font-bold text-on-surface active:scale-95 transition-all text-xl"
                            >
                              -
                            </button>
                            <span className="font-display-lg text-3xl tracking-tighter w-8 text-primary">{match.awayScore ?? 0}</span>
                            <button
                              onClick={() => handleUpdateLiveScore(match.homeScore ?? 0, (match.awayScore ?? 0) + 1)}
                              className="w-10 h-10 rounded border border-outline-variant/50 bg-white hover:bg-surface-variant flex items-center justify-center font-bold text-on-surface active:scale-95 transition-all text-xl"
                            >
                              +
                            </button>
                            <span className="text-sm font-headline-md text-on-surface-variant uppercase">{match.awayTeam}</span>
                          </div>
                        </div>

                        <button
                          onClick={handleSimulateEnd}
                          className="w-full py-3 bg-[#ff3d00]/20 text-[#ff3d00] border border-[#ff3d00]/50 hover:bg-[#ff3d00] hover:text-white rounded-lg text-sm font-label-md uppercase tracking-[0.1em] transition-all active:scale-95 shadow-neon-accent"
                        >
                          End Match & Finalize Results
                        </button>
                      </div>
                    )}

                    {prediction ? (
                      <div className="text-center font-label-md text-base text-on-surface-variant py-5 rounded-lg mt-6 bg-white border border-outline-variant/30 uppercase tracking-[0.1em] shadow-subtle-card">
                        YOUR SCORE: <span className="text-primary font-bold ml-3 text-xl drop-shadow-[0_0_5px_rgba(0,255,135,0.4)]">{prediction.homeGoals} - {prediction.awayGoals}</span>
                      </div>
                    ) : (
                      <div className="text-center text-xs text-on-surface-variant font-label-md py-6 rounded-lg mt-6 bg-white border border-dashed border-outline-variant/30 uppercase tracking-[0.2em]">
                        MISSED THIS MATCH
                      </div>
                    )}

                    {globalPreds.length > 0 && (
                      <div className="mt-8 border-t border-outline-variant/30 pt-6">
                        <div className="font-label-md text-xs text-on-surface-variant uppercase tracking-[0.2em] mb-4 text-center">
                          COMMUNITY PREDICTIONS ({globalPreds.length})
                        </div>
                        <div className="mb-4 px-2">
                          <div className="flex items-center justify-between text-[10px] text-on-surface-variant font-label-md uppercase tracking-widest mb-2">
                            <span className="text-secondary">{match.homeTeam} {homePct}%</span>
                            <span className="text-outline-variant">DRAW {drawPct}%</span>
                            <span className="text-[#ff3d00]">{match.awayTeam} {awayPct}%</span>
                          </div>
                          <div className="h-3 w-full flex rounded overflow-hidden bg-white border border-outline-variant/30 shadow-subtle-card">
                            {homePct > 0 && <div className="bg-secondary transition-all duration-500 shadow-[0_0_8px_rgba(255,215,0,0.5)]" style={{ width: `${homePct}%` }} />}
                            {drawPct > 0 && <div className="bg-outline-variant transition-all duration-500" style={{ width: `${drawPct}%` }} />}
                            {awayPct > 0 && <div className="bg-[#ff3d00] transition-all duration-500 shadow-[0_0_8px_rgba(255,61,0,0.5)]" style={{ width: `${awayPct}%` }} />}
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
