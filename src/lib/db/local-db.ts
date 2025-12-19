import Dexie, { type Table } from "dexie";
import type { Product } from "@/db/schema";

export interface LocalProduct extends Omit<Product, "createdAt" | "updatedAt"> {
  createdAt: string;
  updatedAt: string;
  reservation?: LocalReservation | null;
  _syncStatus?: "synced" | "pending" | "error";
  _lastSync?: string;
}

export interface LocalReservation {
  id: string;
  productId: string;
  guestName: string;
  guestEmail: string | null;
  whatsapp: string | null;
  message: string | null;
  confirmed: boolean;
  paid: boolean;
  createdAt: string;
  _syncStatus?: "synced" | "pending" | "error";
  _lastSync?: string;
}

export interface SyncQueue {
  id?: number;
  operation: "create" | "update" | "delete";
  entity: "product" | "reservation";
  entityId: string;
  data: any;
  timestamp: string;
  retries: number;
  error?: string;
}

export class LocalDatabase extends Dexie {
  products!: Table<LocalProduct, string>;
  reservations!: Table<LocalReservation, string>;
  syncQueue!: Table<SyncQueue, number>;

  constructor() {
    super("CasaNovaDB");

    this.version(1).stores({
      products: "id, category, name, _syncStatus, _lastSync",
      reservations: "id, productId, guestName, confirmed, paid, _syncStatus, _lastSync",
      syncQueue: "++id, operation, entity, entityId, timestamp",
    });
  }

  async clearAll() {
    await this.products.clear();
    await this.reservations.clear();
    await this.syncQueue.clear();
  }

  async getLastSync() {
    const products = await this.products.toArray();
    const reservations = await this.reservations.toArray();

    const allSyncDates = [
      ...products.map(p => p._lastSync),
      ...reservations.map(r => r._lastSync),
    ].filter(Boolean) as string[];

    if (allSyncDates.length === 0) return null;

    return new Date(Math.max(...allSyncDates.map(d => new Date(d).getTime())));
  }
}

export const db = new LocalDatabase();
