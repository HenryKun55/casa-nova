import { z } from "zod";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { products } from "@/db/schema";

// Gerar schema automaticamente do Drizzle
export const insertProductSchema = createInsertSchema(products, {
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/, "Preço inválido"),
  purchaseLink: z.string().url("Link inválido").optional().or(z.literal("")),
  category: z.string().optional(),
  color: z.string().optional(),
  description: z.string().optional(),
  imageUrl: z.string().url("URL da imagem inválida").optional().or(z.literal("")),
  quantity: z.number().int().min(1).default(1),
  priority: z.number().int().min(0).default(0),
});

export const selectProductSchema = createSelectSchema(products);

// Schema customizado para criação (sem id, createdAt, updatedAt)
export const createProductSchema = insertProductSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Schema para atualização (todos os campos opcionais)
export const updateProductSchema = createProductSchema.partial();

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type ProductSelect = z.infer<typeof selectProductSchema>;
