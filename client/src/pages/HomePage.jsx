import { useState, useEffect, useCallback, useRef } from 'react';
import Navbar from '../components/Navbar';
import WinnerBanner from '../components/WinnerBanner';
import MatchCard from '../components/MatchCard';
import MatchDetailModal from '../components/MatchDetailModal';
import ProfileModal from '../components/ProfileModal';
import Leaderboard from '../components/Leaderboard';
import HeroLanding from '../components/HeroLanding';
import BottomNav from '../components/BottomNav';
import api from '../api/axios';
import confetti from 'canvas-confetti';
import Icon from '../components/Icon';
import Footer from '../components/Footer';
import { motion, AnimatePresence } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 24 } }
};
export default function HomePage() {
  const [view, setView] = useState('global');
  const [statusFilter, setStatusFilter] = useState('upcoming');
  const [predictionFilter, setPredictionFilter] = useState('all');
  const [teamFilter, setTeamFilter] = useState('All');
  const [dateSort, setDateSort] = useState('earliest');
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  
  const [currentTime, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now());
    }, 10000); 
    return () => clearInterval(timer);
  }, []);
  
  const scrollContainerRef = useRef(null);

  const [matches, setMatches] = useState([]);
  const [myPredictions, setMyPredictions] = useState([]);
  const [globalPredictions, setGlobalPredictions] = useState([]);

  const [loadingMatches, setLoadingMatches] = useState(true);
  const [loadingPredictions, setLoadingPredictions] = useState(true);
  const [error, setError] = useState('');

  const fetchMatches = useCallback(async () => {
    try {
      const res = await api.get('/matches');
      setMatches(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load matches');
    } finally {
      setLoadingMatches(false);
    }
  }, []);

  const fetchGlobalPredictions = useCallback(async () => {
    try {
      const res = await api.get('/predictions/global');
      setGlobalPredictions(res.data);
    } catch (err) {
      console.error('Failed to load global predictions:', err.message);
    }
  }, []);

  const fetchMyPredictions = useCallback(async () => {
    try {
      const res = await api.get('/predictions/my');
      setMyPredictions(res.data);
    } catch (err) {
      console.error('Failed to load my predictions:', err.message);
    } finally {
      setLoadingPredictions(false);
    }
  }, []);

  useEffect(() => {
    fetchMatches();
    fetchGlobalPredictions();
    fetchMyPredictions();

    const intervalId = setInterval(() => {
      fetchMatches();
    }, 15000);

    return () => clearInterval(intervalId);
  }, [fetchMatches, fetchGlobalPredictions, fetchMyPredictions]);

  const [notification, setNotification] = useState(null);

  useEffect(() => {
    if (!myPredictions.length || !matches.length) return;

    const notifiedStr = localStorage.getItem('notified_predictions') || '[]';
    let notifiedIds = [];
    try { notifiedIds = JSON.parse(notifiedStr); } catch(e) {}

    const correctPred = myPredictions.find(p => {
      const matchId = p.match?._id || p.match;
      const match = matches.find(m => m._id === matchId);
      if (match && match.status === 'completed' && match.homeScore === p.homeGoals && match.awayScore === p.awayGoals) {
        return !notifiedIds.includes(p._id);
      }
      return false;
    });

    if (correctPred) {
      const match = matches.find(m => m._id === (correctPred.match?._id || correctPred.match));
      setNotification({
        predId: correctPred._id,
        homeTeam: match?.homeTeam || 'Home',
        awayTeam: match?.awayTeam || 'Away',
        score: `${correctPred.homeGoals} - ${correctPred.awayGoals}`
      });
      notifiedIds.push(correctPred._id);
      localStorage.setItem('notified_predictions', JSON.stringify(notifiedIds));
      
      confetti({
        particleCount: 200,
        spread: 100,
        origin: { y: 0.3 },
        colors: ['#00ff87', '#ffd700', '#ff3d00']
      });
      
      setTimeout(() => setNotification(null), 6000);
    }
  }, [myPredictions, matches]);

  const handlePredicted = useCallback(() => {
    fetchMatches();
    fetchMyPredictions();
    fetchGlobalPredictions();
  }, [fetchMatches, fetchMyPredictions, fetchGlobalPredictions]);

  const getMyPrediction = (matchId) => {
    const found = myPredictions.find(
      (p) => p.match?._id === matchId || p.match === matchId
    );
    return found || null;
  };

  const getGlobalPredsForMatch = (matchId) => {
    return globalPredictions.filter(
      (p) => p.match?._id === matchId || p.match === matchId
    );
  };

  const isTBDName = (name) => {
    if (!name) return true;
    if (/^(TBD|Winner|Runner-up|Loser|#\d+)/i.test(name)) return true;
    if (/^\d/.test(name)) return true;
    if (name.includes('/')) return true;
    if (/^[A-Z0-9]{1,5}$/.test(name) && name !== 'USA') return true;
    return false;
  };

  const getMatchWithTimeState = (m) => {
    const kickoff = new Date(m.kickoffTime).getTime();
    const fiveHoursMs = 5 * 60 * 60 * 1000;
    const windowOpen = kickoff - fiveHoursMs;
    let timeState = 'locked';
    if (currentTime < windowOpen) timeState = 'early';
    else if (currentTime >= windowOpen && currentTime < kickoff) timeState = 'open';
    return { ...m, timeState };
  };

  const getFilteredMatches = () => {
    let filtered = matches.map(getMatchWithTimeState);

    if (view === 'my') {
      filtered = filtered.filter((m) => {
        const pred = getMyPrediction(m._id);
        if (!pred) return false;
        if (predictionFilter === 'correct') {
          return pred.points > 0;
        }
        return true;
      });
    } else {
      if (statusFilter === 'completed') {
        filtered = filtered.filter((m) => m.status === 'completed');
      } else {
        filtered = filtered.filter((m) => m.status !== 'completed');
      }
    }
    if (teamFilter !== 'All') {
      filtered = filtered.filter(m => m.homeTeam === teamFilter || m.awayTeam === teamFilter);
    }

    filtered.sort((a, b) => {
      const dateA = new Date(a.kickoffTime).getTime();
      const dateB = new Date(b.kickoffTime).getTime();
      return dateSort === 'earliest' ? dateA - dateB : dateB - dateA;
    });

    return filtered;
  };

  const uniqueTeams = Array.from(
    new Set(matches.flatMap(m => [m.homeTeam, m.awayTeam]).filter(t => !isTBDName(t)))
  ).sort();

  const isLoading = loadingMatches || loadingPredictions;

  const handleWheelScroll = (e) => {
    if (e.deltaY !== 0) {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollLeft += e.deltaY;
      }
    }
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -(window.innerWidth > 512 ? 512 : window.innerWidth), behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: window.innerWidth > 512 ? 512 : window.innerWidth, behavior: 'smooth' });
    }
  };

  const getChunkSize = () => {
    if (typeof window === 'undefined') return 4;
    if (window.innerWidth >= 1024) return 8; // lg
    if (window.innerWidth >= 768) return 6; // md
    return 4; // sm/mobile
  };

  const [chunkSize, setChunkSize] = useState(getChunkSize());

  useEffect(() => {
    const handleResize = () => setChunkSize(getChunkSize());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const chunkMatches = (matchesArray, size) => {
    const chunks = [];
    for (let i = 0; i < matchesArray.length; i += size) {
      chunks.push(matchesArray.slice(i, i + size));
    }
    return chunks;
  };

  const filteredMatches = getFilteredMatches();
  const matchPages = chunkMatches(filteredMatches, chunkSize);

  return (
    <div className="min-h-screen flex flex-col bg-transparent text-white relative">
      <Navbar 
        view={view} 
        setView={setView} 
        statusFilter={statusFilter} 
        setStatusFilter={setStatusFilter} 
        onProfileClick={() => setProfileOpen(true)}
      />

      <main className="flex-1 pt-4 pb-12 max-w-[1600px] mx-auto w-full flex flex-col px-4 md:px-8 mt-20 relative z-10">

        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mb-4 p-4 font-display text-sm font-bold uppercase tracking-widest bg-error/20 text-error-container rounded-xl border border-error/50 shadow-lg backdrop-blur-md">
              {error}
            </motion.div>
          )}

          {notification && (
            <motion.div initial={{ opacity: 0, y: 50, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 50, scale: 0.9 }} className="fixed top-28 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-sm">
              <div className="relative overflow-hidden p-6 text-center bg-black/60 backdrop-blur-2xl border border-white/20 border-l-4 border-l-primary shadow-2xl rounded-2xl">
                <button onClick={() => setNotification(null)} className="absolute top-3 right-4 font-bold text-lg text-primary hover:text-white transition-colors">
                  <Icon name="close" />
                </button>
                <h3 className="font-display text-2xl font-black uppercase tracking-widest text-primary mb-2 mt-1 drop-shadow-md">SPOT ON!</h3>
                <p className="font-display text-xs uppercase tracking-widest text-outline-variant mb-4 font-bold">You perfectly predicted:</p>
                <div className="p-4 bg-white/10 rounded-xl border border-white/20 text-white text-center shadow-inner backdrop-blur-md">
                  <div className="font-display font-bold text-xl mb-2">{notification.homeTeam} <span className="text-outline-variant mx-1 italic text-base font-body">VS</span> {notification.awayTeam}</div>
                  <div className="text-4xl font-display tracking-widest text-primary font-black drop-shadow-md">{notification.score}</div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {view === 'leaderboard' ? (
          <Leaderboard predictions={globalPredictions} />
        ) : (
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="flex-1 flex flex-col">
            {view === 'global' && !isLoading && (
              <motion.div variants={itemVariants}>
                <HeroLanding />
              </motion.div>
            )}

            {!isLoading && matches.length > 0 && (
              <motion.div variants={itemVariants} className="mb-10">
                <WinnerBanner matches={matches} predictions={globalPredictions} currentTime={currentTime} onClick={setSelectedMatch} />
              </motion.div>
            )}

            {isLoading && (
              <div className="flex flex-col items-center justify-center py-32">
                <div className="relative w-16 h-16 mb-6">
                  <div className="absolute inset-0 border-4 border-white/10 border-t-primary animate-spin rounded-full shadow-neon-primary"></div>
                </div>
                <div className="font-display text-lg uppercase tracking-widest animate-pulse text-outline-variant font-bold">
                  Loading the Arena...
                </div>
              </div>
            )}

            {!isLoading && matches.length === 0 && (
              <motion.div variants={itemVariants} className="text-center py-20 font-display uppercase tracking-widest text-outline-variant bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl">
                <div className="text-6xl mb-6 font-display text-white/20 font-black">0</div>
                <p className="font-display text-3xl font-black tracking-widest mb-3 uppercase text-white">No Matches</p>
                <p className="font-display text-sm mb-6 font-bold">Run the seed script to add matches.</p>
                <code className="mt-3 block font-body text-sm px-5 py-3 mx-auto max-w-xs bg-black/50 border border-white/20 text-white rounded-xl shadow-inner">
                  cd server &amp;&amp; npm run seed
                </code>
              </motion.div>
            )}

            {!isLoading && matches.length > 0 && (
              <motion.div variants={itemVariants} className="flex flex-col">
                <div className="mb-5 md:mb-8 flex flex-col md:flex-row items-center justify-between gap-3 p-3.5 sm:p-5 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl">
                  <div className="flex items-center gap-2 sm:gap-3 w-full md:w-auto">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary border border-primary/30">
                      <Icon name="sensors" className="text-[16px] sm:text-[20px]" />
                    </div>
                    <span className="font-display text-xs sm:text-base uppercase tracking-widest text-white font-bold">
                      {view === 'global' ? 'Global Match Feed' : 'Your Predictions'} <span className="text-primary ml-2">({filteredMatches.length})</span>
                    </span>
                  </div>

                  <div className="flex flex-row items-center gap-2 w-full md:w-auto">
                    <div className="flex items-center gap-1 border border-white/10 rounded-xl overflow-hidden bg-black/40 p-1 backdrop-blur-md w-full md:w-auto">
                      {view === 'my' ? (
                        <>
                          <button
                            onClick={() => {
                              setPredictionFilter('all');
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className={`relative flex-1 md:flex-none px-4 py-2.5 font-display text-[10px] sm:text-xs uppercase tracking-widest transition-all duration-300 rounded-lg font-bold z-10 ${
                              predictionFilter === 'all' ? 'text-black' : 'text-outline-variant hover:text-white'
                            }`}
                          >
                            {predictionFilter === 'all' && <motion.div layoutId="filter-tab" className="absolute inset-0 bg-primary rounded-lg -z-10 shadow-neon-primary" transition={{ type: "spring", bounce: 0.2, duration: 0.6 }} />}
                            All
                          </button>
                          <button
                            onClick={() => {
                              setPredictionFilter('correct');
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className={`relative flex-1 md:flex-none px-4 py-2.5 font-display text-[10px] sm:text-xs uppercase tracking-widest transition-all duration-300 rounded-lg font-bold z-10 ${
                              predictionFilter === 'correct' ? 'text-black' : 'text-outline-variant hover:text-white'
                            }`}
                          >
                            {predictionFilter === 'correct' && <motion.div layoutId="filter-tab" className="absolute inset-0 bg-primary rounded-lg -z-10 shadow-neon-primary" transition={{ type: "spring", bounce: 0.2, duration: 0.6 }} />}
                            Correct
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => {
                              setStatusFilter('upcoming');
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className={`relative flex-1 md:flex-none px-4 py-2.5 font-display text-[10px] sm:text-xs uppercase tracking-widest transition-all duration-300 rounded-lg font-bold z-10 ${
                              statusFilter === 'upcoming' ? 'text-black' : 'text-outline-variant hover:text-white'
                            }`}
                          >
                            {statusFilter === 'upcoming' && <motion.div layoutId="filter-tab" className="absolute inset-0 bg-primary rounded-lg -z-10 shadow-neon-primary" transition={{ type: "spring", bounce: 0.2, duration: 0.6 }} />}
                            Open
                          </button>
                          <button
                            onClick={() => {
                              setStatusFilter('completed');
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className={`relative flex-1 md:flex-none px-4 py-2.5 font-display text-[10px] sm:text-xs uppercase tracking-widest transition-all duration-300 rounded-lg font-bold z-10 ${
                              statusFilter === 'completed' ? 'text-black' : 'text-outline-variant hover:text-white'
                            }`}
                          >
                            {statusFilter === 'completed' && <motion.div layoutId="filter-tab" className="absolute inset-0 bg-primary rounded-lg -z-10 shadow-neon-primary" transition={{ type: "spring", bounce: 0.2, duration: 0.6 }} />}
                            Results
                          </button>
                        </>
                      )}
                    </div>

                    <div className="relative flex-1 sm:w-48">
                      <select
                        value={teamFilter}
                        onChange={(e) => {
                          setTeamFilter(e.target.value);
                          if (scrollContainerRef.current) scrollContainerRef.current.scrollLeft = 0;
                        }}
                        className="w-full font-display text-[10px] sm:text-xs font-bold uppercase tracking-widest px-3 py-2.5 sm:px-4 sm:py-3.5 outline-none appearance-none cursor-pointer bg-black/40 border border-white/10 text-white rounded-xl transition-colors hover:border-primary focus:border-primary shadow-inner backdrop-blur-md"
                      >
                        <option value="All">All Teams</option>
                        {uniqueTeams.map(t => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                      <Icon name="expand_more" className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 pointer-events-none text-outline-variant text-[16px] sm:text-[20px]" />
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setDateSort(prev => prev === 'earliest' ? 'latest' : 'earliest');
                        if (scrollContainerRef.current) scrollContainerRef.current.scrollLeft = 0;
                      }}
                      className="flex-shrink-0 font-display text-[10px] sm:text-xs font-bold uppercase tracking-widest px-4 py-2.5 sm:px-5 sm:py-3.5 flex items-center justify-center gap-1.5 cursor-pointer bg-black/40 border border-white/10 text-white rounded-xl hover:border-primary hover:text-primary shadow-inner backdrop-blur-md transition-colors"
                    >
                      Date <Icon name={dateSort === 'earliest' ? 'arrow_downward' : 'arrow_upward'} className="text-[16px] sm:text-[18px] text-primary" />
                    </motion.button>
                  </div>
                </div>

                {filteredMatches.length > 0 ? (
                  <div className="relative group mt-2">
                    <motion.button
                      whileHover={{ scale: 1.1, backgroundColor: "#22c55e", color: "#000" }}
                      whileTap={{ scale: 0.9 }}
                      onClick={scrollLeft}
                      className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-5 z-20 w-14 h-14 items-center justify-center opacity-0 group-hover:opacity-100 transition-all bg-black/80 border border-white/20 text-primary rounded-full shadow-2xl backdrop-blur-xl"
                    >
                      <Icon name="chevron_left" className="text-[32px]" />
                    </motion.button>
                    <div 
                      ref={scrollContainerRef}
                      className="flex flex-col md:flex-row md:overflow-x-auto md:snap-x md:snap-mandatory scrollbar-none pb-8 pt-2 gap-4 md:gap-0"
                      onWheel={handleWheelScroll}
                    >
                      {matchPages.map((pageMatches, pageIndex) => (
                        <div key={pageIndex} className="w-full md:min-w-full flex-shrink-0 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 px-1 md:snap-start">
                          {pageMatches.map((match) => (
                            <MatchCard
                              key={match._id}
                              match={match}
                              prediction={getMyPrediction(match._id)}
                              onClick={setSelectedMatch}
                            />
                          ))}
                        </div>
                      ))}
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1, backgroundColor: "#22c55e", color: "#000" }}
                      whileTap={{ scale: 0.9 }}
                      onClick={scrollRight}
                      className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-5 z-20 w-14 h-14 items-center justify-center opacity-0 group-hover:opacity-100 transition-all bg-black/80 border border-white/20 text-primary rounded-full shadow-2xl backdrop-blur-xl"
                    >
                      <Icon name="chevron_right" className="text-[32px]" />
                    </motion.button>
                  </div>
                ) : (
                  <motion.div variants={itemVariants} className="text-center py-24 font-display text-sm font-bold uppercase tracking-widest bg-white/5 backdrop-blur-md border border-dashed border-white/20 rounded-2xl text-outline-variant shadow-inner">
                    {view === 'my' ? 'No predictions made yet. Time to enter the arena.' : 'No matches available in this filter.'}
                  </motion.div>
                )}
              </motion.div>
            )}
          </motion.div>
        )}
      </main>

      <Footer setView={setView} />

      <MatchDetailModal 
        isOpenModal={!!selectedMatch}
        onClose={() => setSelectedMatch(null)}
        match={selectedMatch}
        prediction={selectedMatch ? getMyPrediction(selectedMatch._id) : null}
        onPredicted={handlePredicted}
        globalMode={view === 'global'}
        globalPreds={selectedMatch ? getGlobalPredsForMatch(selectedMatch._id) : []}
      />

      <ProfileModal 
        isOpen={profileOpen}
        onClose={() => setProfileOpen(false)}
      />

      <BottomNav 
        view={view} 
        setView={setView} 
        statusFilter={statusFilter} 
        setStatusFilter={setStatusFilter} 
      />
    </div>
  );
}
