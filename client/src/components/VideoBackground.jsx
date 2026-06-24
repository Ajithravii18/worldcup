import { motion } from 'framer-motion';

export default function VideoBackground() {
  return (
    <div className="fixed inset-0 -z-10 bg-[#030712] overflow-hidden pointer-events-none">
      
      {/* Animated Glowing Orbs */}
      <motion.div
        animate={{
          x: [0, 100, -50, 0],
          y: [0, -100, 50, 0],
          scale: [1, 1.2, 0.9, 1],
          opacity: [0.15, 0.25, 0.15],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-primary blur-[120px]"
      />
      
      <motion.div
        animate={{
          x: [0, -120, 80, 0],
          y: [0, 150, -60, 0],
          scale: [1, 1.3, 0.8, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-secondary-fixed-dim blur-[150px]"
      />
      
      <motion.div
        animate={{
          x: [0, 50, -80, 0],
          y: [0, 80, -120, 0],
          scale: [1, 0.9, 1.1, 1],
          opacity: [0.05, 0.15, 0.05],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute top-[30%] right-[20%] w-[40vw] h-[40vw] rounded-full bg-tertiary-fixed-dim blur-[100px]"
      />

      {/* Dotted Pattern Overlay - Animated Pan */}
      <motion.div 
        animate={{
          backgroundPosition: ['0px 0px', '24px 24px']
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute inset-0 z-20 bg-[radial-gradient(#4ade80_1px,transparent_1px)] bg-[size:24px_24px] opacity-[0.08]" 
      />
      
      {/* Heavy Vignette for dramatic sports feel */}
      <div className="absolute inset-0 z-30 bg-gradient-to-b from-black/40 via-transparent to-black/80"></div>
    </div>
  );
}
