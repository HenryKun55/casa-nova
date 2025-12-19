"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { ComponentProps } from "react";

interface AnimatedBadgeProps extends ComponentProps<typeof Badge> {
  pulse?: boolean;
}

export function AnimatedBadge({ pulse = false, children, className, ...props }: AnimatedBadgeProps) {
  if (!pulse) {
    return <Badge className={className} {...props}>{children}</Badge>;
  }

  return (
    <motion.div
      initial={{ scale: 1 }}
      animate={{ scale: [1, 1.05, 1] }}
      transition={{
        duration: 2,
        repeat: Infinity,
        repeatType: "loop"
      }}
    >
      <Badge className={className} {...props}>{children}</Badge>
    </motion.div>
  );
}
