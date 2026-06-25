import { Link } from 'react-router-dom';
import { ArrowRight, Trophy } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden bg-app-bg px-4 sm:px-6 lg:px-8">
      
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100 via-app-bg to-app-bg opacity-70"></div>
      </div>

      <div className="relative z-10 w-full max-w-2xl text-center">
        <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-soft ring-1 ring-slate-100">
          <Trophy className="h-12 w-12 text-app-primary" />
        </div>
        
        <h1 className="text-5xl font-black tracking-tight text-app-ink sm:text-6xl md:text-7xl">
          World Cup <span className="text-app-primary">Live</span>
        </h1>
        
        <p className="mx-auto mt-6 max-w-xl text-lg font-medium text-app-muted sm:text-xl">
          Predict matches, climb the leaderboard, and follow live scores with our beautifully designed arena.
        </p>
        
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            to="/register"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-app-primary px-8 py-4 text-base font-black uppercase tracking-wide text-white shadow-soft transition-transform hover:scale-105 hover:bg-app-secondary sm:w-auto"
          >
            Get Started
            <ArrowRight className="h-5 w-5" />
          </Link>
          <Link
            to="/login"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-white px-8 py-4 text-base font-black uppercase tracking-wide text-app-ink shadow-card ring-1 ring-slate-200 transition-transform hover:scale-105 hover:bg-slate-50 sm:w-auto"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
