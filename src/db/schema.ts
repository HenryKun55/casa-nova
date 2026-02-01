import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
  decimal,
  primaryKey,
} from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";

export const users = pgTable("users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  name: text("name"),
  email: text("email").notNull().unique(),
  emailVerified: timestamp("email_verified", { mode: "date" }),
  image: text("image"),
  isAdmin: boolean("is_admin").notNull().default(false),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
});

export const accounts = pgTable(
  "accounts",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("provider_account_id").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

export const sessions = pgTable("sessions", {
  sessionToken: text("session_token").notNull().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verification_tokens",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (verificationToken) => ({
    compositePk: primaryKey({
      columns: [verificationToken.identifier, verificationToken.token],
    }),
  })
);

export const products = pgTable("products", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  name: text("name").notNull(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  color: text("color"),
  purchaseLink: text("purchase_link"),
  imageUrl: text("image_url"),
  category: text("category"),
  quantity: integer("quantity").notNull().default(1),
  priority: integer("priority").notNull().default(0),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
});

export const reservations = pgTable("reservations", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  productId: text("product_id")
    .notNull()
    .unique()
    .references(() => products.id, { onDelete: "cascade" }),
  guestName: text("guest_name").notNull(),
  guestEmail: text("guest_email"),
  whatsapp: text("whatsapp"),
  message: text("message"),
  confirmed: boolean("confirmed").notNull().default(false),
  paid: boolean("paid").notNull().default(false),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
});

export const activityLog = pgTable("activity_log", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  type: text("type").notNull(),
  description: text("description").notNull(),
  userId: text("user_id").references(() => users.id, { onDelete: "set null" }),
  metadata: text("metadata"),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
});

export const settings = pgTable("settings", {
  id: text("id").primaryKey().default("main"),
  eventDate: timestamp("event_date", { mode: "date" }).notNull(),
  fundraisingGoal: decimal("fundraising_goal", { precision: 10, scale: 2 }).notNull().default("15000"),
  pixKey: text("pix_key"),
  pixName: text("pix_name"),
  pixCity: text("pix_city"),
  anonymousMode: boolean("anonymous_mode").notNull().default(true),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;

export type Reservation = typeof reservations.$inferSelect;
export type NewReservation = typeof reservations.$inferInsert;

export type ActivityLog = typeof activityLog.$inferSelect;
export type NewActivityLog = typeof activityLog.$inferInsert;

export type Settings = typeof settings.$inferSelect;
export type NewSettings = typeof settings.$inferInsert;
