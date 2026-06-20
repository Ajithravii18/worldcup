import { useLocation } from 'react-router-dom';

export default function VideoBackground() {
  const location = useLocation();
  const isAuthPage = ['/', '/login', '/register', '/forgot-password'].includes(location.pathname);
  
  if (!isAuthPage) return null;
  
  return (
    <div className="fixed inset-0 -z-10 bg-gray-50 pointer-events-none">
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]"></div>
    </div>
  );
}
