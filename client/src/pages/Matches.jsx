import { motion } from "framer-motion";
import { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { EmptyState } from "../components/EmptyState";
import { ErrorBanner } from "../components/ErrorBanner";
import { LoadingSkeleton } from "../components/LoadingSkeleton";
import { MatchCard } from "../components/MatchCard";
import api from "../api/axios";
import { normalizeStatus } from "../utils/status";

const tabs = ["Live", "Today", "Upcoming", "Finished"];

export function MatchesPage() {
  const [activeTab, setActiveTab] = useState("Today");
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
  }, []);

  const filteredMatches = useMemo(() => {
    return matches.filter((match) => {
      const status = normalizeStatus(match.status);
      if (activeTab === "Live") {
        return status === "LIVE" || status === "IN_PLAY" || status === "HALFTIME";
      }
      if (activeTab === "Today") {
        return status === "TODAY" || status === "SCHEDULED" || status === "LIVE";
      }
      if (activeTab === "Upcoming") {
        return status === "UPCOMING" || match.status === 'scheduled';
      }
      return status === "FINISHED" || match.status === 'completed';
    });
  }, [activeTab, matches]);

  return (
    <div className="space-y-5 pb-8">
      <header>
        <p className="text-sm font-bold text-app-primary">Fixtures</p>
        <h1 className="text-3xl font-black text-app-ink">Matches</h1>
      </header>

      {error ? <ErrorBanner message={error} /> : null}

      <div className="sticky top-0 z-20 -mx-4 bg-app-bg/90 px-4 py-2 backdrop-blur">
        <div className="flex rounded-2xl bg-white p-1 shadow-card ring-1 ring-slate-100">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`relative flex-1 rounded-xl px-2 py-2 text-sm font-extrabold transition ${
                activeTab === tab ? "text-white" : "text-app-muted"
              }`}
            >
              {activeTab === tab ? (
                <motion.span
                  layoutId="match-tab"
                  className="absolute inset-0 rounded-xl bg-app-primary shadow-soft"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                />
              ) : null}
              <span className="relative">{tab}</span>
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <LoadingSkeleton rows={4} />
      ) : filteredMatches.length > 0 ? (
        <motion.div layout className="space-y-3">
          {filteredMatches.map((match, index) => (
            <Link to={`/app/match/${match._id}`} key={match._id} className="block">
              <MatchCard match={match} index={index} />
            </Link>
          ))}
        </motion.div>
      ) : (
        <EmptyState
          title={`No ${activeTab.toLowerCase()} matches`}
          description="Fixtures will appear here as soon as tournament data is available."
        />
      )}
    </div>
  );
}