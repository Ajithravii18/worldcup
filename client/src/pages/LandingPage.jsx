import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="min-h-dvh relative flex items-center justify-center overflow-hidden bg-gray-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0 opacity-40">
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]"></div>
      </div>
      
      {/* Soft glowing orbs for premium feel */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-green-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>

      <div className="relative z-10 max-w-lg w-full px-6 flex flex-col items-center text-center">
        {/* Branding */}
        <div className="mb-8 opacity-0 animate-[slideUp_0.8s_ease-out_forwards]" style={{ animationDelay: '0.2s' }}>
          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-2xl bg-gradient-to-br from-theme-primary to-theme-secondary flex items-center justify-center shadow-lg mb-6 transform rotate-3">
            <span className="text-white font-black text-4xl sm:text-5xl leading-none font-display italic pr-1">K</span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl leading-tight tracking-[0.1em] font-black text-gray-900 drop-shadow-sm">
            LUCKY STAR FC
          </h1>
          <p className="text-sm sm:text-base text-theme-primary tracking-[0.3em] uppercase leading-none mt-4 font-bold">
            PREDICTIONS
          </p>

          {/* WC 2026 Badge */}
          <div className="mt-6 inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200">
            <span className="text-lg animate-bounce" style={{ animationDuration: '2s' }}>🏆</span>
            <span className="text-[10px] sm:text-xs font-bold text-gray-800 uppercase tracking-widest">WORLD CUP 2026</span>
            <span className="text-gray-300 mx-1">|</span>
            <span className="text-base tracking-widest">🇨🇦 🇲🇽 🇺🇸</span>
          </div>
        </div>

        {/* Minimalistic Description */}
        <p className="text-gray-500 text-sm sm:text-base font-medium leading-relaxed mb-12 px-4 opacity-0 animate-[slideUp_0.8s_ease-out_forwards]" style={{ animationDelay: '0.5s' }}>
          The ultimate prediction arena for the 2026 World Cup.
        </p>

        {/* Action Buttons */}
        <div className="w-full sm:w-4/5 flex flex-col gap-4 opacity-0 animate-[slideUp_0.8s_ease-out_forwards]" style={{ animationDelay: '0.8s' }}>
          <Link
            to="/login"
            className="w-full text-center bg-theme-primary text-white font-display font-black py-4 rounded-xl tracking-widest uppercase transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl hover:bg-blue-700 border border-transparent"
          >
            Enter Arena
          </Link>
          
          <Link
            to="/register"
            className="w-full text-center bg-white text-gray-900 font-display font-black py-4 rounded-xl tracking-widest uppercase transition-all duration-300 hover:scale-105 active:scale-95 shadow-sm border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
          >
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}
