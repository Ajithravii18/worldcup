import { Activity, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import { TeamLogo } from "./TeamLogo";





export function LiveMatchCard({ match }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, ease: "easeOut" }}>
      
      <Link
        to={`/match/${match.id}`}
        className="block overflow-hidden rounded-[2rem] bg-app-primary text-white shadow-soft">
        
        <div className="relative min-h-56 p-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(255,255,255,0.3),transparent_28rem)]" />
          <div className="absolute -right-10 -top-12 h-32 w-32 rounded-full border border-white/20" />
          <div className="absolute -bottom-14 left-6 h-36 w-36 rounded-full border border-white/15" />

          <div className="relative flex items-center justify-between">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-extrabold uppercase tracking-wide">
              <Activity size={14} className="fill-current" />
              {match.status}
            </div>
            <div className="rounded-full bg-white px-3 py-1.5 text-xs font-extrabold text-app-primary">
              {match.minute ?? "--"}'
            </div>
          </div>

          <div className="relative mt-8 flex items-center justify-between gap-4">
            <div className="flex flex-1 flex-col items-center gap-3 text-center">
              <TeamLogo team={match.homeTeam} size="lg" />
              <div>
                <p className="text-base font-extrabold">{match.homeTeam.name}</p>
                <p className="text-xs font-semibold text-blue-100">{match.homeTeam.shortName}</p>
              </div>
            </div>

            <div className="flex min-w-24 flex-col items-center">
              <div className="text-5xl font-black tracking-tight">
                {match.homeScore ?? 0}
                <span className="mx-2 text-3xl text-blue-100">-</span>
                {match.awayScore ?? 0}
              </div>
              <span className="mt-2 rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold text-blue-50">
                Live Score
              </span>
            </div>

            <div className="flex flex-1 flex-col items-center gap-3 text-center">
              <TeamLogo team={match.awayTeam} size="lg" />
              <div>
                <p className="text-base font-extrabold">{match.awayTeam.name}</p>
                <p className="text-xs font-semibold text-blue-100">{match.awayTeam.shortName}</p>
              </div>
            </div>
          </div>

          {match.venue ?
          <div className="relative mt-7 flex items-center justify-center gap-2 text-sm font-semibold text-blue-100">
              <MapPin size={15} />
              <span>{match.venue}</span>
            </div> :
          null}
        </div>
      </Link>
    </motion.div>);

}