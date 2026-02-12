"use client"

import { type ReactNode, useEffect, useRef } from "react"
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  useSpring,
  useInView,
} from "framer-motion"
import { cn } from "@/lib/utils"

// ==================
// MotionCard - Fade-in card with stagger support
// ==================
interface MotionCardProps {
  children: ReactNode
  delay?: number
  className?: string
  direction?: "up" | "left" | "right"
}

export function MotionCard({
  children,
  delay = 0,
  className,
  direction = "up",
}: MotionCardProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-40px" })

  const directionMap = {
    up: { y: 16, x: 0 },
    left: { y: 0, x: -16 },
    right: { y: 0, x: 16 },
  }

  const offset = directionMap[direction]

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: offset.y, x: offset.x }}
      animate={
        isInView
          ? { opacity: 1, y: 0, x: 0 }
          : { opacity: 0, y: offset.y, x: offset.x }
      }
      transition={{
        duration: 0.45,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ==================
// StaggerContainer - Orchestrates staggered children
// ==================
interface StaggerContainerProps {
  children: ReactNode
  className?: string
  staggerDelay?: number
}

export function StaggerContainer({
  children,
  className,
  staggerDelay = 0.08,
}: StaggerContainerProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ==================
// StaggerItem - Child of StaggerContainer
// ==================
interface StaggerItemProps {
  children: ReactNode
  className?: string
}

export function StaggerItem({ children, className }: StaggerItemProps) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 12 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ==================
// MotionPage - Page enter/exit transition wrapper
// ==================
interface MotionPageProps {
  children: ReactNode
  pageKey: string
}

export function MotionPage({ children, pageKey }: MotionPageProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pageKey}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

// ==================
// AnimatedNumber - Counts from 0 to target
// ==================
interface AnimatedNumberProps {
  value: number
  className?: string
  duration?: number
  formatFn?: (n: number) => string
}

export function AnimatedNumber({
  value,
  className,
  duration = 1.2,
  formatFn,
}: AnimatedNumberProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  const motionValue = useMotionValue(0)
  const springValue = useSpring(motionValue, {
    stiffness: 80,
    damping: 20,
    duration: duration * 1000,
  })
  const display = useTransform(springValue, (latest) => {
    const rounded = Math.round(latest)
    return formatFn ? formatFn(rounded) : String(rounded)
  })

  useEffect(() => {
    if (isInView) {
      motionValue.set(value)
    }
  }, [isInView, value, motionValue])

  return (
    <motion.span ref={ref} className={className}>
      {display}
    </motion.span>
  )
}

// ==================
// ExpandableSection - Animated height expand/collapse
// ==================
interface ExpandableSectionProps {
  isOpen: boolean
  children: ReactNode
  className?: string
}

export function ExpandableSection({
  isOpen,
  children,
  className,
}: ExpandableSectionProps) {
  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          className={className}
          style={{ overflow: "hidden" }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ==================
// MotionNumber - Formatted animated number with prefix/suffix
// ==================
interface MotionNumberProps {
  value: number
  prefix?: string
  suffix?: string
  className?: string
  duration?: number
  formatFn?: (n: number) => string
}

export function MotionNumber({
  value,
  prefix = "",
  suffix = "",
  className,
  duration = 0.8,
  formatFn,
}: MotionNumberProps) {
  return (
    <span className={cn("font-tabular", className)}>
      {prefix}
      <AnimatedNumber value={value} duration={duration} formatFn={formatFn} />
      {suffix}
    </span>
  )
}

// Re-export framer-motion essentials for convenience
export { motion, AnimatePresence, useInView }
