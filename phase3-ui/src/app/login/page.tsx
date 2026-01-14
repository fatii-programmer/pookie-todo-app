'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = () => {
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-pookie-gradient flex items-center justify-center p-4 relative overflow-hidden">
      {/* Floating Shapes Background */}
      <FloatingShapes />

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Pookie Logo */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5, ease: [0, 0, 0.2, 1] }}
          className="flex justify-center mb-8"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-48 h-48 md:w-64 md:h-64 bg-gradient-to-br from-lavender-200 to-mint-200
              rounded-full flex items-center justify-center shadow-2xl"
          >
            <span className="text-8xl md:text-9xl">🐰</span>
          </motion.div>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.4 }}
          className="text-4xl md:text-5xl font-display font-bold text-center text-neutral-900 mb-4"
        >
          Hey! I'm Pookie 👋
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.4 }}
          className="text-lg md:text-xl text-center text-neutral-500 mb-12"
        >
          Your friendly task companion
        </motion.p>

        {/* Auth Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.4 }}
          className="space-y-4"
        >
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.3 }}
            whileHover={{ y: -4, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogin}
            className="w-full glass-strong py-4 px-8 rounded-2xl shadow-lg
              flex items-center justify-center gap-3
              hover:border-lavender-300 border-2 border-transparent
              transition-all duration-200 group"
          >
            <span className="text-2xl">🔐</span>
            <span className="text-base font-medium text-neutral-900">Continue with Google</span>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6, duration: 0.3 }}
            whileHover={{ y: -4, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogin}
            className="w-full glass-strong py-4 px-8 rounded-2xl shadow-lg
              flex items-center justify-center gap-3
              hover:border-mint-300 border-2 border-transparent
              transition-all duration-200 group"
          >
            <span className="text-2xl">✉️</span>
            <span className="text-base font-medium text-neutral-900">Continue with Email</span>
          </motion.button>
        </motion.div>

        {/* Footer Text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 0.5 }}
          className="text-sm text-neutral-400 text-center mt-8"
        >
          No account needed - just vibes
        </motion.p>
      </motion.div>
    </div>
  );
}

function FloatingShapes() {
  const shapes = [
    { size: 100, color: 'lavender', delay: 0, duration: 8 },
    { size: 150, color: 'mint', delay: 1, duration: 10 },
    { size: 80, color: 'peach', delay: 2, duration: 7 },
    { size: 120, color: 'rose', delay: 0.5, duration: 9 },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden">
      {shapes.map((shape, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0.1, 0.3, 0.1],
            x: [0, 100, 0],
            y: [0, -100, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            delay: shape.delay,
            duration: shape.duration,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className={`absolute rounded-full blur-3xl`}
          style={{
            width: shape.size,
            height: shape.size,
            top: `${Math.random() * 80}%`,
            left: `${Math.random() * 80}%`,
            background:
              shape.color === 'lavender'
                ? 'radial-gradient(circle, rgba(168, 126, 255, 0.3) 0%, transparent 70%)'
                : shape.color === 'mint'
                ? 'radial-gradient(circle, rgba(45, 255, 179, 0.3) 0%, transparent 70%)'
                : shape.color === 'peach'
                ? 'radial-gradient(circle, rgba(255, 142, 100, 0.3) 0%, transparent 70%)'
                : 'radial-gradient(circle, rgba(255, 107, 150, 0.3) 0%, transparent 70%)',
          }}
        />
      ))}
    </div>
  );
}
