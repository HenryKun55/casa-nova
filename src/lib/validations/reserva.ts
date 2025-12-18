import { z } from "zod";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { reservas } from "@/db/schema";

// Gerar schema automaticamente do Drizzle
export const insertReservaSchema = createInsertSchema(reservas, {
  nomeConvidado: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  emailConvidado: z
    .string()
    .email("Email inválido")
    .optional()
    .or(z.literal("")),
  telefone: z.string().optional(),
  mensagem: z.string().optional(),
});

export const selectReservaSchema = createSelectSchema(reservas);

// Schema customizado para criação (sem id, createdAt, confirmado)
export const createReservaSchema = insertReservaSchema.omit({
  id: true,
  createdAt: true,
  confirmado: true,
});

// Schema para atualização (marcar como confirmado)
export const updateReservaSchema = z.object({
  confirmado: z.boolean(),
});

export type CreateReservaInput = z.infer<typeof createReservaSchema>;
export type UpdateReservaInput = z.infer<typeof updateReservaSchema>;
export type ReservaSelect = z.infer<typeof selectReservaSchema>;
