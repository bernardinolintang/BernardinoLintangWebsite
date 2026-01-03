import React from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";

type RevealProps = {
  children: React.ReactNode;
  /** Delay before the animation starts (seconds) */
  delay?: number;
  /** Initial vertical offset in px (positive moves down) */
  y?: number;
  /** Duration of the animation (seconds) - Apple style: slower, more deliberate */
  duration?: number;
  className?: string;
  /** Optional stagger for children when this wraps a list/container */
  staggerChildren?: number;
  /** Animation style: 'text' (slower) or 'default' */
  variant?: "text" | "default";
};

const makeVariants = (
  y: number,
  duration: number,
  delay: number,
  staggerChildren?: number,
): Variants => ({
  hidden: {
    opacity: 0,
    y,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration,
      // Apple-style easing: smooth, no bounce, no overshoot
      ease: [0.16, 1, 0.3, 1], // Custom cubic-bezier for smooth ease-out
      delay,
      ...(staggerChildren
        ? {
            staggerChildren,
          }
        : {}),
    },
  },
});

export const Reveal: React.FC<RevealProps> = ({
  children,
  delay = 0,
  y = 20, // Slightly reduced for more subtle effect
  duration = 0.6, // Slower, more deliberate (Apple style)
  className,
  staggerChildren,
  variant = "default",
}) => {
  const prefersReducedMotion = useReducedMotion();

  // Respect prefers-reduced-motion: render content statically
  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  // Text animations are slower than images (Apple principle)
  const finalDuration = variant === "text" ? duration * 1.2 : duration;
  const finalY = variant === "text" ? y * 0.8 : y; // Text moves less

  return (
    <motion.div
      className={className}
      variants={makeVariants(finalY, finalDuration, delay, staggerChildren)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.15 }} // Trigger earlier for smoother feel
      style={{ willChange: "transform, opacity" }} // Performance hint
    >
      {children}
    </motion.div>
  );
};


