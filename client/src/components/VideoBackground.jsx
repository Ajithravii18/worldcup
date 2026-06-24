import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const bgMap = {
  '/': 'https://images.unsplash.com/photo-1527871369852-eb58cb2b54e2?fm=jpg&q=60&w=3000&auto=format&fit=crop',
  '/login': 'https://news.files.bbci.co.uk/include/extra/shorthand/assets/sport/i4yxbkxake/assets/OyJwc6GBIY/gettyimages-2235302091-2813x2813.webp',
  '/register': 'https://news.files.bbci.co.uk/include/extra/shorthand/assets/sport/i4yxbkxake/assets/6kdAp7O1aq/gettyimages-1241207563-1977x1977.webp',
};

export default function VideoBackground() {
  const location = useLocation();
  const bgImage = bgMap[location.pathname] || bgMap['/'];

  return (
    <div className="fixed inset-0 -z-10 bg-black overflow-hidden pointer-events-none">
      <AnimatePresence mode="wait">
        <motion.div
          key={bgImage}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url('${bgImage}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        />
      </AnimatePresence>
      
      {/* Deep Frosted Glass Overlay for dark aesthetic */}
      <div className="absolute inset-0 z-10 bg-black/60 backdrop-blur-[6px]" />
      
      {/* Dotted Pattern Overlay */}
      <div className="absolute inset-0 z-20 bg-[radial-gradient(#4ade80_1px,transparent_1px)] bg-[size:24px_24px] opacity-15" />
      
      {/* Heavy Vignette for dramatic sports feel */}
      <div className="absolute inset-0 z-30 bg-gradient-to-b from-black/40 via-transparent to-black/80"></div>
    </div>
  );
}
