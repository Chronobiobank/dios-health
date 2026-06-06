'use client'

import { motion } from 'framer-motion'

import { cn } from '@/lib/utils'

export function DashboardPageTransition({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.15 }}
      className={cn('flex flex-col', className)}
    >
      {children}
    </motion.div>
  )
}
