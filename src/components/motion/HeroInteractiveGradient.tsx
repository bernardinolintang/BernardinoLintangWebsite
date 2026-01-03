import React from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";

/**
 * Interactive hero background that makes a soft grey spotlight
 * follow the user's cursor. Falls back to a static gradient when
 * prefers-reduced-motion is enabled.
 */
export const HeroInteractiveGradient: React.FC = () => {
  const prefersReducedMotion = useReducedMotion();

  // Centered by default
  const x = useMotionValue(50);
  const y = useMotionValue(50);

  // Smooth spring for nicer motion and to avoid jank
  const springX = useSpring(x, { stiffness: 80, damping: 20, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 80, damping: 20, mass: 0.4 });

  const backgroundPosition = useTransform(
    [springX, springY],
    (latest) => `${latest[0]}% ${latest[1]}%`,
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const relativeX = ((e.clientX - rect.left) / rect.width) * 100;
    const relativeY = ((e.clientY - rect.top) / rect.height) * 100;
    x.set(relativeX);
    y.set(relativeY);
  };

  const commonGradient =
    "radial-gradient(circle at center, rgba(209, 213, 219, 0.45), transparent 60%)";

  if (prefersReducedMotion) {
    // Static, non-animated gradient for reduced motion users
    return (
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 40%, rgba(209,213,219,0.4), transparent 60%)",
        }}
      />
    );
  }

  return (
    <motion.div
      className="pointer-events-none absolute inset-0"
      onMouseMove={handleMouseMove}
      style={{
        backgroundImage: commonGradient,
        backgroundRepeat: "no-repeat",
        backgroundSize: "140% 140%",
        backgroundPosition,
        mixBlendMode: "soft-light",
      }}
    />
  );
};


