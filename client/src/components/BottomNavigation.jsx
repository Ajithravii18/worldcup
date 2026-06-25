import { CalendarDays, Home, ListOrdered, Trophy, UserRound } from "lucide-react";
import { NavLink } from "react-router-dom";

const navItems = [
{ label: "Home", to: "/app", icon: Home },
{ label: "Matches", to: "/app/matches", icon: CalendarDays },
{ label: "Results", to: "/app/results", icon: Trophy },
{ label: "Standings", to: "/app/standings", icon: ListOrdered },
{ label: "Profile", to: "/app/profile", icon: UserRound }];


export function BottomNavigation() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-[480px] rounded-t-[1.75rem] border border-slate-200 bg-white/95 px-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] pt-3 shadow-[0_-18px_40px_rgba(15,23,42,0.08)] backdrop-blur">
      <div className="grid grid-cols-5 gap-1">
        {navItems.map((item) =>
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
          `flex min-w-0 flex-col items-center gap-1 rounded-2xl px-1.5 py-2 text-[11px] font-bold transition ${
          isActive ? "bg-blue-50 text-app-primary" : "text-slate-400"}`

          }>
          
            <item.icon size={20} strokeWidth={2.4} />
            <span className="truncate">{item.label}</span>
          </NavLink>
        )}
      </div>
    </nav>);

}