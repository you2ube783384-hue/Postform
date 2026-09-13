"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Scroll-reveal stagger (taste-skill Section 5.C canonical skeleton).
 * Items enter the viewport with a small rise + fade, staggered by index.
 * Motivated by storytelling: content arrives in reading order.
 * Collapses to static output when the user prefers reduced motion.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  step = 0.06,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  step?: number;
  as?: "div" | "section" | "ul" | "li" | "article";
}) {
  const reduce = useReducedMotion();
  const Tag = motion[as] as typeof motion.div;
  return (
    <Tag
      className={cn(className)}
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{
        duration: 0.6,
        delay: delay + step,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </Tag>
  );
}

/**
 * Wraps a grid/list of children so each child reveals staggered.
 * The parent stays a server-renderable element; each child is a
 * motion leaf (client island) with its own delay slot.
 */
export function RevealStagger({
  children,
  className,
  step = 0.06,
}: {
  children: React.ReactNode[];
  className?: string;
  step?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <div className={cn(className)}>
      {children.map((child, i) => (
        <motion.div
          key={i}
          initial={reduce ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{
            duration: 0.6,
            delay: i * step,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          {child}
        </motion.div>
      ))}
    </div>
  );
}
