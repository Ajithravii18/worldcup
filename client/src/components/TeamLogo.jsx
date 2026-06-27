






const sizes = {
  sm: "h-8 w-8 text-[10px]",
  md: "h-11 w-11 text-xs",
  lg: "h-16 w-16 text-sm"
};

export function TeamLogo({ team, size = "md" }) {
  const isString = typeof team === 'string';
  const name = isString ? team : (team?.name || 'Unknown');
  const shortName = isString ? null : team?.shortName;
  const code = isString ? null : team?.code;
  const logo = isString ? null : team?.logo;
  
  const initials = (shortName ?? code ?? name.slice(0, 3)).toUpperCase();

  return (
    <div
      className={`${sizes[size]} flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-white shadow-sm`}
      aria-label={`${name} logo`}>
      
      {logo ?
      <img src={logo} alt="" className="h-full w-full object-cover" loading="lazy" /> :

      <span className="font-bold text-app-primary">{initials}</span>
      }
    </div>);

}