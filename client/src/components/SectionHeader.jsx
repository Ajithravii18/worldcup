





export function SectionHeader({ title, action, onAction }) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <h2 className="text-lg font-extrabold text-app-ink">{title}</h2>
      {action ?
      <button
        type="button"
        onClick={onAction}
        className="text-sm font-bold text-app-primary">
        
          {action}
        </button> :
      null}
    </div>);

}