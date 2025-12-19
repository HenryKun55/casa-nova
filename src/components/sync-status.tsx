"use client";

import { useEffect, useState } from "react";
import { useOnline } from "@/hooks/use-online";
import { syncManager } from "@/lib/sync/sync-manager";
import { Badge } from "@/components/ui/badge";
import { Cloud, CloudOff, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function SyncStatus() {
  const isOnline = useOnline();
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    const updatePendingCount = async () => {
      const count = await syncManager.getPendingCount();
      setPendingCount(count);
    };

    updatePendingCount();
    const interval = setInterval(updatePendingCount, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isOnline) {
      syncManager.startAutoSync(30000); 
    }

    return () => {
      syncManager.stopAutoSync();
    };
  }, [isOnline]);

  if (!isOnline) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <Badge variant="secondary" className="gap-1.5 bg-amber-100 text-amber-900 dark:bg-amber-900 dark:text-amber-100">
            <CloudOff className="h-3 w-3" />
            Offline
            {pendingCount > 0 && ` (${pendingCount} pendentes)`}
          </Badge>
        </motion.div>
      </AnimatePresence>
    );
  }

  if (pendingCount > 0) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <Badge variant="secondary" className="gap-1.5 bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-100">
            <Loader2 className="h-3 w-3 animate-spin" />
            Sincronizando ({pendingCount})
          </Badge>
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
      >
        <Badge variant="secondary" className="gap-1.5 bg-green-100 text-green-900 dark:bg-green-900 dark:text-green-100">
          <Cloud className="h-3 w-3" />
          Online
        </Badge>
      </motion.div>
    </AnimatePresence>
  );
}
