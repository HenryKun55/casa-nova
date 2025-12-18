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
import { useCreateReservation } from "@/hooks/use-reservations";
import { toast } from "sonner";
import type { ProductWithReservation } from "@/hooks/use-products";
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

const reservationFormSchema = z.object({
  guestName: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  guestEmail: z.string().email("Email inválido").optional().or(z.literal("")),
  countryCode: z.enum(["BR", "US", "AU"]),
  whatsapp: z.string().optional(),
  message: z.string().optional(),
});

type ReservationFormValues = z.infer<typeof reservationFormSchema>;

interface ReservationModalProps {
  product: ProductWithReservation | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ReservationModal({ product, open, onOpenChange }: ReservationModalProps) {
  const createReservation = useCreateReservation();
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<ReservationFormValues>({
    resolver: zodResolver(reservationFormSchema),
    defaultValues: {
      guestName: "",
      guestEmail: "",
      countryCode: "BR",
      whatsapp: "",
      message: "",
    },
  });

  const selectedCountry = form.watch("countryCode");

  const onSubmit = async (data: ReservationFormValues) => {
    if (!product) return;

    try {
      // Formata o WhatsApp com código do país
      const country = COUNTRY_CODES[data.countryCode];
      const whatsappFormatted = data.whatsapp
        ? `${country.code} ${data.whatsapp}`
        : "";

      await createReservation.mutateAsync({
        productId: product.id,
        guestName: data.guestName,
        guestEmail: data.guestEmail,
        whatsapp: whatsappFormatted,
        message: data.message,
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

  if (!product) return null;

  const formattedPrice = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(product.price));

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
                {product.name} • {formattedPrice}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="guestName"
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
                  name="guestEmail"
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
                  name="message"
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
                    disabled={createReservation.isPending}
                    className="flex-1"
                  >
                    {createReservation.isPending ? (
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
