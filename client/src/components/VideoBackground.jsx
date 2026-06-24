import { useLocation } from 'react-router-dom';

export default function VideoBackground() {
  const location = useLocation();
  const isAuthPage = ['/', '/login', '/register', '/forgot-password'].includes(location.pathname);
  
  if (!isAuthPage) return null;
  
  return (
    <div className="fixed inset-0 -z-10 bg-background overflow-hidden pointer-events-none">
      {/* Premium dot grid pattern */}
      <div className="absolute inset-0 opacity-40" style={{ backgroundImage: 'radial-gradient(#4ade80 1.5px, transparent 1.5px)', backgroundSize: '32px 32px' }}></div>
      
      {/* Soft fresh green shapes for FrushGo aesthetic */}
      <div className="absolute top-[-30%] right-[-10%] w-[70vw] h-[70vw] rounded-full bg-primary/15 blur-[80px]"></div>
      <div className="absolute bottom-[-10%] left-[-20%] w-[80vw] h-[80vw] rounded-full bg-primary/15 blur-[100px]"></div>
      
      {/* Overlay to fade out grid at edges */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background opacity-80"></div>
    </div>
  );
}
