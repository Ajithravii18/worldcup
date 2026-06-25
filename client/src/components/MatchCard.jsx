import { Clock3, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import { formatMatchTime } from "../utils/date";
import { TeamLogo } from "./TeamLogo";
import { StatusBadge } from "./StatusBadge";







export function MatchCard({ match, compact = false, index = 0 }) {
  const showScore =
  typeof match.homeScore === "number" || typeof match.awayScore === "number";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.28, delay: Math.min(index * 0.035, 0.18) }}>
      
      <Link
        to={`/match/${match.id}`}
        className="block rounded-app bg-white p-4 shadow-card ring-1 ring-slate-100 transition active:scale-[0.99]">
        
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-xs font-bold uppercase tracking-wide text-app-muted">
              {match.group ?? match.competition ?? "World Cup"}
            </p>
            <div className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-slate-400">
              <Clock3 size={13} />
              <span>{formatMatchTime(match.kickoffTime)}</span>
            </div>
          </div>
          <StatusBadge status={match.status} />
        </div>

        <div className={`${compact ? "mt-4" : "mt-5"} space-y-3`}>
          <TeamScoreRow
            team={match.homeTeam}
            score={showScore ? match.homeScore ?? 0 : undefined} />
          
          <TeamScoreRow
            team={match.awayTeam}
            score={showScore ? match.awayScore ?? 0 : undefined} />
          
        </div>

        {match.venue ?
        <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-3 text-xs font-semibold text-app-muted">
            <MapPin size={14} />
            <span className="truncate">{match.venue}</span>
          </div> :
        null}
      </Link>
    </motion.div>);

}






function TeamScoreRow({ team, score }) {
  const name = typeof team === 'string' ? team : (team?.name || 'Unknown');
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex min-w-0 items-center gap-3">
        <TeamLogo team={team} size="sm" />
        <span className="truncate text-sm font-bold text-app-ink">{name}</span>
      </div>
      <span className="w-8 shrink-0 text-right text-xl font-black text-app-ink">
        {typeof score === "number" ? score : "-"}
      </span>
    </div>);

}