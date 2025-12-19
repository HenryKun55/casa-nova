"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}

export function FadeIn({ children, delay = 0, duration = 0.5, className }: FadeInProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface FadeInStaggerProps {
  children: ReactNode[];
  staggerDelay?: number;
  className?: string;
}

export function FadeInStagger({ children, staggerDelay = 0.1, className }: FadeInStaggerProps) {
  return (
    <>
      {children.map((child, index) => (
        <FadeIn key={index} delay={index * staggerDelay} className={className}>
          {child}
        </FadeIn>
      ))}
    </>
  );
}
