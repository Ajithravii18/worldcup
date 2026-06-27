import { Bell, LogOut, Settings, Shield, User as UserIcon } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="space-y-5 pb-8">
      <header>
        <p className="text-sm font-bold text-app-primary">Your account</p>
        <h1 className="text-3xl font-black text-app-ink">Profile</h1>
      </header>

      <section className="rounded-[2rem] bg-white p-5 shadow-card ring-1 ring-slate-100">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-app-primary text-2xl font-black text-white uppercase shadow-soft">
            {user?.name?.[0] || 'U'}
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-xl font-black text-app-ink truncate">{user?.name || 'User'}</h2>
            <p className="text-sm font-semibold text-app-muted truncate">{user?.email}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-black text-app-primary">{user?.points || 0}</p>
            <p className="text-xs font-bold text-app-muted uppercase tracking-wide">Points</p>
          </div>
        </div>
      </section>

      <section className="rounded-app bg-white shadow-card ring-1 ring-slate-100 overflow-hidden">
        {user?.role === 'admin' && (
          <Link to="/app/admin" className="block">
            <ProfileRow icon={Shield} title="Admin Dashboard" description="Manage matches and live scores" />
          </Link>
        )}
        <ProfileRow icon={UserIcon} title="Account Details" description="Update your personal information" />
        <ProfileRow icon={Bell} title="Notifications" description="Manage your email alerts" />
        <ProfileRow icon={Settings} title="Preferences" description="Theme and timezone settings" />
      </section>

      <button
        onClick={handleLogout}
        className="w-full flex items-center justify-center gap-2 rounded-xl bg-red-50 p-4 text-sm font-bold text-red-600 hover:bg-red-100 transition-colors"
      >
        <LogOut size={18} />
        Sign Out
      </button>
    </div>
  );
}

function ProfileRow({ icon: Icon, title, description }) {
  return (
    <div className="flex w-full items-center gap-3 border-b border-slate-100 px-4 py-4 text-left last:border-b-0 hover:bg-slate-50 transition-colors cursor-pointer">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-app-primary">
        <Icon size={19} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-extrabold text-app-ink">{title}</p>
        <p className="truncate text-xs font-semibold text-app-muted">{description}</p>
      </div>
    </div>
  );
}