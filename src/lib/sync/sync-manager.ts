"use client";

import { db, type SyncQueue } from "@/lib/db/local-db";
import { toast } from "sonner";

class SyncManager {
  private isSyncing = false;
  private syncInterval: NodeJS.Timeout | null = null;

  async addToQueue(operation: SyncQueue["operation"], entity: SyncQueue["entity"], entityId: string, data: any) {
    await db.syncQueue.add({
      operation,
      entity,
      entityId,
      data,
      timestamp: new Date().toISOString(),
      retries: 0,
    });
  }

  async syncAll() {
    if (this.isSyncing) {
      console.log("Sync already in progress, skipping...");
      return;
    }

    if (!navigator.onLine) {
      console.log("Device is offline, skipping sync");
      return;
    }

    this.isSyncing = true;

    try {
      const queue = await db.syncQueue.orderBy("timestamp").toArray();

      if (queue.length === 0) {
        console.log("No pending operations to sync");
        return;
      }

      console.log(`Syncing ${queue.length} operations...`);

      for (const item of queue) {
        try {
          await this.syncItem(item);
          await db.syncQueue.delete(item.id!);
        } catch (error) {
          console.error("Error syncing item:", error);

          await db.syncQueue.update(item.id!, {
            retries: item.retries + 1,
            error: error instanceof Error ? error.message : "Unknown error",
          });

          if (item.retries >= 3) {
            toast.error(`Erro ao sincronizar ${item.entity}. Tentaremos novamente.`);
          }
        }
      }

      console.log("Sync completed successfully");
      toast.success("Dados sincronizados com sucesso!");
    } catch (error) {
      console.error("Sync failed:", error);
      toast.error("Erro ao sincronizar dados");
    } finally {
      this.isSyncing = false;
    }
  }

  private async syncItem(item: SyncQueue) {
    const baseUrl = "/api";
    let url = `${baseUrl}/${item.entity === "product" ? "products" : "reservations"}`;
    let method = "POST";

    if (item.operation === "update") {
      url += `/${item.entityId}`;
      method = "PATCH";
    } else if (item.operation === "delete") {
      url += `/${item.entityId}`;
      method = "DELETE";
    }

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: item.operation !== "delete" ? JSON.stringify(item.data) : undefined,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    if (item.entity === "product") {
      await db.products.update(item.entityId, {
        _syncStatus: "synced",
        _lastSync: new Date().toISOString(),
      });
    } else if (item.entity === "reservation") {
      await db.reservations.update(item.entityId, {
        _syncStatus: "synced",
        _lastSync: new Date().toISOString(),
      });
    }
  }

  startAutoSync(intervalMs = 30000) {
    this.stopAutoSync();

    this.syncInterval = setInterval(() => {
      this.syncAll();
    }, intervalMs);

    window.addEventListener("online", () => {
      console.log("Device came online, syncing...");
      this.syncAll();
    });
  }

  stopAutoSync() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }

  async getPendingCount() {
    return await db.syncQueue.count();
  }
}

export const syncManager = new SyncManager();
