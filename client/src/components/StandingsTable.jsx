
import { TeamLogo } from "./TeamLogo";





export function StandingsTable({ groups }) {
  return (
    <div className="space-y-5">
      {groups.map((group) =>
      <section
        key={group.group}
        className="overflow-hidden rounded-app bg-white shadow-card ring-1 ring-slate-100">
        
          <div className="border-b border-slate-100 px-4 py-4">
            <h2 className="text-base font-extrabold text-app-ink">{group.group}</h2>
          </div>
          <div className="max-h-[420px] overflow-auto">
            <table className="w-full min-w-[360px] border-collapse text-sm">
              <thead className="sticky top-0 z-10 bg-slate-50 text-xs font-extrabold uppercase tracking-wide text-app-muted">
                <tr>
                  <th className="w-11 px-3 py-3 text-left">Pos</th>
                  <th className="px-2 py-3 text-left">Team</th>
                  <th className="px-2 py-3 text-center">P</th>
                  <th className="px-2 py-3 text-center">W</th>
                  <th className="px-2 py-3 text-center">D</th>
                  <th className="px-2 py-3 text-center">L</th>
                  <th className="px-3 py-3 text-center">Pts</th>
                </tr>
              </thead>
              <tbody>
                {group.rows.map((row) =>
              <tr key={row.team.id} className="border-t border-slate-100">
                    <td className="px-3 py-3 font-extrabold text-app-ink">{row.pos}</td>
                    <td className="px-2 py-3">
                      <div className="flex min-w-0 items-center gap-2">
                        <TeamLogo team={row.team} size="sm" />
                        <span className="truncate font-bold text-app-ink">{row.team.name}</span>
                      </div>
                    </td>
                    <td className="px-2 py-3 text-center font-semibold text-app-muted">
                      {row.played}
                    </td>
                    <td className="px-2 py-3 text-center font-semibold text-app-muted">
                      {row.wins}
                    </td>
                    <td className="px-2 py-3 text-center font-semibold text-app-muted">
                      {row.draws}
                    </td>
                    <td className="px-2 py-3 text-center font-semibold text-app-muted">
                      {row.losses}
                    </td>
                    <td className="px-3 py-3 text-center font-black text-app-primary">
                      {row.points}
                    </td>
                  </tr>
              )}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>);

}