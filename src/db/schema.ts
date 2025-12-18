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

// ==================== AUTH TABLES (NextAuth) ====================

export const users = pgTable("users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  name: text("name"),
  email: text("email").notNull().unique(),
  emailVerified: timestamp("email_verified", { mode: "date" }),
  image: text("image"),
  isAdmin: boolean("is_admin").notNull().default(false), // Só o casal tem true
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

// ==================== APP TABLES ====================

export const produtos = pgTable("produtos", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  nome: text("nome").notNull(),
  descricao: text("descricao"),
  preco: decimal("preco", { precision: 10, scale: 2 }).notNull(),
  cor: text("cor"),
  linkCompra: text("link_compra"), // URL de onde comprar
  imagemUrl: text("imagem_url"), // URL da imagem uploadada
  categoria: text("categoria"), // Ex: "Cozinha", "Quarto", "Banheiro"
  quantidade: integer("quantidade").notNull().default(1),
  prioridade: integer("prioridade").notNull().default(0),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
});

export const reservas = pgTable("reservas", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  produtoId: text("produto_id")
    .notNull()
    .unique()
    .references(() => produtos.id, { onDelete: "cascade" }),
  nomeConvidado: text("nome_convidado").notNull(),
  emailConvidado: text("email_convidado"),
  whatsapp: text("whatsapp"),
  mensagem: text("mensagem"), // Mensagem carinhosa opcional
  confirmado: boolean("confirmado").notNull().default(false), // Casal pode confirmar recebimento
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
});

// ==================== TYPES ====================

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Produto = typeof produtos.$inferSelect;
export type NewProduto = typeof produtos.$inferInsert;

export type Reserva = typeof reservas.$inferSelect;
export type NewReserva = typeof reservas.$inferInsert;
