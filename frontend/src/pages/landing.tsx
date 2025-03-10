import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';


<Navbar /> 
export default function LandingPage() {
  return (
    <div className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600">
      {/* Background Animation */}
      <motion.div
        className="absolute inset-0 w-full h-full bg-opacity-50"
        animate={{ backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
        style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.2) 10%, transparent 70%)', backgroundSize: '200% 200%' }}
      />

      {/* Centered Button */}
      <motion.button
        className="relative z-10 px-6 py-3 text-lg font-semibold text-white bg-blue-600 rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        Start Managing!
      </motion.button>
    </div>
  );
}