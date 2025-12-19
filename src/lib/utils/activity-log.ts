import { db } from "@/db";
import { activityLog } from "@/db/schema";

export type ActivityType =
  | "reservation_created"
  | "reservation_confirmed"
  | "product_created"
  | "product_updated"
  | "product_deleted";

export async function createActivityLog(
  type: ActivityType,
  description: string,
  userId?: string,
  metadata?: Record<string, any>
) {
  try {
    await db.insert(activityLog).values({
      type,
      description,
      userId: userId || null,
      metadata: metadata ? JSON.stringify(metadata) : null,
    });
  } catch (error) {
    console.error("Failed to create activity log:", error);
  }
}
