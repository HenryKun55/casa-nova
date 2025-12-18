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
import { useCreateProduto, useUpdateProduto, type ProdutoComReserva } from "@/hooks/use-produtos";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const produtoFormSchema = z.object({
  nome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  descricao: z.string().optional(),
  preco: z.string().regex(/^\d+(\.\d{1,2})?$/, "Preço inválido (use formato: 99.99)"),
  cor: z.string().optional(),
  linkCompra: z.string().url("Link inválido").optional().or(z.literal("")),
  imagemUrl: z.string().url("URL da imagem inválida").optional().or(z.literal("")),
  categoria: z.string().optional(),
  quantidade: z.number().int().min(1),
  prioridade: z.number().int().min(0),
});

type ProdutoFormValues = z.infer<typeof produtoFormSchema>;

interface ProdutoFormProps {
  produto?: ProdutoComReserva;
  onSuccess?: () => void;
}

export function ProdutoForm({ produto, onSuccess }: ProdutoFormProps) {
  const createProduto = useCreateProduto();
  const updateProduto = useUpdateProduto(produto?.id || "");
  const isEditing = !!produto;

  const form = useForm<ProdutoFormValues>({
    resolver: zodResolver(produtoFormSchema),
    defaultValues: {
      nome: produto?.nome || "",
      descricao: produto?.descricao || "",
      preco: produto?.preco || "",
      cor: produto?.cor || "",
      linkCompra: produto?.linkCompra || "",
      imagemUrl: produto?.imagemUrl || "",
      categoria: produto?.categoria || "",
      quantidade: produto?.quantidade || 1,
      prioridade: produto?.prioridade || 0,
    },
  });

  const onSubmit = async (data: ProdutoFormValues) => {
    try {
      if (isEditing) {
        await updateProduto.mutateAsync(data);
        toast.success("Produto atualizado com sucesso!");
      } else {
        await createProduto.mutateAsync(data);
        toast.success("Produto criado com sucesso!");
        form.reset();
      }
      onSuccess?.();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao salvar produto");
    }
  };

  const isLoading = createProduto.isPending || updateProduto.isPending;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="nome"
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
            name="preco"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preço *</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: 199.90" {...field} />
                </FormControl>
                <FormDescription>Use ponto para separar centavos</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="descricao"
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
            name="categoria"
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
            name="cor"
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
            name="quantidade"
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
            name="linkCompra"
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
            name="imagemUrl"
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
          name="prioridade"
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
