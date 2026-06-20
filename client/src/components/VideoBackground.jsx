import { useLocation } from 'react-router-dom';

export default function VideoBackground() {
  const location = useLocation();
  const isAuthPage = ['/login', '/register', '/forgot-password'].includes(location.pathname);
  
  if (!isAuthPage) return null;
  
  return (
    <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900 via-[#0a0e1a] to-black pointer-events-none" />
  );
}
