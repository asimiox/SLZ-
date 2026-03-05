import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Frontend from './components/Frontend';

export default function App() {
  return (
    <div className="font-sans">
      <AnimatePresence mode="wait">
        <motion.div key="frontend" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <Frontend />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

