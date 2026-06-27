import { Bell, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ErrorBanner } from "../components/ErrorBanner";
import { LiveMatchCard } from "../components/LiveMatchCard";
import { LoadingSkeleton } from "../components/LoadingSkeleton";
import { MatchCard } from "../components/MatchCard";
import { NewsCard } from "../components/NewsCard";
import { SectionHeader } from "../components/SectionHeader";
import api from "../api/axios";
import { mockNews } from "../utils/mockData";
import { normalizeStatus } from "../utils/status";

export function HomePage() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await api.get('/matches');
        setMatches(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load matches');
      } finally {
        setLoading(false);
      }
    };
    fetchMatches();
    const interval = setInterval(fetchMatches, 15000);
    return () => clearInterval(interval);
  }, []);

  const liveMatches = matches.filter(m => {
    const status = normalizeStatus(m.status);
    return status === "LIVE" || status === "IN_PLAY" || status === "HALFTIME";
  });
  
  const liveMatch = liveMatches[0] || null;

  const todayMatches = matches.filter((match) => {
    const status = normalizeStatus(match.status);
    return status === "TODAY" || status === "LIVE" || status === "IN_PLAY";
  });

  return (
    <div className="space-y-7 pb-6">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-sm font-bold text-app-primary">World Cup</p>
          <h1 className="text-3xl font-black tracking-normal text-app-ink">Live Football</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Search"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-app-ink shadow-card ring-1 ring-slate-100">
            <Search size={20} />
          </button>
          <button
            type="button"
            aria-label="Notifications"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-app-primary text-white shadow-soft">
            <Bell size={20} />
          </button>
        </div>
      </header>

      {error ? <ErrorBanner message={error} /> : null}

      {liveMatch && (
        <section>
          <SectionHeader title="Live Score" />
          <LiveMatchCard match={liveMatch} />
        </section>
      )}

      <section>
        <SectionHeader title="Today's Matches" action="View all" />
        {loading ? (
          <LoadingSkeleton rows={2} />
        ) : (
          <div className="space-y-3">
            {todayMatches.length > 0 ? (
              todayMatches.map((match, index) => (
                <Link to={`/app/match/${match._id}`} key={match._id}>
                  <MatchCard match={match} compact index={index} />
                </Link>
              ))
            ) : (
              <div className="text-center py-6 font-bold text-app-muted bg-white rounded-app shadow-card">
                No matches today
              </div>
            )}
          </div>
        )}
      </section>

      <section>
        <SectionHeader title="Latest News" />
        <div className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-2 no-scrollbar">
          {mockNews.map((article, index) => (
            <NewsCard key={article.id} article={article} index={index} />
          ))}
        </div>
      </section>

      <Link
        to="/app/standings"
        className="block rounded-app bg-white p-5 shadow-card ring-1 ring-slate-100 mb-8">
        <p className="text-sm font-bold text-app-muted">Tournament pulse</p>
        <div className="mt-2 flex items-end justify-between">
          <div>
            <h2 className="text-xl font-black text-app-ink">Leaderboard</h2>
            <p className="mt-1 text-sm font-medium text-app-muted">
              Follow predictions, points, and standings.
            </p>
          </div>
          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-extrabold text-app-primary">
            View
          </span>
        </div>
      </Link>
    </div>
  );
}