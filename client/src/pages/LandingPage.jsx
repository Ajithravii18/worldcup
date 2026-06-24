import { Link } from 'react-router-dom';
import Icon from '../components/Icon';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function LandingPage() {
  return (
    <div className="min-h-dvh flex flex-col items-center justify-center relative overflow-x-hidden px-4 py-12 bg-transparent bg-[radial-gradient(#ffffff22_1px,transparent_1px)] [background-size:24px_24px]">
      {/* Subtle glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none bg-gradient-to-b from-primary/20 to-transparent blur-3xl" />

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-sm md:max-w-4xl w-full flex flex-col items-center text-center md:bg-surface md:p-10 md:rounded-[3rem] md:border md:border-surface-variant md:shadow-2xl"
      >
        {/* Logo */}
        <motion.div variants={itemVariants} className="mb-6">
          <div className="flex flex-col items-center justify-center gap-3 mb-2">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex items-center justify-center"
            >
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/2026_FIFA_World_Cup_emblem.svg/1920px-2026_FIFA_World_Cup_emblem.svg.png" alt="World Cup 2026 Emblem" className="h-20 w-auto drop-shadow-[0_0_15px_rgba(0,255,135,0.4)]" />
            </motion.div>
            <div className="overflow-hidden">
              <motion.h1 
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30, delay: 0.4 }}
                className="font-display text-4xl sm:text-6xl font-black text-white drop-shadow-2xl mt-2 tracking-widest uppercase"
              >
                Lucky Star FC
              </motion.h1>
            </div>
          </div>
          <motion.p variants={itemVariants} className="text-sm md:text-base font-bold text-outline-variant tracking-[0.3em] uppercase drop-shadow-md">
            World Cup 2026 Predictions
          </motion.p>
        </motion.div>

        {/* Badge */}
        <motion.div variants={itemVariants} className="mb-8 flex items-center gap-4 px-6 py-3 bg-surface-variant border border-outline-variant/20 rounded-full shadow-lg">
          <span className="text-sm md:text-base font-bold text-white tracking-widest uppercase">World Cup 2026</span>
          <span className="text-outline-variant/50">|</span>
          <div className="flex items-center gap-2 ml-1">
            <img src="https://flagcdn.com/w40/ca.png" alt="Canada" className="w-6 h-4 rounded-sm object-cover shadow-md" />
            <img src="https://flagcdn.com/w40/mx.png" alt="Mexico" className="w-6 h-4 rounded-sm object-cover shadow-md" />
            <img src="https://flagcdn.com/w40/us.png" alt="USA" className="w-6 h-4 rounded-sm object-cover shadow-md" />
          </div>
        </motion.div>

        {/* Tagline */}
        <motion.p variants={itemVariants} className="text-base md:text-lg font-medium leading-relaxed mb-8 px-4 text-outline-variant">
          The ultimate prediction arena for the 2026 World Cup.
        </motion.p>

        {/* Buttons */}
        <motion.div variants={itemVariants} className="w-full flex flex-col md:flex-row justify-center gap-4 md:gap-6">
          <Link to="/login" className="w-full md:w-64">
            <motion.div
              whileHover={{ scale: 1.05, backgroundColor: "#22c55e" }}
              whileTap={{ scale: 0.95 }}
              className="w-full flex items-center justify-center gap-2 text-white tracking-[0.15em] font-display font-bold text-xl py-4 bg-primary shadow-neon-primary rounded-2xl"
            >
              Sign In <Icon name="chevron_right" className="text-2xl" />
            </motion.div>
          </Link>

          <Link to="/register" className="w-full md:w-64">
            <motion.div
              whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
              whileTap={{ scale: 0.95 }}
              className="w-full text-center tracking-[0.15em] font-display font-bold text-xl py-4 bg-surface border-2 border-surface-variant text-white rounded-2xl"
            >
              Create Account
            </motion.div>
          </Link>
        </motion.div>
      </motion.div>

      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="mt-8 text-xs md:text-sm font-bold text-center z-10 text-outline-variant/60 tracking-[0.3em] uppercase"
      >
        Predict • Compete • Glory
      </motion.p>
    </div>
  );
}
