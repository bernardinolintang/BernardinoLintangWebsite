import * as React from "react";
import { motion, useReducedMotion, type MotionProps } from "framer-motion";

import { cn } from "./utils";

type CardProps = React.ComponentProps<typeof motion.div>;

function Card({ className, ...props }: CardProps) {
  const prefersReducedMotion = useReducedMotion();

  const motionHoverProps: MotionProps = prefersReducedMotion
    ? {}
    : {
        whileHover: {
          scale: 1.01, // Apple-style: very subtle (1.01-1.02)
          y: -2, // Slight lift for elevation
          boxShadow: "0 12px 40px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04)", // Soft, wide shadow
        },
        whileTap: { scale: 0.99, y: 0 },
        transition: {
          duration: 0.2, // Apple-style: 150-250ms
          ease: [0.16, 1, 0.3, 1], // Smooth ease-out, no bounce
        },
      };

  return (
    <motion.div
      data-slot="card"
      className={cn(
        "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border shadow-sm",
        "transition-all duration-200 will-change-transform",
        "hover:shadow-md", // Fallback for non-motion hover
        className,
      )}
      {...motionHoverProps}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 pt-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className,
      )}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <h4
      data-slot="card-title"
      className={cn("leading-none", className)}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <p
      data-slot="card-description"
      className={cn("text-muted-foreground", className)}
      {...props}
    />
  );
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className,
      )}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-6 [&:last-child]:pb-6", className)}
      {...props}
    />
  );
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center px-6 pb-6 [.border-t]:pt-6", className)}
      {...props}
    />
  );
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
};
