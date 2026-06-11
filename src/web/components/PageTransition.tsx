import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

export default function PageTransition({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      style={{ position: 'relative', zIndex: 2, pointerEvents: 'auto' }}
    >
      {children}
    </motion.div>
  )
}
