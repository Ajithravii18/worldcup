import { Link } from 'react-router-dom';
import Icon from '../components/Icon';

export default function LandingPage() {
  return (
    <div className="min-h-dvh flex flex-col items-center justify-center relative overflow-hidden px-4 bg-transparent">
      {/* Subtle glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none bg-gradient-to-b from-primary/10 to-transparent" />

      <div className="relative z-10 max-w-sm w-full flex flex-col items-center text-center">

        {/* Logo */}
        <div className="mb-8 opacity-0 animate-[slideUp_0.6s_ease-out_0.1s_forwards]">
          <div className="flex flex-col items-center justify-center gap-3 mb-2">
            <div className="w-16 h-16 flex items-center justify-center text-white text-4xl font-display font-bold bg-primary shadow-subtle-card rounded-2xl">
              <Icon name="sports_soccer" className="text-white text-[36px]" />
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-on-surface mt-2">
              Lucky Star FC
            </h1>
          </div>
          <p className="text-sm font-medium text-on-surface-variant">
            World Cup 2026 Predictions
          </p>
        </div>

        {/* Badge */}
        <div className="mb-10 flex items-center gap-3 px-5 py-2.5 opacity-0 animate-[slideUp_0.6s_ease-out_0.3s_forwards] bg-white border border-outline-variant/30 rounded-full shadow-subtle-card">
          <span className="text-xl animate-bounce" style={{ animationDuration: '2.5s' }}>🏆</span>
          <span className="text-sm font-semibold text-on-surface">World Cup 2026</span>
          <span className="text-outline-variant">|</span>
          <div className="flex items-center gap-1.5 ml-1">
            <img src="https://flagcdn.com/w40/ca.png" alt="Canada" className="w-5 h-3.5 rounded-sm object-cover shadow-sm" />
            <img src="https://flagcdn.com/w40/mx.png" alt="Mexico" className="w-5 h-3.5 rounded-sm object-cover shadow-sm" />
            <img src="https://flagcdn.com/w40/us.png" alt="USA" className="w-5 h-3.5 rounded-sm object-cover shadow-sm" />
          </div>
        </div>

        {/* Tagline */}
        <p className="text-sm font-medium leading-relaxed mb-10 px-2 opacity-0 animate-[slideUp_0.6s_ease-out_0.5s_forwards] text-on-surface-variant">
          The ultimate prediction arena for the 2026 World Cup.
        </p>

        {/* Buttons */}
        <div className="w-full flex flex-col gap-4 opacity-0 animate-[slideUp_0.6s_ease-out_0.7s_forwards]">
          <Link
            to="/login"
            className="w-full text-center text-white font-display font-semibold text-lg py-4 transition-all duration-150 active:scale-95 bg-primary hover:bg-primary/90 shadow-neon-primary rounded-2xl"
          >
            Sign In
          </Link>

          <Link
            to="/register"
            className="w-full text-center font-display font-semibold text-lg py-4 transition-all duration-150 active:scale-95 bg-white border-2 border-primary/20 text-primary hover:bg-primary/5 rounded-2xl shadow-subtle-card"
          >
            Create Account
          </Link>
        </div>
      </div>

      <p className="absolute bottom-8 text-sm font-medium text-center z-10 opacity-0 animate-[fadeIn_1s_ease-out_1.2s_forwards] text-on-surface-variant">
        Predict • Compete • Glory
      </p>
    </div>
  );
}
