"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useCreateProduct, useUpdateProduct, type ProductWithReservation } from "@/hooks/use-products";
import { formatCurrencyInput, parseCurrency } from "@/lib/utils/format";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const productFormSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  description: z.string().optional(),
  price: z.string().min(1, "Preço é obrigatório"),
  color: z.string().optional(),
  purchaseLink: z.url("Link inválido").optional().or(z.literal("")),
  imageUrl: z.url("URL da imagem inválida").optional().or(z.literal("")),
  category: z.string().optional(),
  quantity: z.number().int().min(1),
  priority: z.number().int().min(0),
});

type ProductFormValues = z.infer<typeof productFormSchema>;

interface ProductFormProps {
  product?: ProductWithReservation;
  onSuccess?: () => void;
  initialData?: {
    name?: string;
    price?: string;
    imageUrl?: string;
    purchaseLink?: string;
    category?: string | null;
  };
}

export function ProductForm({ product, onSuccess, initialData }: ProductFormProps) {
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct(product?.id || "");
  const isEditing = !!product;

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: initialData?.name || product?.name || "",
      description: product?.description || "",
      price: initialData?.price
        ? formatCurrencyInput((parseFloat(initialData.price) * 100).toString())
        : product
        ? formatCurrencyInput((parseFloat(product.price) * 100).toString())
        : "",
      color: product?.color || "",
      purchaseLink: initialData?.purchaseLink || product?.purchaseLink || "",
      imageUrl: initialData?.imageUrl || product?.imageUrl || "",
      category: initialData?.category || product?.category || "",
      quantity: product?.quantity || 1,
      priority: product?.priority || 0,
    },
  });

  const onSubmit = async (data: ProductFormValues) => {
    try {
      const priceValue = parseCurrency(data.price);

      const productData = {
        ...data,
        price: priceValue.toFixed(2),
      };

      if (isEditing) {
        await updateProduct.mutateAsync(productData);
        toast.success("Produto atualizado com sucesso!");
      } else {
        await createProduct.mutateAsync(productData);
        toast.success("Produto criado com sucesso!");
        form.reset();
      }
      onSuccess?.();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao salvar produto");
    }
  };

  const isLoading = createProduct.isPending || updateProduct.isPending;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome do Produto *</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Jogo de Panelas" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preço *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="R$ 0,00"
                    {...field}
                    onChange={(e) => {
                      const formatted = formatCurrencyInput(e.target.value);
                      field.onChange(formatted);
                    }}
                    className="font-medium"
                  />
                </FormControl>
                <FormDescription>Digite o valor em reais</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Descreva o produto..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-6 md:grid-cols-3">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Categoria</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Cozinha" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="color"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cor</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Vermelho" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantidade</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="purchaseLink"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Link para Compra</FormLabel>
                <FormControl>
                  <Input placeholder="https://..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>URL da Imagem</FormLabel>
                <FormControl>
                  <Input placeholder="https://..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="priority"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Prioridade</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormDescription>
                Produtos com maior prioridade aparecem primeiro (0 = menor prioridade)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : isEditing ? (
              "Atualizar Produto"
            ) : (
              "Criar Produto"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
