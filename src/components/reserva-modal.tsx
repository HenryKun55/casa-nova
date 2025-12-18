"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateReserva } from "@/hooks/use-reservas";
import { toast } from "sonner";
import type { ProdutoComReserva } from "@/hooks/use-produtos";
import { Loader2 } from "lucide-react";

const COUNTRY_CODES = {
  BR: { code: "+55", placeholder: "(11) 99999-9999", flag: "🇧🇷", name: "Brasil" },
  US: { code: "+1", placeholder: "(999) 999-9999", flag: "🇺🇸", name: "EUA" },
  AU: { code: "+61", placeholder: "0400 000 000", flag: "🇦🇺", name: "Austrália" },
} as const;

const formatPhone = (value: string, countryCode: keyof typeof COUNTRY_CODES): string => {
  const numbers = value.replace(/\D/g, "");

  if (countryCode === "BR") {
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  }

  if (countryCode === "US") {
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6) return `(${numbers.slice(0, 3)}) ${numbers.slice(3)}`;
    return `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`;
  }

  if (countryCode === "AU") {
    if (numbers.length <= 4) return numbers;
    if (numbers.length <= 7) return `${numbers.slice(0, 4)} ${numbers.slice(4)}`;
    return `${numbers.slice(0, 4)} ${numbers.slice(4, 7)} ${numbers.slice(7, 10)}`;
  }

  return numbers;
};

const reservaFormSchema = z.object({
  nomeConvidado: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  emailConvidado: z.string().email("Email inválido").optional().or(z.literal("")),
  countryCode: z.enum(["BR", "US", "AU"]),
  whatsapp: z.string().optional(),
  mensagem: z.string().optional(),
});

type ReservaFormValues = z.infer<typeof reservaFormSchema>;

interface ReservaModalProps {
  produto: ProdutoComReserva | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ReservaModal({ produto, open, onOpenChange }: ReservaModalProps) {
  const createReserva = useCreateReserva();
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<ReservaFormValues>({
    resolver: zodResolver(reservaFormSchema),
    defaultValues: {
      nomeConvidado: "",
      emailConvidado: "",
      countryCode: "BR",
      whatsapp: "",
      mensagem: "",
    },
  });

  const selectedCountry = form.watch("countryCode");

  const onSubmit = async (data: ReservaFormValues) => {
    if (!produto) return;

    try {
      // Formata o WhatsApp com código do país
      const country = COUNTRY_CODES[data.countryCode];
      const whatsappFormatted = data.whatsapp
        ? `${country.code} ${data.whatsapp}`
        : "";

      await createReserva.mutateAsync({
        produtoId: produto.id,
        nomeConvidado: data.nomeConvidado,
        emailConvidado: data.emailConvidado,
        whatsapp: whatsappFormatted,
        mensagem: data.mensagem,
      });
      setIsSuccess(true);
      toast.success("Presente reservado com sucesso! 🎉");
      form.reset();
      setTimeout(() => {
        onOpenChange(false);
        setIsSuccess(false);
      }, 2000);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao reservar presente");
    }
  };

  if (!produto) return null;

  const precoFormatado = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(produto.preco));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        {isSuccess ? (
          <div className="py-8 text-center">
            <div className="mb-4 text-6xl">🎉</div>
            <DialogTitle className="mb-2 text-2xl">Obrigado!</DialogTitle>
            <DialogDescription>
              Seu presente foi reservado com sucesso. O casal vai adorar!
            </DialogDescription>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Reservar Presente</DialogTitle>
              <DialogDescription>
                {produto.nome} • {precoFormatado}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="nomeConvidado"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Seu Nome *</FormLabel>
                      <FormControl>
                        <Input placeholder="João Silva" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="emailConvidado"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email (opcional)</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="joao@email.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="countryCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>País</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o país" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Object.entries(COUNTRY_CODES).map(([code, country]) => (
                              <SelectItem key={code} value={code}>
                                {country.flag} {country.name} ({country.code})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="whatsapp"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>WhatsApp (opcional)</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="tel"
                            placeholder={COUNTRY_CODES[selectedCountry].placeholder}
                            onChange={(e) => {
                              const formatted = formatPhone(e.target.value, selectedCountry);
                              field.onChange(formatted);
                            }}
                            maxLength={selectedCountry === "BR" ? 15 : selectedCountry === "US" ? 14 : 13}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="mensagem"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mensagem Carinhosa (opcional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Deixe uma mensagem especial para o casal..."
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onOpenChange(false)}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    disabled={createReserva.isPending}
                    className="flex-1"
                  >
                    {createReserva.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Reservando...
                      </>
                    ) : (
                      "Confirmar Reserva"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
