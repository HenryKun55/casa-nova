import { z } from "zod";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { produtos } from "@/db/schema";

// Gerar schema automaticamente do Drizzle
export const insertProdutoSchema = createInsertSchema(produtos, {
  nome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  preco: z.string().regex(/^\d+(\.\d{1,2})?$/, "Preço inválido"),
  linkCompra: z.string().url("Link inválido").optional().or(z.literal("")),
  categoria: z.string().optional(),
  cor: z.string().optional(),
  descricao: z.string().optional(),
  imagemUrl: z.string().url("URL da imagem inválida").optional().or(z.literal("")),
  quantidade: z.number().int().min(1).default(1),
  prioridade: z.number().int().min(0).default(0),
});

export const selectProdutoSchema = createSelectSchema(produtos);

// Schema customizado para criação (sem id, createdAt, updatedAt)
export const createProdutoSchema = insertProdutoSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Schema para atualização (todos os campos opcionais)
export const updateProdutoSchema = createProdutoSchema.partial();

export type CreateProdutoInput = z.infer<typeof createProdutoSchema>;
export type UpdateProdutoInput = z.infer<typeof updateProdutoSchema>;
export type ProdutoSelect = z.infer<typeof selectProdutoSchema>;
