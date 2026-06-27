import { useState, useEffect } from "react";
import { EmptyState } from "../components/EmptyState";
import { ErrorBanner } from "../components/ErrorBanner";
import { LoadingSkeleton } from "../components/LoadingSkeleton";
import { Trophy, Medal, Award } from "lucide-react";
import api from "../api/axios";

export function StandingsPage() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await api.get('/users/leaderboard');
        setLeaderboard(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load leaderboard');
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  return (
    <div className="space-y-5 pb-8">
      <header>
        <p className="text-sm font-bold text-app-primary">Tournament Pulse</p>
        <h1 className="text-3xl font-black text-app-ink">Leaderboard</h1>
      </header>

      {error ? <ErrorBanner message={error} /> : null}

      {loading ? (
        <LoadingSkeleton rows={6} />
      ) : leaderboard.length > 0 ? (
        <div className="rounded-app bg-white p-4 shadow-card ring-1 ring-slate-100">
          <div className="space-y-3">
            {leaderboard.map((user, index) => (
              <div key={user._id} className="flex items-center justify-between border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 font-black text-app-muted">
                    {index === 0 ? <Trophy className="text-yellow-500" size={20} /> :
                     index === 1 ? <Medal className="text-gray-400" size={20} /> :
                     index === 2 ? <Award className="text-amber-600" size={20} /> :
                     (index + 1)}
                  </div>
                  <div>
                    <p className="text-sm font-extrabold text-app-ink">{user.name}</p>
                    <p className="text-xs font-semibold text-app-muted">{user.points} points</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-app-primary">{user.exactMatches || 0} Exact</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <EmptyState
          title="No leaderboard available"
          description="Predictions will appear here as the tournament progresses."
        />
      )}
    </div>
  );
}