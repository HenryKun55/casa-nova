import { z } from "zod";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { reservations } from "@/db/schema";

// Gerar schema automaticamente do Drizzle
export const insertReservationSchema = createInsertSchema(reservations, {
  guestName: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  guestEmail: z
    .string()
    .email("Email inválido")
    .optional()
    .or(z.literal("")),
  whatsapp: z.string().optional(),
  message: z.string().optional(),
});

export const selectReservationSchema = createSelectSchema(reservations);

// Schema customizado para criação (sem id, createdAt, confirmado)
export const createReservationSchema = insertReservationSchema.omit({
  id: true,
  createdAt: true,
  confirmed: true,
});

// Schema para atualização (marcar como confirmado)
export const updateReservationSchema = z.object({
  confirmed: z.boolean(),
});

export type CreateReservationInput = z.infer<typeof createReservationSchema>;
export type UpdateReservationInput = z.infer<typeof updateReservationSchema>;
export type ReservationSelect = z.infer<typeof selectReservationSchema>;
