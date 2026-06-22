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
        colors: ['#001278', '#1b6d24', '#ff5a00']
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
      className={`fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-300 px-4 ${
        animate ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div
        className={`w-full max-w-lg rounded-t-[1.5rem] sm:rounded-xl p-6 relative overflow-hidden transition-all duration-300 bg-surface-container-lowest subtle-card-shadow border-t border-outline-variant ${
          animate ? 'translate-y-0 sm:scale-100' : 'translate-y-full sm:translate-y-0 sm:scale-95'
        }`}
      >
        <div className="sm:hidden w-12 h-1 bg-outline-variant rounded-full mx-auto mb-5" />

        <button
          onClick={handleClose}
          className="absolute right-5 top-5 w-8 h-8 rounded border border-outline-variant bg-surface hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors text-sm font-bold"
        >
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>

        <div className="flex flex-col items-center mb-6 mt-2">
          <span className="font-label-sm text-[10px] text-primary uppercase tracking-widest bg-primary-fixed px-3 py-1 rounded-full border border-primary-fixed-dim mb-2">
            {match.group}
          </span>
          <span className="font-label-sm text-[10px] text-on-surface-variant tracking-widest">{match.venue}</span>
        </div>

        {/* ===== COMPLETED MATCH ===== */}
        {match.status === 'completed' && (
          <div className="px-2 pb-4">
            <div className="flex items-center justify-center gap-2 sm:gap-4 py-3">
              <div className="flex-1 text-center flex flex-col items-center max-w-[90px]">
                <div className="w-16 h-16 rounded-full bg-surface-container border border-outline-variant flex items-center justify-center overflow-hidden shadow-sm mb-2">
                  <TeamFlag teamName={match.homeTeam} fallbackEmoji={match.homeFlag} className="w-10 h-10 object-contain" />
                </div>
                <div className="font-headline-md text-sm text-on-surface font-bold tracking-wide truncate w-full">{match.homeTeam}</div>
              </div>
              <div className="px-2 text-center flex-shrink-0">
                <div className="font-display-lg text-4xl text-on-surface px-4 py-2 rounded bg-surface border border-outline-variant shadow-sm whitespace-nowrap tracking-tighter">
                  {match.homeScore} – {match.awayScore}
                </div>
                {match.winner && (
                  <div className="mt-3 font-label-sm text-[10px] font-bold text-primary tracking-widest uppercase">
                    {match.winner === 'Draw' ? 'DRAW' : `WINNER: ${match.winner}`}
                  </div>
                )}
              </div>
              <div className="flex-1 text-center flex flex-col items-center max-w-[90px]">
                <div className="w-16 h-16 rounded-full bg-surface-container border border-outline-variant flex items-center justify-center overflow-hidden shadow-sm mb-2">
                  <TeamFlag teamName={match.awayTeam} fallbackEmoji={match.awayFlag} className="w-10 h-10 object-contain" />
                </div>
                <div className="font-headline-md text-sm text-on-surface font-bold tracking-wide truncate w-full">{match.awayTeam}</div>
              </div>
            </div>
            
            {/* Global predictions for completed matches */}
            {globalPreds.length > 0 && (
              <div className="mt-6 border-t border-outline-variant pt-4">
                <div className="font-label-md text-[10px] text-on-surface-variant uppercase tracking-widest mb-3 font-bold text-center">
                  COMMUNITY PREDICTIONS
                </div>

                <div className="mb-4 px-2">
                  <div className="flex items-center justify-between text-[9px] font-bold text-on-surface-variant font-label-sm uppercase tracking-widest mb-1.5">
                    <span className="text-secondary">{match.homeTeam} {homePct}%</span>
                    <span className="text-outline">DRAW {drawPct}%</span>
                    <span className="text-[#ff5a00]">{match.awayTeam} {awayPct}%</span>
                  </div>
                  <div className="h-2 w-full flex rounded overflow-hidden bg-surface-container border border-outline-variant">
                    {homePct > 0 && <div className="bg-secondary transition-all duration-500" style={{ width: `${homePct}%` }} />}
                    {drawPct > 0 && <div className="bg-outline transition-all duration-500" style={{ width: `${drawPct}%` }} />}
                    {awayPct > 0 && <div className="bg-[#ff5a00] transition-all duration-500" style={{ width: `${awayPct}%` }} />}
                  </div>
                </div>
                <div className="max-h-48 overflow-y-auto space-y-2 pr-1 scrollbar-none">
                  {globalPreds.map((pred) => (
                    <div key={pred._id} className="flex items-center justify-between bg-surface border border-outline-variant rounded-lg px-4 py-3 shadow-sm">
                      <div className="flex items-center gap-3">
                        <UserAvatar avatarId={pred.user?.avatar} className="w-8 h-8 flex-shrink-0 text-xs border border-outline-variant rounded-full object-cover" />
                        <span className="text-sm text-on-surface font-headline-md font-bold truncate max-w-[150px]">
                          {pred.user?.name || 'Unknown'}
                        </span>
                      </div>
                      <div className="font-display-lg text-xl tracking-tighter text-on-surface bg-surface-container-lowest px-3 py-1 rounded border border-outline-variant">
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
                  <span className="inline-block w-2.5 h-2.5 rounded-full bg-secondary shadow-[0_0_6px_rgba(27,109,36,0.6)] animate-pulse" />
                  <span className="font-label-sm text-[10px] text-secondary uppercase tracking-widest font-bold">
                    PREDICTION OPEN · {timeUntilKickoff()}
                  </span>
                </div>

                <div className="flex items-start justify-between gap-3 py-4 bg-surface-container-lowest rounded-xl border border-outline-variant mb-6 shadow-[0_4px_12px_rgba(0,18,120,0.02)] relative overflow-hidden px-4">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-20"></div>
                  
                  <GoalSelector
                    teamName={match.homeTeam}
                    teamFlag={match.homeFlag}
                    goals={homeGoals}
                    onIncrease={() => increaseGoal('home')}
                    onDecrease={() => decreaseGoal('home')}
                    disabled={false}
                    side="left"
                  />

                  <div className="flex flex-col items-center justify-center gap-1 pt-12 px-4">
                    <div className="font-headline-md text-xl text-outline-variant font-light italic">VS</div>
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
                  <div className="text-error text-xs text-center mb-3 px-2 font-label-sm font-bold uppercase tracking-widest bg-error-container py-2 rounded-lg border border-error">
                    ⚠️ {submitError}
                  </div>
                )}
                {submitSuccess && (
                  <div className="text-secondary text-xs text-center mb-3 font-label-sm font-bold animate-fade-in uppercase tracking-widest bg-[#e6f4ea] py-2 rounded-lg border border-[#a3f69c]">
                    PREDICTION SAVED
                  </div>
                )}

                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="w-full py-4 bg-primary text-on-primary font-label-md text-label-md uppercase tracking-wider rounded-lg shadow-md hover:bg-on-primary-fixed-variant active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  {submitting ? 'SAVING...' : 'SUBMIT PREDICTION'}
                  {!submitting && <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>}
                </button>

                <MatchComments matchId={match._id} />
              </>
            ) : globalMode ? (
              // Global Mode / Viewing others
              <>
                {prediction && (
                  <div className="mb-6 bg-surface-container-low border border-outline-variant rounded-xl p-4 flex flex-col justify-center items-center shadow-sm">
                    <span className="font-label-sm text-[10px] text-secondary uppercase tracking-[0.2em] font-bold mb-2 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">lock</span> YOUR LOCKED PREDICTION
                    </span>
                    <div className="flex items-center gap-4">
                       <span className="text-on-surface font-display-lg tracking-tighter text-4xl font-bold bg-surface-container-lowest px-4 py-2 rounded border border-outline-variant">{prediction.homeGoals} – {prediction.awayGoals}</span>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-center gap-2 sm:gap-4 py-4">
                  <div className="flex-1 text-center flex flex-col items-center max-w-[90px]">
                    <div className="w-16 h-16 rounded-full bg-surface-container border border-outline-variant flex items-center justify-center overflow-hidden shadow-sm mb-2">
                      <TeamFlag teamName={match.homeTeam} fallbackEmoji={match.homeFlag} className="w-10 h-10 object-contain" />
                    </div>
                    <div className="font-headline-md text-sm text-on-surface font-bold tracking-wide uppercase truncate w-full">{match.homeTeam}</div>
                  </div>
                  <div className="px-2 text-center flex-shrink-0">
                    <div className="font-headline-md text-2xl text-outline-variant italic font-light">VS</div>
                    {isOpen && (
                      <div className="font-label-sm text-[10px] font-bold text-on-surface-variant mt-2 tracking-widest">{timeUntilKickoff()} LEFT</div>
                    )}
                  </div>
                  <div className="flex-1 text-center flex flex-col items-center max-w-[90px]">
                    <div className="w-16 h-16 rounded-full bg-surface-container border border-outline-variant flex items-center justify-center overflow-hidden shadow-sm mb-2">
                      <TeamFlag teamName={match.awayTeam} fallbackEmoji={match.awayFlag} className="w-10 h-10 object-contain" />
                    </div>
                    <div className="font-headline-md text-sm text-on-surface font-bold tracking-wide uppercase truncate w-full">{match.awayTeam}</div>
                  </div>
                </div>

                {globalPreds.length > 0 ? (
                  <div className="mt-4 border-t border-outline-variant pt-4">
                    <div className="font-label-md text-[10px] text-on-surface-variant uppercase tracking-widest mb-3 font-bold text-center">
                      COMMUNITY PREDICTIONS ({globalPreds.length})
                    </div>

                    <div className="mb-4 px-2">
                      <div className="flex items-center justify-between text-[9px] font-bold text-on-surface-variant font-label-sm uppercase tracking-widest mb-1.5">
                        <span className="text-secondary">{match.homeTeam} {homePct}%</span>
                        <span className="text-outline">DRAW {drawPct}%</span>
                        <span className="text-[#ff5a00]">{match.awayTeam} {awayPct}%</span>
                      </div>
                      <div className="h-2 w-full flex rounded overflow-hidden bg-surface-container border border-outline-variant">
                        {homePct > 0 && <div className="bg-secondary transition-all duration-500" style={{ width: `${homePct}%` }} />}
                        {drawPct > 0 && <div className="bg-outline transition-all duration-500" style={{ width: `${drawPct}%` }} />}
                        {awayPct > 0 && <div className="bg-[#ff5a00] transition-all duration-500" style={{ width: `${awayPct}%` }} />}
                      </div>
                    </div>
                    <div className="max-h-48 overflow-y-auto space-y-2 pr-1 scrollbar-none">
                      {globalPreds.map((pred) => (
                        <div key={pred._id} className="flex items-center justify-between bg-surface border border-outline-variant rounded-lg px-4 py-3 shadow-sm">
                          <div className="flex items-center gap-3">
                            <UserAvatar avatarId={pred.user?.avatar} className="w-8 h-8 flex-shrink-0 text-xs border border-outline-variant rounded-full object-cover" />
                            <span className="text-sm text-on-surface font-headline-md font-bold truncate max-w-[150px]">
                              {pred.user?.name || 'Unknown'}
                            </span>
                          </div>
                          <div className="font-display-lg tracking-tighter text-xl text-on-surface bg-surface-container-lowest px-3 py-1 rounded border border-outline-variant">
                            {pred.homeGoals} – {pred.awayGoals}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-on-surface-variant text-[10px] py-8 uppercase tracking-[0.2em] font-label-sm font-bold bg-surface border border-dashed border-outline-variant rounded mt-4">
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
                        <div className="w-16 h-16 rounded-full bg-surface-container border border-outline-variant flex items-center justify-center overflow-hidden shadow-sm mb-2">
                          <TeamFlag teamName={match.homeTeam} fallbackEmoji={match.homeFlag} className="w-10 h-10 object-contain" />
                        </div>
                        <div className="font-headline-md text-sm text-on-surface font-bold tracking-wide uppercase truncate w-full">{match.homeTeam}</div>
                      </div>
                      <div className="px-2 text-center opacity-60 flex-shrink-0">
                        <div className="font-headline-md text-2xl text-outline-variant italic font-light">VS</div>
                      </div>
                      <div className="flex-1 text-center flex flex-col items-center opacity-60 max-w-[90px]">
                        <div className="w-16 h-16 rounded-full bg-surface-container border border-outline-variant flex items-center justify-center overflow-hidden shadow-sm mb-2">
                          <TeamFlag teamName={match.awayTeam} fallbackEmoji={match.awayFlag} className="w-10 h-10 object-contain" />
                        </div>
                        <div className="font-headline-md text-sm text-on-surface font-bold tracking-wide uppercase truncate w-full">{match.awayTeam}</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-center gap-2 px-6 py-4 rounded text-xs text-on-surface-variant font-label-sm font-bold uppercase tracking-widest bg-surface border border-outline-variant text-center">
                      PREDICTIONS OPEN {timeUntilWindow()} BEFORE KICKOFF
                    </div>
                  </>
                )}

                {isOpen && prediction && (
                  <>
                    <div className="py-2 flex items-center justify-center mb-4">
                      <span className="font-label-sm text-[10px] text-primary uppercase tracking-[0.2em] bg-primary-fixed border border-primary-fixed-dim px-4 py-1.5 rounded-full font-bold">
                        PREDICTION LOCKED IN
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-4 py-4 px-2">
                      <div className="flex-1 text-center">
                        <div className="font-headline-md text-lg text-on-surface font-bold uppercase tracking-wide">{match.homeTeam}</div>
                      </div>
                      <div className="px-6 py-4 bg-surface border border-outline-variant rounded-xl shadow-sm text-center min-w-[140px]">
                        <div className="font-display-lg text-5xl tracking-tighter text-primary font-bold">
                          {prediction.homeGoals} – {prediction.awayGoals}
                        </div>
                      </div>
                      <div className="flex-1 text-center">
                        <div className="font-headline-md text-lg text-on-surface font-bold uppercase tracking-wide">{match.awayTeam}</div>
                      </div>
                    </div>
                    
                    {globalPreds.length > 0 && (
                      <div className="mt-6 border-t border-outline-variant pt-4">
                        <div className="font-label-md text-[10px] text-on-surface-variant uppercase tracking-widest mb-3 font-bold text-center">
                          COMMUNITY PREDICTIONS ({globalPreds.length})
                        </div>
                        <div className="mb-4 px-2">
                          <div className="flex items-center justify-between text-[9px] font-bold text-on-surface-variant font-label-sm uppercase tracking-widest mb-1.5">
                            <span className="text-secondary">{match.homeTeam} {homePct}%</span>
                            <span className="text-outline">DRAW {drawPct}%</span>
                            <span className="text-[#ff5a00]">{match.awayTeam} {awayPct}%</span>
                          </div>
                          <div className="h-2 w-full flex rounded overflow-hidden bg-surface-container border border-outline-variant">
                            {homePct > 0 && <div className="bg-secondary transition-all duration-500" style={{ width: `${homePct}%` }} />}
                            {drawPct > 0 && <div className="bg-outline transition-all duration-500" style={{ width: `${drawPct}%` }} />}
                            {awayPct > 0 && <div className="bg-[#ff5a00] transition-all duration-500" style={{ width: `${awayPct}%` }} />}
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {isLocked && (
                  <>
                    <div className="py-2 flex items-center justify-center mb-4">
                      <span className="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-[0.2em] bg-surface-container px-4 py-1.5 rounded-full border border-outline-variant font-bold">
                        MATCH STARTED — LOCKED
                      </span>
                    </div>
                    <div className="flex items-center justify-center gap-2 sm:gap-4 py-6">
                      <div className="flex-1 text-center flex flex-col items-center opacity-70 max-w-[90px]">
                        <div className="w-16 h-16 rounded-full bg-surface-container border border-outline-variant flex items-center justify-center overflow-hidden shadow-sm mb-2">
                          <TeamFlag teamName={match.homeTeam} fallbackEmoji={match.homeFlag} className="w-10 h-10 object-contain" />
                        </div>
                        <div className="font-headline-md text-sm text-on-surface font-bold tracking-wide uppercase truncate w-full">{match.homeTeam}</div>
                      </div>
                      
                      {match.status === 'live' ? (
                        <div className="px-2 text-center flex-shrink-0 flex flex-col items-center">
                          <div className="font-display-lg tracking-tighter text-4xl text-on-surface px-5 py-2.5 rounded border border-[#ffb5a0] bg-[#ffdbd1] flex items-center gap-2 font-bold shadow-sm">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#ff5a00] animate-pulse"></span>
                            <span>{match.homeScore ?? 0} – {match.awayScore ?? 0}</span>
                          </div>
                          <span className="font-label-sm text-[10px] font-bold uppercase tracking-widest text-[#ff5a00] mt-2 animate-pulse">
                            {match.shortStatus && match.shortStatus !== '1H' && match.shortStatus !== '2H' ? match.shortStatus : match.elapsed ? `LIVE ${match.elapsed}'` : 'LIVE NOW'}
                          </span>
                        </div>
                      ) : (
                        <div className="px-2 text-center opacity-70 flex-shrink-0">
                          <div className="font-headline-md text-2xl text-outline-variant italic font-light">VS</div>
                        </div>
                      )}

                      <div className="flex-1 text-center flex flex-col items-center opacity-70 max-w-[90px]">
                        <div className="w-16 h-16 rounded-full bg-surface-container border border-outline-variant flex items-center justify-center overflow-hidden shadow-sm mb-2">
                          <TeamFlag teamName={match.awayTeam} fallbackEmoji={match.awayFlag} className="w-10 h-10 object-contain" />
                        </div>
                        <div className="font-headline-md text-sm text-on-surface font-bold tracking-wide uppercase truncate w-full">{match.awayTeam}</div>
                      </div>
                    </div>

                    {user?.role === 'admin' && match.status === 'live' && (
                      <div className="mt-6 border-t border-outline-variant pt-4 text-center">
                        <span className="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-widest font-bold block mb-3">
                          Live Score Simulator (Admin)
                        </span>
                        <div className="flex items-center justify-center gap-6 mb-4">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-on-surface-variant">{match.homeTeam}</span>
                            <button
                              onClick={() => handleUpdateLiveScore((match.homeScore ?? 0) - 1, match.awayScore ?? 0)}
                              disabled={(match.homeScore ?? 0) <= 0}
                              className="w-8 h-8 rounded border border-outline-variant bg-surface hover:bg-surface-container flex items-center justify-center font-bold text-on-surface active:scale-95 transition-transform"
                            >
                              -
                            </button>
                            <span className="font-display-lg text-xl tracking-tighter w-6 text-on-surface">{match.homeScore ?? 0}</span>
                            <button
                              onClick={() => handleUpdateLiveScore((match.homeScore ?? 0) + 1, match.awayScore ?? 0)}
                              className="w-8 h-8 rounded border border-outline-variant bg-surface hover:bg-surface-container flex items-center justify-center font-bold text-on-surface active:scale-95 transition-transform"
                            >
                              +
                            </button>
                          </div>
                          
                          <div className="w-[1px] h-8 bg-outline-variant"></div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleUpdateLiveScore(match.homeScore ?? 0, (match.awayScore ?? 0) - 1)}
                              disabled={(match.awayScore ?? 0) <= 0}
                              className="w-8 h-8 rounded border border-outline-variant bg-surface hover:bg-surface-container flex items-center justify-center font-bold text-on-surface active:scale-95 transition-transform"
                            >
                              -
                            </button>
                            <span className="font-display-lg text-xl tracking-tighter w-6 text-on-surface">{match.awayScore ?? 0}</span>
                            <button
                              onClick={() => handleUpdateLiveScore(match.homeScore ?? 0, (match.awayScore ?? 0) + 1)}
                              className="w-8 h-8 rounded border border-outline-variant bg-surface hover:bg-surface-container flex items-center justify-center font-bold text-on-surface active:scale-95 transition-transform"
                            >
                              +
                            </button>
                            <span className="text-xs font-bold text-on-surface-variant">{match.awayTeam}</span>
                          </div>
                        </div>

                        <button
                          onClick={handleSimulateEnd}
                          className="w-full py-3 bg-[#ffdad6] text-[#93000a] border border-[#ffdad6] hover:bg-error hover:text-white rounded text-xs font-label-md uppercase tracking-widest transition-colors active:scale-95 mb-4 font-bold"
                        >
                          End Match & Finalize Results
                        </button>
                      </div>
                    )}

                    {prediction ? (
                      <div className="text-center font-label-md text-sm text-on-surface-variant py-4 rounded mt-2 bg-surface border border-outline-variant uppercase tracking-widest shadow-sm">
                        YOUR SCORE: <span className="text-primary font-bold ml-2 text-lg">{prediction.homeGoals} – {prediction.awayGoals}</span>
                      </div>
                    ) : (
                      <div className="text-center text-[10px] text-on-surface-variant font-label-sm font-bold py-4 rounded mt-2 bg-surface-container border border-outline-variant uppercase tracking-widest">
                        MISSED THIS MATCH
                      </div>
                    )}

                    {globalPreds.length > 0 && (
                      <div className="mt-6 border-t border-outline-variant pt-4">
                        <div className="font-label-md text-[10px] text-on-surface-variant uppercase tracking-widest mb-3 font-bold text-center">
                          COMMUNITY PREDICTIONS ({globalPreds.length})
                        </div>
                        <div className="mb-4 px-2">
                          <div className="flex items-center justify-between text-[9px] font-bold text-on-surface-variant font-label-sm uppercase tracking-widest mb-1.5">
                            <span className="text-secondary">{match.homeTeam} {homePct}%</span>
                            <span className="text-outline">DRAW {drawPct}%</span>
                            <span className="text-[#ff5a00]">{match.awayTeam} {awayPct}%</span>
                          </div>
                          <div className="h-2 w-full flex rounded overflow-hidden bg-surface-container border border-outline-variant">
                            {homePct > 0 && <div className="bg-secondary transition-all duration-500" style={{ width: `${homePct}%` }} />}
                            {drawPct > 0 && <div className="bg-outline transition-all duration-500" style={{ width: `${drawPct}%` }} />}
                            {awayPct > 0 && <div className="bg-[#ff5a00] transition-all duration-500" style={{ width: `${awayPct}%` }} />}
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
