"use client";

import { type ReactNode, useEffect, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  useSpring,
  useInView,
} from "framer-motion";
import { cn } from "@/lib/utils";

// === Unified Animation Constants ===
// Apple-inspired cubic-bezier for smooth, natural motion
export const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;
export const EASE_IN_OUT = [0.65, 0, 0.35, 1] as const;
export const EASE_SPRING = {
  type: "spring" as const,
  stiffness: 300,
  damping: 30,
};

export const DURATION = {
  micro: 0.15,
  fast: 0.2,
  normal: 0.3,
  slow: 0.45,
  page: 0.35,
} as const;

// Shared entrance variants for consistency
export const fadeSlideUp = {
  initial: { opacity: 0, y: 12, filter: "blur(4px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  exit: { opacity: 0, y: -8, filter: "blur(4px)" },
};

// ==================
// MotionCard - Fade-in card with stagger support
// ==================
interface MotionCardProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  direction?: "up" | "left" | "right";
}

export function MotionCard({
  children,
  delay = 0,
  className,
  direction = "up",
}: MotionCardProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  const directionMap = {
    up: { y: 14, x: 0 },
    left: { y: 0, x: -16 },
    right: { y: 0, x: 16 },
  };

  const offset = directionMap[direction];

  const initialFilter = direction === "up" ? "blur(4px)" : "blur(0px)";
  const animateFilter = "blur(0px)";

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: offset.y, x: offset.x, filter: initialFilter }}
      animate={
        isInView
          ? { opacity: 1, y: 0, x: 0, filter: animateFilter }
          : { opacity: 0, y: offset.y, x: offset.x, filter: initialFilter }
      }
      transition={{
        duration: DURATION.slow,
        delay,
        ease: EASE_OUT_EXPO as unknown as number[],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ==================
// StaggerContainer - Orchestrates staggered children
// ==================
interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
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
  );
}

// ==================
// StaggerItem - Child of StaggerContainer
// ==================
interface StaggerItemProps {
  children: ReactNode;
  className?: string;
}

export function StaggerItem({ children, className }: StaggerItemProps) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 12, filter: "blur(3px)" },
        visible: {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          transition: {
            duration: 0.4,
            ease: EASE_OUT_EXPO as unknown as number[],
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ==================
// MotionPage - Page enter/exit transition wrapper
// ==================
interface MotionPageProps {
  children: ReactNode;
  pageKey: string;
}

export function MotionPage({ children, pageKey }: MotionPageProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pageKey}
        initial={{ opacity: 0, y: 16, filter: "blur(6px)", scale: 0.99 }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)", scale: 1 }}
        exit={{ opacity: 0, y: -12, filter: "blur(6px)", scale: 0.99 }}
        transition={{
          duration: DURATION.page,
          ease: EASE_OUT_EXPO as unknown as number[],
          exit: {
            duration: DURATION.fast,
            ease: EASE_IN_OUT as unknown as number[],
          },
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

// ==================
// AnimatedNumber - Counts from 0 to target
// ==================
interface AnimatedNumberProps {
  value: number;
  className?: string;
  duration?: number;
  formatFn?: (n: number) => string;
}

export function AnimatedNumber({
  value,
  className,
  duration = 1.2,
  formatFn,
}: AnimatedNumberProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    stiffness: 80,
    damping: 20,
    duration: duration * 1000,
  });
  const display = useTransform(springValue, (latest) => {
    const rounded = Math.round(latest);
    return formatFn ? formatFn(rounded) : String(rounded);
  });

  useEffect(() => {
    if (isInView) {
      motionValue.set(value);
    }
  }, [isInView, value, motionValue]);

  return (
    <motion.span ref={ref} className={className}>
      {display}
    </motion.span>
  );
}

// ==================
// ExpandableSection - Animated height expand/collapse
// ==================
interface ExpandableSectionProps {
  isOpen: boolean;
  children: ReactNode;
  className?: string;
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
          transition={{
            duration: DURATION.normal,
            ease: EASE_OUT_EXPO as unknown as number[],
          }}
          className={className}
          style={{ overflow: "hidden" }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ==================
// MotionNumber - Formatted animated number with prefix/suffix
// ==================
interface MotionNumberProps {
  value: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  duration?: number;
  formatFn?: (n: number) => string;
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
  );
}

// ==================
// PageLoadingSkeleton - Animated loading placeholder
// ==================
export function PageLoadingSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: DURATION.fast }}
      className="p-5 space-y-4"
    >
      {/* Simulates a typical page layout */}
      <div className="flex items-center gap-3">
        <div className="h-5 w-32 rounded-md bg-muted animate-pulse" />
        <div className="h-5 w-20 rounded-full bg-muted animate-pulse" />
      </div>
      <div className="grid grid-cols-4 gap-3">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-24 rounded-xl bg-muted/60 animate-pulse"
            style={{ animationDelay: `${i * 100}ms` }}
          />
        ))}
      </div>
      <div
        className="h-64 rounded-xl bg-muted/40 animate-pulse"
        style={{ animationDelay: "300ms" }}
      />
      <div className="grid grid-cols-2 gap-3">
        <div
          className="h-40 rounded-xl bg-muted/40 animate-pulse"
          style={{ animationDelay: "400ms" }}
        />
        <div
          className="h-40 rounded-xl bg-muted/40 animate-pulse"
          style={{ animationDelay: "500ms" }}
        />
      </div>
    </motion.div>
  );
}

// ==================
// AnimatedTitle - TopBar title with smooth transitions
// ==================
interface AnimatedTitleProps {
  title: string;
  subtitle?: string;
}

export function AnimatedTitle({ title, subtitle }: AnimatedTitleProps) {
  return (
    <div>
      <AnimatePresence mode="wait">
        <motion.h1
          key={title}
          initial={{ opacity: 0, y: 6, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -6, filter: "blur(4px)" }}
          transition={{
            duration: DURATION.fast,
            ease: EASE_OUT_EXPO as unknown as number[],
          }}
          className="text-lg font-semibold text-foreground"
        >
          {title}
        </motion.h1>
      </AnimatePresence>
      {subtitle && (
        <AnimatePresence mode="wait">
          <motion.p
            key={subtitle}
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 4 }}
            transition={{
              duration: DURATION.fast,
              ease: EASE_OUT_EXPO as unknown as number[],
              delay: 0.05,
            }}
            className="text-xs text-muted-foreground hidden sm:block"
          >
            {subtitle}
          </motion.p>
        </AnimatePresence>
      )}
    </div>
  );
}
