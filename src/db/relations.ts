import { relations } from "drizzle-orm";
import { users, accounts, sessions, produtos, reservas } from "./schema";

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

export const produtosRelations = relations(produtos, ({ one }) => ({
  reserva: one(reservas, {
    fields: [produtos.id],
    references: [reservas.produtoId],
  }),
}));

export const reservasRelations = relations(reservas, ({ one }) => ({
  produto: one(produtos, {
    fields: [reservas.produtoId],
    references: [produtos.id],
  }),
}));
