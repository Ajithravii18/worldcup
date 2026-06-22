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
  const [view, setView] = useState('global');
  const [statusFilter, setStatusFilter] = useState('upcoming');
  const [teamFilter, setTeamFilter] = useState('All');
  const [dateSort, setDateSort] = useState('earliest');
  const [selectedMatch, setSelectedMatch] = useState(null);
  
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
        colors: ['#2e7d32', '#0020b2', '#ff5a00']
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
    <div className="min-h-screen flex flex-col bg-background text-on-background">
      <Navbar 
        view={view} 
        setView={setView} 
        statusFilter={statusFilter} 
        setStatusFilter={setStatusFilter} 
      />

      <main className="flex-1 pt-4 pb-36 max-w-container-max mx-auto w-full flex flex-col px-margin-mobile md:px-margin-desktop mt-16">

        {/* Error state */}
        {error && (
          <div className="mb-4 p-3 font-label-md text-label-md uppercase tracking-widest bg-error-container text-error rounded-lg border border-error">
            {error}
          </div>
        )}

        {/* Correct Prediction Toast */}
        {notification && (
          <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 animate-slide-up w-[90%] max-w-sm">
            <div className="relative overflow-hidden p-6 text-center stadium-card border-l-4 border-l-secondary bg-surface-container-lowest">
              <button onClick={() => setNotification(null)} className="absolute top-3 right-4 font-bold text-lg text-secondary">
                <span className="material-symbols-outlined">close</span>
              </button>
              <h3 className="font-headline-md text-headline-md font-bold uppercase tracking-widest text-secondary mb-2 mt-1">SPOT ON!</h3>
              <p className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant mb-4">You perfectly predicted:</p>
              <div className="p-4 bg-surface rounded-lg border border-outline-variant text-on-surface text-center">
                <div className="font-headline-md font-bold text-sm mb-2">{notification.homeTeam} <span className="text-on-surface-variant mx-1 italic text-xs font-body-md">VS</span> {notification.awayTeam}</div>
                <div className="text-3xl font-display-lg tracking-tighter text-secondary">{notification.score}</div>
              </div>
            </div>
          </div>
        )}

        {/* View Selection Logic */}
        {view === 'leaderboard' ? (
          <Leaderboard predictions={globalPredictions} />
        ) : (
          <div className="flex-1 flex flex-col">
            {/* Hero Landing Animation */}
            {view === 'global' && !isLoading && (
              <HeroLanding />
            )}

            {/* Winner Banner */}
            {!isLoading && matches.length > 0 && (
              <div className="mb-8">
                <WinnerBanner matches={matches} predictions={globalPredictions} currentTime={currentTime} onClick={setSelectedMatch} />
              </div>
            )}

            {/* Loading */}
            {isLoading && (
              <div className="flex flex-col items-center justify-center py-24">
                <div className="relative w-12 h-12">
                  <div className="absolute inset-0 border-4 border-surface-container-high border-t-[#ff5a00] animate-spin rounded-full"></div>
                </div>
                <div className="mt-5 font-label-md text-label-md uppercase tracking-widest animate-pulse text-on-surface-variant">
                  Loading Matches...
                </div>
              </div>
            )}

            {/* Empty state */}
            {!isLoading && matches.length === 0 && (
              <div className="text-center py-16 font-label-md uppercase tracking-widest text-on-surface-variant">
                <div className="text-5xl mb-4 font-display-lg text-outline-variant">0</div>
                <p className="font-headline-lg text-xl tracking-wide mb-2 uppercase text-on-surface">No Matches</p>
                <p className="font-label-sm text-label-sm mb-4">Run the seed script to add matches.</p>
                <code className="mt-3 block font-body-md text-sm px-4 py-2 mx-auto max-w-xs bg-surface-container border border-outline-variant text-on-surface rounded">
                  cd server &amp;&amp; npm run seed
                </code>
              </div>
            )}

            {!isLoading && matches.length > 0 && (
              <div className="flex flex-col">
                {/* Filter and Sort Row */}
                <div className="mb-4 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 animate-fade-in bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm">
                  <span className="font-label-md text-label-sm uppercase tracking-widest w-full sm:w-auto text-center sm:text-left text-on-surface-variant">
                    {view === 'global' ? 'Community' : 'Your Predictions'} — {filteredMatches.length} matches
                  </span>

                  <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                    {/* Desktop filter pills */}
                    <div className="hidden md:flex items-center gap-0 border border-outline-variant rounded-md overflow-hidden bg-surface">
                      <button
                        onClick={() => setStatusFilter('upcoming')}
                        className={`px-4 py-2 font-label-sm text-[10px] uppercase tracking-widest transition-colors duration-150 ${
                          statusFilter === 'upcoming'
                            ? 'text-on-primary bg-primary'
                            : 'text-on-surface-variant bg-transparent hover:text-primary hover:bg-surface-container-high'
                        }`}
                      >
                        Open
                      </button>
                      <button
                        onClick={() => setStatusFilter('completed')}
                        className={`px-4 py-2 font-label-sm text-[10px] uppercase tracking-widest transition-colors duration-150 border-l border-outline-variant ${
                          statusFilter === 'completed'
                            ? 'text-on-primary bg-primary'
                            : 'text-on-surface-variant bg-transparent hover:text-primary hover:bg-surface-container-high'
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
                        className="w-full font-label-sm text-[10px] uppercase tracking-widest px-4 py-2.5 outline-none appearance-none cursor-pointer bg-surface border border-outline-variant text-on-surface rounded-md transition-colors hover:bg-surface-container focus:border-primary"
                      >
                        <option value="All">All Teams</option>
                        {uniqueTeams.map(t => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[10px] text-on-surface-variant material-symbols-outlined">expand_more</span>
                    </div>

                    <button
                      onClick={() => {
                        setDateSort(prev => prev === 'earliest' ? 'latest' : 'earliest');
                        if (scrollContainerRef.current) scrollContainerRef.current.scrollLeft = 0;
                      }}
                      className="flex-1 sm:flex-none font-label-sm text-[10px] uppercase tracking-widest px-4 py-2.5 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer bg-surface border border-outline-variant text-on-surface rounded-md hover:bg-surface-container hover:text-primary"
                    >
                      Date <span className="material-symbols-outlined text-[14px] text-primary">{dateSort === 'earliest' ? 'arrow_upward' : 'arrow_downward'}</span>
                    </button>
                  </div>
                </div>

                {filteredMatches.length > 0 ? (
                  <div className="relative group mt-2">
                    <button
                      onClick={scrollLeft}
                      className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 z-10 w-10 h-10 items-center justify-center opacity-0 group-hover:opacity-100 transition-all active:scale-95 bg-surface-container-lowest border border-outline-variant text-primary rounded-full hover:bg-surface-container-low shadow-sm"
                    >
                      <span className="material-symbols-outlined">chevron_left</span>
                    </button>
                    <div 
                      ref={scrollContainerRef}
                      className="flex overflow-x-auto snap-x snap-mandatory scrollbar-none pb-2"
                      onWheel={handleWheelScroll}
                    >
                      {matchPages.map((pageMatches, pageIndex) => (
                        <div key={pageIndex} className="min-w-full flex-shrink-0 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 grid-rows-2 auto-rows-max gap-4 px-1 snap-start">
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
                      className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 z-10 w-10 h-10 items-center justify-center opacity-0 group-hover:opacity-100 transition-all active:scale-95 bg-surface-container-lowest border border-outline-variant text-primary rounded-full hover:bg-surface-container-low shadow-sm"
                    >
                      <span className="material-symbols-outlined">chevron_right</span>
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-16 font-label-sm text-[10px] animate-fade-in uppercase tracking-widest bg-surface border border-dashed border-outline-variant text-on-surface-variant rounded-xl">
                    {view === 'my' ? 'No predictions made yet.' : 'No matches open in this section.'}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
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
