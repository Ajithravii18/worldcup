import {
  ArrowLeft,
  Circle,
  CornerUpRight,
  RefreshCcw,
  Square } from
"lucide-react";
import { useCallback, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { ErrorBanner } from "../components/ErrorBanner";
import { LoadingSkeleton } from "../components/LoadingSkeleton";
import { StatCard } from "../components/StatCard";
import { StatusBadge } from "../components/StatusBadge";
import { TeamLogo } from "../components/TeamLogo";
import { getMatchDetails } from "../services/api";
import { useApiResource } from "../hooks/useApiResource";

import { mockMatchDetails } from "../utils/mockData";

export function MatchDetailsPage() {
  const { id } = useParams();
  const [match, setMatch] = useState(null);
  const [myPrediction, setMyPrediction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [homeGoals, setHomeGoals] = useState(0);
  const [awayGoals, setAwayGoals] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [matchRes, predsRes] = await Promise.all([
          api.get(`/matches/${id}`),
          api.get('/predictions/my')
        ]);
        setMatch(matchRes.data);
        
        const pred = predsRes.data.find(p => p.match === id || p.match?._id === id);
        if (pred) {
          setMyPrediction(pred);
          setHomeGoals(pred.homeGoals);
          setAwayGoals(pred.awayGoals);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load match details');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleSubmitPrediction = async () => {
    setSubmitting(true);
    setSubmitSuccess(false);
    try {
      await api.post('/predictions', {
        matchId: id,
        homeGoals,
        awayGoals,
      });
      setSubmitSuccess(true);
      setMyPrediction({ homeGoals, awayGoals });
      setTimeout(() => setSubmitSuccess(false), 3000);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit prediction');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSkeleton rows={5} />;
  }

  if (!match && !error) return null;

  return (
    <div className="space-y-6 pb-12">
      <header className="overflow-hidden rounded-[2rem] bg-app-primary text-white shadow-soft">
        <div className="relative p-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.28),transparent_22rem)]" />
          <div className="relative flex items-center justify-between">
            <Link
              to="/app/matches"
              aria-label="Back to matches"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15">
              <ArrowLeft size={20} />
            </Link>
            <StatusBadge status={match.status} />
          </div>

          <div className="relative mt-7 flex items-center justify-between gap-3">
            <TeamSummary side="home" team={match.homeTeam} />
            <div className="min-w-24 text-center">
              <div className="text-5xl font-black tracking-tight drop-shadow-md">
                {match.homeScore ?? 0}
                <span className="mx-2 text-3xl text-blue-100">-</span>
                {match.awayScore ?? 0}
              </div>
              <p className="mt-2 text-xs font-extrabold uppercase tracking-wide text-blue-100">
                {match.group ?? "World Cup"}
              </p>
            </div>
            <TeamSummary side="away" team={match.awayTeam} />
          </div>
        </div>
      </header>

      {error ? <ErrorBanner message={error} /> : null}

      <section className="rounded-app bg-white p-5 shadow-card ring-1 ring-slate-100">
        <h2 className="mb-4 text-lg font-black text-app-ink">Your Prediction</h2>
        
        {myPrediction && match.status !== 'scheduled' && match.status !== 'UPCOMING' ? (
          <div className="flex flex-col items-center justify-center py-4 bg-app-bg rounded-xl">
             <p className="text-sm font-bold text-app-muted mb-2 uppercase tracking-wide">Locked In</p>
             <div className="text-4xl font-black text-app-primary">
               {myPrediction.homeGoals} - {myPrediction.awayGoals}
             </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-6">
              <div className="flex flex-col items-center">
                <span className="text-xs font-bold text-app-muted mb-2 uppercase">{typeof match.homeTeam === 'string' ? match.homeTeam : match.homeTeam?.name}</span>
                <div className="flex items-center gap-3 bg-app-bg p-2 rounded-xl">
                  <button onClick={() => setHomeGoals(Math.max(0, homeGoals - 1))} className="w-10 h-10 flex items-center justify-center rounded-lg bg-white shadow-sm font-bold text-xl active:scale-95">-</button>
                  <span className="w-8 text-center font-black text-2xl text-app-ink">{homeGoals}</span>
                  <button onClick={() => setHomeGoals(homeGoals + 1)} className="w-10 h-10 flex items-center justify-center rounded-lg bg-app-primary text-white shadow-soft font-bold text-xl active:scale-95">+</button>
                </div>
              </div>
              
              <div className="text-xl font-black text-slate-300">VS</div>
              
              <div className="flex flex-col items-center">
                <span className="text-xs font-bold text-app-muted mb-2 uppercase">{typeof match.awayTeam === 'string' ? match.awayTeam : match.awayTeam?.name}</span>
                <div className="flex items-center gap-3 bg-app-bg p-2 rounded-xl">
                  <button onClick={() => setAwayGoals(Math.max(0, awayGoals - 1))} className="w-10 h-10 flex items-center justify-center rounded-lg bg-white shadow-sm font-bold text-xl active:scale-95">-</button>
                  <span className="w-8 text-center font-black text-2xl text-app-ink">{awayGoals}</span>
                  <button onClick={() => setAwayGoals(awayGoals + 1)} className="w-10 h-10 flex items-center justify-center rounded-lg bg-app-primary text-white shadow-soft font-bold text-xl active:scale-95">+</button>
                </div>
              </div>
            </div>
            
            <button 
              onClick={handleSubmitPrediction}
              disabled={submitting || (match.status !== 'scheduled' && match.status !== 'UPCOMING')}
              className="w-full mt-4 py-3 rounded-xl bg-app-ink text-white font-black uppercase tracking-wide disabled:opacity-50 hover:bg-slate-800 transition-colors shadow-card"
            >
              {submitting ? 'Saving...' : 'Save Prediction'}
            </button>
            {submitSuccess && <p className="text-center text-sm font-bold text-green-600 mt-2">Prediction saved successfully!</p>}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-3 text-lg font-black text-app-ink">Match Statistics</h2>
        <div className="space-y-3">
          <StatCard
            label="Possession"
            homeValue={match.statistics?.possession?.home || 50}
            awayValue={match.statistics?.possession?.away || 50}
            suffix="%" />
          <StatCard
            label="Shots"
            homeValue={match.statistics?.shots?.home || 0}
            awayValue={match.statistics?.shots?.away || 0} />
          <StatCard
            label="Corners"
            homeValue={match.statistics?.corners?.home || 0}
            awayValue={match.statistics?.corners?.away || 0} />
        </div>
      </section>
    </div>
  );
}

function TeamSummary({
  team,
  side



}) {
  return (
    <div className="flex flex-1 flex-col items-center gap-3 text-center">
      <TeamLogo team={team} size="lg" />
      <div>
        <p className="text-sm font-extrabold">{team.name}</p>
        <p className="text-[11px] font-bold uppercase tracking-wide text-blue-100">{side}</p>
      </div>
    </div>);

}

function TimelineRow({ event }) {
  const icon =
  event.type === "goal" ?
  <Circle size={18} className="fill-app-success text-app-success" /> :
  event.type === "yellow-card" ?
  <Square size={18} className="fill-yellow-400 text-yellow-400" /> :
  event.type === "red-card" ?
  <Square size={18} className="fill-app-danger text-app-danger" /> :

  <RefreshCcw size={18} className="text-app-primary" />;


  const label =
  event.type === "goal" ?
  "Goal" :
  event.type === "yellow-card" ?
  "Yellow card" :
  event.type === "red-card" ?
  "Red card" :
  "Substitution";

  return (
    <div className="flex items-center gap-3">
      <div className="w-10 text-sm font-black text-app-primary">{event.minute}'</div>
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-50">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-extrabold text-app-ink">
          {event.playerName}
          {event.replacementName ? ` for ${event.replacementName}` : ""}
        </p>
        <p className="truncate text-xs font-semibold text-app-muted">
          {label} · {event.teamName}
          {event.assistName ? ` · Assist ${event.assistName}` : ""}
        </p>
      </div>
      {event.type === "goal" ? <CornerUpRight size={16} className="text-app-success" /> : null}
    </div>);

}

function FormationCard({
  teamName,
  formation,
  lineup




}) {
  const groups = ["GK", "DEF", "MID", "FWD"];

  return (
    <div className="overflow-hidden rounded-app bg-white shadow-card ring-1 ring-slate-100">
      <div className="flex items-center justify-between border-b border-slate-100 px-3 py-3">
        <p className="text-sm font-black text-app-ink">{teamName}</p>
        <span className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-extrabold text-app-muted">
          {formation}
        </span>
      </div>
      <div className="min-h-72 bg-app-success p-3">
        <div className="flex h-full min-h-64 flex-col justify-between rounded-[1.25rem] border border-white/40 bg-[linear-gradient(180deg,rgba(255,255,255,0.12),rgba(255,255,255,0.05))] p-2">
          {groups.map((group) => {
            const players = lineup.filter((player) => player.position === group);
            return (
              <div key={group} className="flex justify-center gap-1.5">
                {players.map((player) =>
                <div key={player.id} className="min-w-0 text-center">
                    <div className="mx-auto flex h-7 w-7 items-center justify-center rounded-full bg-white text-[10px] font-black text-app-success shadow-sm">
                      {player.number}
                    </div>
                    <p className="mt-1 max-w-12 truncate text-[10px] font-bold text-white">
                      {player.name}
                    </p>
                  </div>
                )}
              </div>);

          })}
        </div>
      </div>
    </div>);

}