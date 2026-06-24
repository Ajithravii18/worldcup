import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const bgMap = {
  '/': 'https://images.unsplash.com/photo-1527871369852-eb58cb2b54e2?fm=jpg&q=60&w=3000&auto=format&fit=crop',
  '/app': 'https://images.unsplash.com/photo-1527871369852-eb58cb2b54e2?fm=jpg&q=60&w=3000&auto=format&fit=crop',
  '/login': 'https://news.files.bbci.co.uk/include/extra/shorthand/assets/sport/i4yxbkxake/assets/OyJwc6GBIY/gettyimages-2235302091-2813x2813.webp',
  '/register': 'https://news.files.bbci.co.uk/include/extra/shorthand/assets/sport/i4yxbkxake/assets/6kdAp7O1aq/gettyimages-1241207563-1977x1977.webp',
};

export default function VideoBackground() {
  const location = useLocation();
  const bgImage = bgMap[location.pathname] || bgMap['/'];

  return (
    <div className="fixed inset-0 -z-10 bg-[#030712] overflow-hidden pointer-events-none">
      <AnimatePresence mode="wait">
        <motion.div
          key={bgImage}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ 
            opacity: 1, 
            scale: [1.05, 1.15, 1.05],
            x: ['0%', '-1%', '0%'],
            y: ['0%', '1%', '0%']
          }}
          exit={{ opacity: 0 }}
          transition={{ 
            opacity: { duration: 1.5, ease: "easeOut" },
            scale: { duration: 45, repeat: Infinity, ease: "linear" },
            x: { duration: 45, repeat: Infinity, ease: "linear" },
            y: { duration: 45, repeat: Infinity, ease: "linear" }
          }}
          className="absolute inset-[calc(-5%)] z-0 blur-[2px]"
          style={{
            backgroundImage: `url('${bgImage}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        />
      </AnimatePresence>
      
      {/* Premium Glassmorphism Overlays */}
      
      {/* 1. Deep color burn to ensure dark mode text legibility */}
      <div className="absolute inset-0 z-10 bg-[#030712]/70 backdrop-blur-[4px]" />
      
      {/* 2. Soft radial vignette for focus */}
      <div className="absolute inset-0 z-20 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(3,7,18,0.85)_100%)]" />

      {/* 3. Subtle noise/texture for premium "frosted" finish */}
      <div className="absolute inset-0 z-30 opacity-[0.03] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPSc0JyBoZWlnaHQ9JzQnPgo8cmVjdCB3aWR0aD0nNCcgaGVpZ2h0PSc0JyBmaWxsPScjZmZmJy8+CjxwYXRoIGQ9J00wIDBoMnYySDB6bTIgMmgydjJIMnonIGZpbGw9JyMwMDAnIGZpbGwtb3BhY2l0eT0nLjMnLz4KPC9zdmc+')] mix-blend-overlay" />
      
      {/* 4. Neon accent glow (subtle hint of branding) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1/2 z-20 bg-[radial-gradient(ellipse_at_top,rgba(74,222,128,0.1),transparent_70%)] opacity-60" />
    </div>
  );
}
