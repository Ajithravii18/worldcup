import { useState, useCallback, useEffect } from 'react';
import GoalSelector from './GoalSelector';
import TeamFlag from './TeamFlag';
import UserAvatar from './UserAvatar';
import api from '../api/axios';
import confetti from 'canvas-confetti';
import MatchComments from './MatchComments';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

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
      return () => {
        document.body.style.overflow = '';
      };
    } else {
      document.body.style.overflow = '';
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

  if (!match) return null;

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
    onClose();
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
    <AnimatePresence>
      {isOpenModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleBackdropClick}
          className="fixed inset-0 z-[100] flex items-center justify-center sm:p-6 bg-background/90"
        >
          <motion.div
            initial={{ scale: 0.95, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 20, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="w-full h-full sm:h-auto max-w-xl sm:max-h-[90vh] overflow-y-auto scrollbar-none sm:rounded-3xl p-4 sm:p-6 pt-8 sm:pt-6 pb-12 sm:pb-6 relative bg-surface shadow-2xl sm:border border-surface-variant"
          >
            <button
              onClick={handleClose}
              className="fixed sm:absolute right-5 top-5 w-10 h-10 rounded-full border border-outline-variant/20 bg-surface-variant hover:bg-surface-container-highest flex items-center justify-center text-outline-variant hover:text-white transition-colors text-sm font-bold z-50 shadow-lg"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>

            <div className="flex flex-col items-center mb-8 mt-2">
              <span className="font-display text-xs text-primary uppercase tracking-[0.2em] bg-primary/20 px-4 py-1.5 rounded border border-primary/50 mb-2 shadow-neon-primary font-black">
                {match.group}
              </span>
              <span className="font-display text-[10px] sm:text-xs text-outline-variant tracking-[0.2em] font-bold uppercase">{match.venue}</span>
            </div>

            {/* ===== COMPLETED MATCH ===== */}
            {hasMatchEnded && (
              <div className="px-2 pb-4">
                <div className="flex items-center justify-center gap-4 sm:gap-6 py-4">
                  <div className="flex-1 text-center flex flex-col items-center">
                    <div className="w-20 h-14 rounded-xl bg-black border border-white/20 flex items-center justify-center overflow-hidden shadow-md mb-3 -skew-x-6">
                      <TeamFlag teamName={match.homeTeam} fallbackEmoji={match.homeFlag} className="w-full h-full object-cover skew-x-6" />
                    </div>
                    <div className="font-display text-lg text-white font-black tracking-widest uppercase w-full line-clamp-2">{match.homeTeam}</div>
                  </div>
                  <div className="px-4 text-center flex-shrink-0">
                    <div className="font-display text-5xl text-white px-6 py-3 rounded-2xl bg-black/50 border border-white/20 shadow-inner tracking-widest min-w-[120px] font-black">
                      {match.homeScore} - {match.awayScore}
                    </div>
                    {match.winner && (
                      <div className="mt-4 font-display text-xs font-black text-[#FFD700] tracking-[0.2em] uppercase drop-shadow-[0_0_8px_rgba(255,215,0,0.6)]">
                        {match.winner === 'Draw' ? 'DRAW' : `WINNER: ${match.winner}`}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 text-center flex flex-col items-center">
                    <div className="w-20 h-14 rounded-xl bg-black border border-white/20 flex items-center justify-center overflow-hidden shadow-md mb-3 -skew-x-6">
                      <TeamFlag teamName={match.awayTeam} fallbackEmoji={match.awayFlag} className="w-full h-full object-cover skew-x-6" />
                    </div>
                    <div className="font-display text-lg text-white font-black tracking-widest uppercase w-full line-clamp-2">{match.awayTeam}</div>
                  </div>
                </div>
                
                {/* Global predictions for completed matches */}
                {globalPreds.length > 0 && (
                  <div className="mt-8 border-t border-white/10 pt-6">
                    <div className="font-display text-[10px] text-outline-variant font-bold uppercase tracking-[0.2em] mb-4 text-center">
                      COMMUNITY PREDICTIONS
                    </div>

                    <div className="mb-6 px-2">
                      <div className="flex items-center justify-between text-[10px] text-outline-variant font-display font-bold uppercase tracking-widest mb-2">
                        <span className="text-secondary drop-shadow-[0_0_5px_rgba(0,255,135,0.4)]">{match.homeTeam} {homePct}%</span>
                        <span className="text-white/60">DRAW {drawPct}%</span>
                        <span className="text-[#ff3d00] drop-shadow-[0_0_5px_rgba(255,61,0,0.4)]">{match.awayTeam} {awayPct}%</span>
                      </div>
                      <div className="h-3 w-full flex rounded overflow-hidden bg-black/40 border border-white/10 shadow-inner">
                        {homePct > 0 && <div className="bg-secondary transition-all duration-500 shadow-[0_0_8px_rgba(0,255,135,0.5)]" style={{ width: `${homePct}%` }} />}
                        {drawPct > 0 && <div className="bg-white/40 transition-all duration-500" style={{ width: `${drawPct}%` }} />}
                        {awayPct > 0 && <div className="bg-[#ff3d00] transition-all duration-500 shadow-[0_0_8px_rgba(255,61,0,0.5)]" style={{ width: `${awayPct}%` }} />}
                      </div>
                    </div>
                    <div className="max-h-56 overflow-y-auto space-y-3 pr-2 scrollbar-none">
                      {globalPreds.map((pred) => (
                        <div key={pred._id} className="flex items-center justify-between bg-white/5 rounded-xl px-5 py-3 shadow-inner border border-white/10 hover:bg-white/10 transition-colors">
                          <div className="flex items-center gap-4">
                            <UserAvatar avatarId={pred.user?.avatar} className="w-10 h-10 flex-shrink-0 border border-white/20 rounded-full object-cover shadow-sm bg-black" />
                            <span className="text-sm sm:text-base text-white font-display font-black tracking-widest uppercase truncate max-w-[150px]">
                              {pred.user?.name || 'Unknown'}
                            </span>
                          </div>
                          <div className="font-display text-xl sm:text-2xl font-black tracking-widest text-primary bg-black/50 px-4 py-1.5 rounded-lg border border-white/10 shadow-inner">
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
            {!hasMatchEnded && (
              <div className="px-2 pb-4">
                {/* If open and predicting */}
                {isOpen && !prediction ? (
                  <>
                    <div className="py-2 mb-4 flex items-center justify-center gap-3">
                      <span className="inline-block w-2.5 h-2.5 rounded-full bg-primary shadow-neon-primary animate-pulse" />
                      <span className="font-display text-[10px] sm:text-xs text-primary uppercase tracking-[0.2em] font-black">
                        PREDICTION OPEN · {timeUntilKickoff()}
                      </span>
                    </div>

                    <div className="flex items-start justify-between gap-4 py-6 bg-surface-variant rounded-3xl border border-outline-variant/20 mb-8 shadow-inner relative overflow-hidden px-6">
                      <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-80 shadow-neon-primary"></div>
                      
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
                        <div className="font-display text-2xl text-outline-variant italic font-black">VS</div>
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
                      <div className="text-error text-[10px] sm:text-xs text-center mb-4 px-2 font-display uppercase tracking-widest bg-error/20 py-3 rounded-xl border border-error/50 shadow-neon-accent font-bold">
                        ⚠️ {submitError}
                      </div>
                    )}
                    {submitSuccess && (
                      <div className="text-primary text-[10px] sm:text-xs text-center mb-4 font-display font-black uppercase tracking-[0.2em] bg-primary/20 py-3 rounded-xl border border-primary/50 shadow-neon-primary">
                        PREDICTION SAVED
                      </div>
                    )}

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleSubmit}
                      disabled={submitting}
                      className="w-full py-4 bg-primary text-white font-display font-black tracking-widest rounded-xl hover:bg-primary-hover hover:shadow-neon-primary transition-all flex items-center justify-center gap-3 mb-4 uppercase"
                    >
                      {submitting ? 'SAVING...' : 'SUBMIT PREDICTION'}
                      {!submitting && <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>}
                    </motion.button>

                    <MatchComments matchId={match._id} />
                  </>
                ) : globalMode ? (
                  // Global Mode / Viewing others
                  <>
                    {prediction && (
                      <div className="mb-8 bg-primary/10 border border-primary/30 rounded-2xl p-6 flex flex-col justify-center items-center shadow-inner relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent opacity-80 animate-pulse-fast"></div>
                        <span className="font-display text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-4 flex items-center gap-2 drop-shadow-md">
                          <span className="material-symbols-outlined text-[16px]">lock</span> LOCKED IN PREDICTION
                        </span>
                        <div className="flex items-center gap-4">
                           <span className="text-primary font-display tracking-widest text-6xl font-black drop-shadow-[0_0_15px_rgba(0,255,135,0.6)]">{prediction.homeGoals} - {prediction.awayGoals}</span>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-center gap-4 sm:gap-6 py-4">
                      <div className="flex-1 text-center flex flex-col items-center">
                        <div className="w-20 h-14 rounded-xl bg-black border border-white/20 flex items-center justify-center overflow-hidden shadow-md mb-3 -skew-x-6">
                          <TeamFlag teamName={match.homeTeam} fallbackEmoji={match.homeFlag} className="w-full h-full object-cover skew-x-6" />
                        </div>
                        <div className="font-display text-sm sm:text-base text-white font-black tracking-widest uppercase w-full line-clamp-2">{match.homeTeam}</div>
                      </div>
                      <div className="px-2 text-center flex-shrink-0">
                        <div className="font-display text-3xl text-outline-variant italic font-black">VS</div>
                        {isOpen && (
                          <div className="font-display text-[10px] text-outline-variant mt-3 font-bold tracking-[0.2em]">{timeUntilKickoff()}</div>
                        )}
                      </div>
                      <div className="flex-1 text-center flex flex-col items-center">
                        <div className="w-20 h-14 rounded-xl bg-black border border-white/20 flex items-center justify-center overflow-hidden shadow-md mb-3 -skew-x-6">
                          <TeamFlag teamName={match.awayTeam} fallbackEmoji={match.awayFlag} className="w-full h-full object-cover skew-x-6" />
                        </div>
                        <div className="font-display text-sm sm:text-base text-white font-black tracking-widest uppercase w-full line-clamp-2">{match.awayTeam}</div>
                      </div>
                    </div>

                    {globalPreds.length > 0 ? (
                      <div className="mt-8 border-t border-white/10 pt-6">
                        <div className="font-display text-[10px] font-bold text-outline-variant uppercase tracking-[0.2em] mb-4 text-center">
                          COMMUNITY PREDICTIONS ({globalPreds.length})
                        </div>

                        <div className="mb-6 px-2">
                          <div className="flex items-center justify-between text-[10px] text-outline-variant font-display font-bold uppercase tracking-widest mb-2">
                            <span className="text-secondary drop-shadow-[0_0_5px_rgba(0,255,135,0.4)]">{match.homeTeam} {homePct}%</span>
                            <span className="text-white/60">DRAW {drawPct}%</span>
                            <span className="text-[#ff3d00] drop-shadow-[0_0_5px_rgba(255,61,0,0.4)]">{match.awayTeam} {awayPct}%</span>
                          </div>
                          <div className="h-3 w-full flex rounded overflow-hidden bg-black/40 border border-white/10 shadow-inner">
                            {homePct > 0 && <div className="bg-secondary transition-all duration-500 shadow-[0_0_8px_rgba(0,255,135,0.5)]" style={{ width: `${homePct}%` }} />}
                            {drawPct > 0 && <div className="bg-white/40 transition-all duration-500" style={{ width: `${drawPct}%` }} />}
                            {awayPct > 0 && <div className="bg-[#ff3d00] transition-all duration-500 shadow-[0_0_8px_rgba(255,61,0,0.5)]" style={{ width: `${awayPct}%` }} />}
                          </div>
                        </div>
                        <div className="max-h-56 overflow-y-auto space-y-3 pr-2 scrollbar-none">
                          {globalPreds.map((pred) => (
                            <div key={pred._id} className="flex items-center justify-between bg-white/5 rounded-xl px-5 py-3 shadow-inner border border-white/10 hover:bg-white/10 transition-colors">
                              <div className="flex items-center gap-4">
                                <UserAvatar avatarId={pred.user?.avatar} className="w-10 h-10 flex-shrink-0 border border-white/20 rounded-full object-cover shadow-sm bg-black" />
                                <span className="text-sm sm:text-base text-white font-display font-black tracking-widest uppercase truncate max-w-[150px]">
                                  {pred.user?.name || 'Unknown'}
                                </span>
                              </div>
                              <div className="font-display text-xl sm:text-2xl font-black tracking-widest text-primary bg-black/50 px-4 py-1.5 rounded-lg border border-white/10 shadow-inner">
                                {pred.homeGoals} - {pred.awayGoals}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center text-outline-variant text-[10px] sm:text-xs py-10 uppercase tracking-[0.2em] font-display font-bold bg-surface-variant border border-dashed border-outline-variant/20 rounded-2xl mt-6">
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
                          <div className="flex-1 text-center flex flex-col items-center opacity-50 grayscale">
                            <div className="w-20 h-14 rounded-xl bg-black border border-white/20 flex items-center justify-center overflow-hidden shadow-md mb-3 -skew-x-6">
                              <TeamFlag teamName={match.homeTeam} fallbackEmoji={match.homeFlag} className="w-full h-full object-cover skew-x-6" />
                            </div>
                            <div className="font-display text-sm sm:text-base text-white font-black tracking-widest uppercase w-full line-clamp-2">{match.homeTeam}</div>
                          </div>
                          <div className="px-2 text-center opacity-50 flex-shrink-0">
                            <div className="font-display text-3xl text-outline-variant italic font-black">VS</div>
                          </div>
                          <div className="flex-1 text-center flex flex-col items-center opacity-50 grayscale">
                            <div className="w-20 h-14 rounded-xl bg-black border border-white/20 flex items-center justify-center overflow-hidden shadow-md mb-3 -skew-x-6">
                              <TeamFlag teamName={match.awayTeam} fallbackEmoji={match.awayFlag} className="w-full h-full object-cover skew-x-6" />
                            </div>
                            <div className="font-display text-sm sm:text-base text-white font-black tracking-widest uppercase w-full line-clamp-2">{match.awayTeam}</div>
                          </div>
                        </div>
                        {hasStarted && (
                        <div className="flex items-center justify-center gap-2 px-6 py-5 rounded-2xl text-[10px] sm:text-xs text-outline-variant font-display font-bold uppercase tracking-[0.2em] bg-surface-variant border border-outline-variant/20 text-center mb-4 shadow-inner">
                          PREDICTIONS OPEN {timeUntilWindow()} BEFORE KICKOFF
                        </div>
                        )}
                      </>
                    )}

                    {isOpen && prediction && (
                      <>
                        <div className="py-2 flex items-center justify-center mb-6">
                          <span className="font-display text-[10px] sm:text-xs text-primary uppercase tracking-[0.2em] bg-primary/20 border border-primary/50 px-5 py-2.5 rounded shadow-neon-primary font-black">
                            PREDICTION LOCKED IN
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-6 py-6 px-4">
                          <div className="flex-1 text-center">
                            <div className="font-display text-lg text-white font-black uppercase tracking-widest">{match.homeTeam}</div>
                          </div>
                          <div className="px-8 py-5 bg-surface border border-outline-variant/20 rounded-2xl shadow-inner text-center min-w-[140px]">
                            <div className="font-display text-6xl tracking-widest text-primary font-black drop-shadow-[0_0_15px_rgba(0,255,135,0.6)]">
                              {prediction.homeGoals} - {prediction.awayGoals}
                            </div>
                          </div>
                          <div className="flex-1 text-center">
                            <div className="font-display text-lg text-white font-black uppercase tracking-widest">{match.awayTeam}</div>
                          </div>
                        </div>
                        
                        {globalPreds.length > 0 && (
                          <div className="mt-8 border-t border-white/10 pt-6">
                            <div className="font-display text-[10px] font-bold text-outline-variant uppercase tracking-[0.2em] mb-4 text-center">
                              COMMUNITY PREDICTIONS ({globalPreds.length})
                            </div>
                            <div className="mb-4 px-2">
                              <div className="flex items-center justify-between text-[10px] text-outline-variant font-display font-bold uppercase tracking-widest mb-2">
                                <span className="text-secondary drop-shadow-[0_0_5px_rgba(0,255,135,0.4)]">{match.homeTeam} {homePct}%</span>
                                <span className="text-white/60">DRAW {drawPct}%</span>
                                <span className="text-[#ff3d00] drop-shadow-[0_0_5px_rgba(255,61,0,0.4)]">{match.awayTeam} {awayPct}%</span>
                              </div>
                              <div className="h-3 w-full flex rounded overflow-hidden bg-black/40 border border-white/10 shadow-inner">
                                {homePct > 0 && <div className="bg-secondary transition-all duration-500 shadow-[0_0_8px_rgba(0,255,135,0.5)]" style={{ width: `${homePct}%` }} />}
                                {drawPct > 0 && <div className="bg-white/40 transition-all duration-500" style={{ width: `${drawPct}%` }} />}
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
                          <span className="font-display text-[10px] sm:text-xs text-error uppercase tracking-[0.2em] bg-error/20 px-5 py-2.5 rounded border border-error/50 font-black shadow-inner">
                            MATCH STARTED — LOCKED
                          </span>
                        </div>
                        <div className="flex items-center justify-center gap-4 py-6">
                          <div className="flex-1 text-center flex flex-col items-center opacity-80">
                            <div className="w-20 h-14 rounded-xl bg-black border border-white/20 flex items-center justify-center overflow-hidden shadow-md mb-3 -skew-x-6">
                              <TeamFlag teamName={match.homeTeam} fallbackEmoji={match.homeFlag} className="w-full h-full object-cover skew-x-6" />
                            </div>
                            <div className="font-display text-sm sm:text-base text-white font-black tracking-widest uppercase w-full line-clamp-2">{match.homeTeam}</div>
                          </div>
                          
                          {match.status === 'live' ? (
                            <div className="w-full flex justify-center mb-3">
                              <div className="font-display tracking-widest text-5xl text-primary px-6 py-4 rounded-2xl border border-primary/50 bg-primary/10 flex items-center gap-4 font-black shadow-neon-primary drop-shadow-[0_0_15px_rgba(0,255,135,0.6)]">
                                <span className="w-3 h-3 rounded-full bg-primary animate-pulse shadow-[0_0_8px_#00ff87]"></span>
                                <span>{match.homeScore ?? 0} - {match.awayScore ?? 0}</span>
                              </div>
                              <span className="font-display text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-primary mt-4 animate-pulse">
                                {match.shortStatus && match.shortStatus !== '1H' && match.shortStatus !== '2H' ? match.shortStatus : match.elapsed ? `LIVE ${match.elapsed}'` : 'LIVE NOW'}
                              </span>
                            </div>
                          ) : (
                            <div className="px-2 text-center opacity-70 flex-shrink-0">
                              <div className="font-display text-3xl text-outline-variant italic font-black">VS</div>
                            </div>
                          )}

                          <div className="flex-1 text-center flex flex-col items-center opacity-80">
                            <div className="w-20 h-14 rounded-xl bg-black border border-white/20 flex items-center justify-center overflow-hidden shadow-md mb-3 -skew-x-6">
                              <TeamFlag teamName={match.awayTeam} fallbackEmoji={match.awayFlag} className="w-full h-full object-cover skew-x-6" />
                            </div>
                            <div className="font-display text-sm sm:text-base text-white font-black tracking-widest uppercase w-full line-clamp-2">{match.awayTeam}</div>
                          </div>
                        </div>

                        {user?.role === 'admin' && !hasMatchEnded && (
                          <div className="mt-8 border-t border-surface-variant pt-6 text-center bg-surface-variant p-6 rounded-2xl">
                            <span className="font-display text-[10px] sm:text-xs text-error uppercase tracking-[0.2em] font-black block mb-6 drop-shadow-[0_0_5px_rgba(255,61,0,0.8)]">
                              Simulate Live Events (Admin)
                            </span>
                            <div className="flex items-center justify-center gap-8 mb-8">
                              <div className="flex items-center gap-4">
                                <span className="text-[10px] sm:text-xs font-display font-bold text-outline-variant uppercase tracking-widest">{match.homeTeam}</span>
                                <button
                                  onClick={() => handleUpdateLiveScore((match.homeScore ?? 0) - 1, match.awayScore ?? 0)}
                                  disabled={(match.homeScore ?? 0) <= 0}
                                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl border border-white/20 bg-black/50 hover:bg-white/10 flex items-center justify-center font-bold text-white active:scale-95 transition-all text-xl sm:text-2xl"
                                >
                                  -
                                </button>
                                <span className="font-display text-3xl sm:text-4xl tracking-tighter w-10 sm:w-12 text-primary font-black drop-shadow-md">{match.homeScore ?? 0}</span>
                                <button
                                  onClick={() => handleUpdateLiveScore((match.homeScore ?? 0) + 1, match.awayScore ?? 0)}
                                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl border border-white/20 bg-black/50 hover:bg-white/10 flex items-center justify-center font-bold text-white active:scale-95 transition-all text-xl sm:text-2xl"
                                >
                                  +
                                </button>
                              </div>
                              
                              <div className="w-[1px] h-12 bg-white/20"></div>

                              <div className="flex items-center gap-4">
                                <button
                                  onClick={() => handleUpdateLiveScore(match.homeScore ?? 0, (match.awayScore ?? 0) - 1)}
                                  disabled={(match.awayScore ?? 0) <= 0}
                                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl border border-white/20 bg-black/50 hover:bg-white/10 flex items-center justify-center font-bold text-white active:scale-95 transition-all text-xl sm:text-2xl"
                                >
                                  -
                                </button>
                                <span className="font-display text-3xl sm:text-4xl tracking-tighter w-10 sm:w-12 text-primary font-black drop-shadow-md">{match.awayScore ?? 0}</span>
                                <button
                                  onClick={() => handleUpdateLiveScore(match.homeScore ?? 0, (match.awayScore ?? 0) + 1)}
                                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl border border-white/20 bg-black/50 hover:bg-white/10 flex items-center justify-center font-bold text-white active:scale-95 transition-all text-xl sm:text-2xl"
                                >
                                  +
                                </button>
                                <span className="text-[10px] sm:text-xs font-display font-bold text-outline-variant uppercase tracking-widest">{match.awayTeam}</span>
                              </div>
                            </div>

                            <button
                              onClick={handleSimulateEnd}
                              className="w-full py-4 bg-error/20 text-error border border-error/50 hover:bg-error hover:text-white rounded-xl text-xs sm:text-sm font-display font-black uppercase tracking-[0.2em] transition-all active:scale-95 shadow-inner"
                            >
                              End Match & Finalize Results
                            </button>
                          </div>
                        )}

                        {prediction ? (
                          <div className="text-center font-display text-sm sm:text-base text-outline-variant py-6 rounded-2xl mt-6 bg-surface-variant border border-outline-variant/20 uppercase tracking-[0.2em] shadow-inner font-bold">
                            YOUR SCORE: <span className="text-primary font-black ml-3 text-2xl drop-shadow-[0_0_10px_rgba(0,255,135,0.6)]">{prediction.homeGoals} - {prediction.awayGoals}</span>
                          </div>
                        ) : (
                          <div className="text-center text-[10px] sm:text-xs text-outline-variant font-display py-8 rounded-2xl mt-6 bg-surface-variant border border-dashed border-outline-variant/20 uppercase tracking-[0.2em] font-bold">
                            MISSED THIS MATCH
                          </div>
                        )}

                        {globalPreds.length > 0 && (
                          <div className="mt-8 border-t border-white/10 pt-6">
                            <div className="font-display text-[10px] font-bold text-outline-variant uppercase tracking-[0.2em] mb-4 text-center">
                              COMMUNITY PREDICTIONS ({globalPreds.length})
                            </div>
                            <div className="mb-4 px-2">
                              <div className="flex items-center justify-between text-[10px] text-outline-variant font-display font-bold uppercase tracking-widest mb-2">
                                <span className="text-secondary drop-shadow-[0_0_5px_rgba(0,255,135,0.4)]">{match.homeTeam} {homePct}%</span>
                                <span className="text-white/60">DRAW {drawPct}%</span>
                                <span className="text-[#ff3d00] drop-shadow-[0_0_5px_rgba(255,61,0,0.4)]">{match.awayTeam} {awayPct}%</span>
                              </div>
                              <div className="h-3 w-full flex rounded overflow-hidden bg-black/40 border border-white/10 shadow-inner">
                                {homePct > 0 && <div className="bg-secondary transition-all duration-500 shadow-[0_0_8px_rgba(0,255,135,0.5)]" style={{ width: `${homePct}%` }} />}
                                {drawPct > 0 && <div className="bg-white/40 transition-all duration-500" style={{ width: `${drawPct}%` }} />}
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
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
