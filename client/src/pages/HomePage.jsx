import { useState, useEffect, useCallback, useRef } from 'react';
import Navbar from '../components/Navbar';
import WinnerBanner from '../components/WinnerBanner';
import MatchCard from '../components/MatchCard';
import MatchDetailModal from '../components/MatchDetailModal';
import Leaderboard from '../components/Leaderboard';
import HeroLanding from '../components/HeroLanding';
import BottomNav from '../components/BottomNav';
import api from '../api/axios';
import confetti from 'canvas-confetti';

export default function HomePage() {
  // Default view: 'global' as specified
  const [view, setView] = useState('global');
  const [statusFilter, setStatusFilter] = useState('upcoming'); // 'upcoming' vs 'completed'
  const [teamFilter, setTeamFilter] = useState('All');
  const [dateSort, setDateSort] = useState('earliest'); // 'earliest' vs 'latest'
  const [selectedMatch, setSelectedMatch] = useState(null);
  
  const [currentTime, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now());
    }, 10000); // Check and tick match states every 10 seconds
    return () => clearInterval(timer);
  }, []);
  
  const scrollContainerRef = useRef(null);

  const [matches, setMatches] = useState([]);
  const [myPredictions, setMyPredictions] = useState([]);
  const [globalPredictions, setGlobalPredictions] = useState([]);

  const [loadingMatches, setLoadingMatches] = useState(true);
  const [loadingPredictions, setLoadingPredictions] = useState(true);
  const [error, setError] = useState('');

  // Fetch all matches
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

  // Fetch global predictions
  const fetchGlobalPredictions = useCallback(async () => {
    try {
      const res = await api.get('/predictions/global');
      setGlobalPredictions(res.data);
    } catch (err) {
      console.error('Failed to load global predictions:', err.message);
    }
  }, []);

  // Fetch my predictions
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

    // Auto-refresh every 15 seconds to keep matches "live"
    const intervalId = setInterval(() => {
      fetchMatches();
    }, 15000);

    return () => clearInterval(intervalId);
  }, [fetchMatches, fetchGlobalPredictions, fetchMyPredictions]);

  // Correct Prediction Notification Logic
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
        colors: ['#4be277', '#ffffff', '#ec6a06']
      });
      
      setTimeout(() => setNotification(null), 6000);
    }
  }, [myPredictions, matches]);

  // Refresh after prediction submit or match simulation
  const handlePredicted = useCallback(() => {
    fetchMatches();
    fetchMyPredictions();
    fetchGlobalPredictions();
  }, [fetchMatches, fetchMyPredictions, fetchGlobalPredictions]);

  // Helper: get my prediction for a match
  const getMyPrediction = (matchId) => {
    const found = myPredictions.find(
      (p) => p.match?._id === matchId || p.match === matchId
    );
    return found || null;
  };

  // Helper: get global predictions for a match
  const getGlobalPredsForMatch = (matchId) => {
    return globalPredictions.filter(
      (p) => p.match?._id === matchId || p.match === matchId
    );
  };

  // Helper: detect fixture codes / TBD placeholders — anything that isn't a real country name
  const isTBDName = (name) => {
    if (!name) return true;
    // Known TBD keywords
    if (/^(TBD|Winner|Runner-up|Loser|#\d+)/i.test(name)) return true;
    // Starts with a digit (e.g. "1A", "1A/3CEFHI", "2B")
    if (/^\d/.test(name)) return true;
    // Contains a slash (compound qualifier codes like "1A/3CEFHI")
    if (name.includes('/')) return true;
    // Short all-caps codes (e.g. "TBA", "W49")
    if (/^[A-Z0-9]{1,5}$/.test(name)) return true;
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

    if (statusFilter === 'completed') {
      filtered = filtered.filter((m) => m.status === 'completed');
    } else {
      filtered = filtered.filter((m) => m.status !== 'completed');
    }

    if (view === 'my') {
      // Only show matches where the user has submitted a prediction
      filtered = filtered.filter((m) => {
        const pred = getMyPrediction(m._id);
        return pred !== null;
      });
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

  // Custom wheel handler for horizontal scrolling on desktop
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

  // Group matches into pages of 4 on mobile, 6 on tablet, 8 on desktop
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
    <div className="min-h-dvh flex flex-col bg-transparent text-white">
      <Navbar 
        view={view} 
        setView={setView} 
        statusFilter={statusFilter} 
        setStatusFilter={setStatusFilter} 
      />

      {/* Page content */}
      <main className="flex-1 pt-4 pb-36 max-w-7xl mx-auto w-full flex flex-col">

        {/* Error state */}
        {error && (
          <div className="mx-4 mb-4 p-3 text-[10px] font-mono font-bold animate-fade-in uppercase tracking-widest bg-fm-red/10 border border-fm-red/20 text-fm-red rounded">
            {error}
          </div>
        )}

        {/* Correct Prediction Toast */}
        {notification && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-slide-up w-[90%] max-w-sm">
            <div className="relative overflow-hidden p-4 text-center glass-card border-l-4 border-l-fm-green">
              <button onClick={() => setNotification(null)} className="absolute top-2 right-3 font-bold text-lg text-fm-green">✕</button>
              <h3 className="font-display font-black tracking-[0.2em] uppercase text-base mb-1 mt-2 text-fm-green drop-shadow-[0_0_8px_rgba(75,226,119,0.5)]">SPOT ON!</h3>
              <p className="text-[10px] font-mono font-bold mb-3 tracking-widest uppercase text-fm-muted">You perfectly predicted:</p>
              <div className="text-sm font-display font-bold py-3 bg-black/40 rounded border border-white/5 text-white">
                {notification.homeTeam} <span className="font-mono text-white/50 italic text-xs mx-1">VS</span> {notification.awayTeam}<br/>
                <span className="text-3xl font-mono tracking-widest mt-2 inline-block font-black text-fm-green">{notification.score}</span>
              </div>
            </div>
          </div>
        )}

        {/* View Selection Logic */}
        {view === 'leaderboard' ? (
          <Leaderboard predictions={globalPredictions} />
        ) : (
          <div className="flex-1 flex flex-col mx-4 md:mx-0">
            {/* Hero Landing Animation - Only in global view */}
            {view === 'global' && !isLoading && (
              <HeroLanding />
            )}

            {/* Winner Banner — only in global/my view */}
            {!isLoading && matches.length > 0 && (
              <div className="mb-8">
                <WinnerBanner matches={matches} predictions={globalPredictions} currentTime={currentTime} onClick={setSelectedMatch} />
              </div>
            )}

            {/* Loading */}
            {isLoading && (
              <div className="flex flex-col items-center justify-center py-24">
                <div className="relative w-12 h-12">
                  <div className="absolute inset-0 border-4 border-white/10 border-t-fm-orange animate-spin rounded-full shadow-[0_0_15px_rgba(236,106,6,0.5)]"></div>
                </div>
                <div className="mt-5 text-[10px] font-mono font-black tracking-widest uppercase animate-pulse text-fm-orange">
                  Loading Matches...
                </div>
              </div>
            )}

            {/* Empty state */}
            {!isLoading && matches.length === 0 && (
              <div className="text-center py-16 font-bold uppercase tracking-widest">
                <div className="text-5xl mb-4 opacity-20 font-mono text-fm-muted">0</div>
                <p className="font-display text-xl tracking-[0.2em] mb-2 uppercase text-white drop-shadow-sm">No Matches</p>
                <p className="text-[10px] font-mono mb-4 text-fm-muted">Run the seed script to add matches.</p>
                <code className="mt-3 block text-[10px] font-mono px-4 py-2 mx-auto max-w-xs bg-black/40 border border-white/10 text-fm-orange rounded">
                  cd server &amp;&amp; npm run seed
                </code>
              </div>
            )}

            {!isLoading && matches.length > 0 && (
              <div className="flex flex-col">
                {/* Filter and Sort Row */}
                <div className="mx-4 mb-4 flex flex-col sm:flex-row items-center justify-between gap-2 p-3 animate-fade-in bg-black/40 border border-white/10 rounded backdrop-blur-md">
                  <span className="text-[10px] uppercase tracking-[0.2em] font-mono font-bold w-full sm:w-auto text-center sm:text-left text-fm-muted">
                    {view === 'global' ? 'Community' : 'Your Predictions'} — {filteredMatches.length} matches
                  </span>

                  <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
                    {/* Desktop filter pills moved here */}
                    <div className="hidden md:flex items-center gap-0 border border-white/10 rounded overflow-hidden">
                      <button
                        onClick={() => setStatusFilter('upcoming')}
                        className={`px-4 py-2 text-[10px] font-mono font-bold uppercase tracking-widest transition-colors duration-150 ${
                          statusFilter === 'upcoming'
                            ? 'text-white bg-fm-orange'
                            : 'text-fm-muted bg-transparent hover:text-white hover:bg-white/5'
                        }`}
                      >
                        Open
                      </button>
                      <button
                        onClick={() => setStatusFilter('completed')}
                        className={`px-4 py-2 text-[10px] font-mono font-bold uppercase tracking-widest transition-colors duration-150 border-l border-white/10 ${
                          statusFilter === 'completed'
                            ? 'text-white bg-fm-orange'
                            : 'text-fm-muted bg-transparent hover:text-white hover:bg-white/5'
                        }`}
                      >
                        Results
                      </button>
                    </div>

                    <div className="relative flex-1 sm:flex-none">
                      <select
                        value={teamFilter}
                        onChange={(e) => {
                          setTeamFilter(e.target.value);
                          if (scrollContainerRef.current) scrollContainerRef.current.scrollLeft = 0;
                        }}
                        className="w-full text-[10px] font-mono font-bold uppercase tracking-widest px-4 py-2.5 outline-none appearance-none cursor-pointer bg-white/5 border border-white/10 text-white rounded transition-colors hover:bg-white/10 focus:border-fm-orange"
                      >
                        <option value="All" className="bg-[#051424]">All Teams</option>
                        {uniqueTeams.map(t => (
                          <option key={t} value={t} className="bg-[#051424]">{t}</option>
                        ))}
                      </select>
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[10px] text-fm-muted">▼</span>
                    </div>

                    <button
                      onClick={() => {
                        setDateSort(prev => prev === 'earliest' ? 'latest' : 'earliest');
                        if (scrollContainerRef.current) scrollContainerRef.current.scrollLeft = 0;
                      }}
                      className="flex-1 sm:flex-none text-[10px] font-mono font-bold uppercase tracking-widest px-4 py-2.5 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer bg-white/5 border border-white/10 text-white rounded hover:bg-white/10"
                    >
                      Date <span className="text-fm-orange">{dateSort === 'earliest' ? '↑' : '↓'}</span>
                    </button>
                  </div>
                </div>

                {filteredMatches.length > 0 ? (
                  <div className="relative group">
                    <button
                      onClick={scrollLeft}
                      className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 z-10 w-10 h-10 items-center justify-center font-bold text-xl opacity-0 group-hover:opacity-100 transition-all active:scale-95 bg-black/60 border border-white/10 text-white rounded-full hover:bg-white/10 backdrop-blur-md"
                    >
                      ❮
                    </button>
                    <div 
                      ref={scrollContainerRef}
                      className="flex overflow-x-auto snap-x snap-mandatory scrollbar-none pb-2"
                      onWheel={handleWheelScroll}
                    >
                      {matchPages.map((pageMatches, pageIndex) => (
                        <div key={pageIndex} className="min-w-full flex-shrink-0 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 grid-rows-2 auto-rows-max gap-3 px-4 snap-start">
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
                    <button
                      onClick={scrollRight}
                      className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 z-10 w-10 h-10 items-center justify-center font-bold text-xl opacity-0 group-hover:opacity-100 transition-all active:scale-95 bg-black/60 border border-white/10 text-white rounded-full hover:bg-white/10 backdrop-blur-md"
                    >
                      ❯
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-16 text-[10px] mx-4 animate-fade-in uppercase tracking-widest font-mono font-bold bg-white/5 border border-dashed border-white/20 text-fm-muted rounded">
                    {view === 'my' ? 'No predictions made yet.' : 'No matches open in this section.'}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Padding removed from here, moved to main */}
      </main>

      <MatchDetailModal 
        isOpenModal={!!selectedMatch}
        onClose={() => setSelectedMatch(null)}
        match={selectedMatch}
        prediction={selectedMatch ? getMyPrediction(selectedMatch._id) : null}
        onPredicted={handlePredicted}
        globalMode={view === 'global'}
        globalPreds={selectedMatch ? getGlobalPredsForMatch(selectedMatch._id) : []}
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
