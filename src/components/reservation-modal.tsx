"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { COUNTRY_CODES } from "@/lib/constants/countries";
import { formatPhone, getPhoneMaxLength } from "@/lib/utils/phone";
import {
  reservationFormSchema,
  type ReservationFormValues
} from "@/lib/validations/reservation";
import { PixPaymentModal } from "@/components/pix-payment-modal";
import { APP_CONFIG } from "@/lib/constants/app-config";
import confetti from "canvas-confetti";

interface ReservationModalProps {
  product: ProductWithReservation | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ReservationModal({ product, open, onOpenChange }: ReservationModalProps) {
  const createReservation = useCreateReservation();
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPixModal, setShowPixModal] = useState(false);

  const hasPixConfigured = !!(APP_CONFIG.pix.key && APP_CONFIG.pix.name && APP_CONFIG.pix.city);

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

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FF6B4A', '#F97316', '#FCD34D', '#2D5F4F', '#059669'] // Cores Quinta das Alamedas
      });

      if (hasPixConfigured) {
        setTimeout(() => {
          setIsSuccess(false);
          setShowPixModal(true);
        }, 2000);
      } else {
        setTimeout(() => {
          onOpenChange(false);
          setIsSuccess(false);
        }, 2000);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao reservar presente");
    }
  };

  if (!product) return null;

  const formattedPrice = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(product.price));

  const handlePixModalClose = () => {
    setShowPixModal(false);
    onOpenChange(false);
  };

  return (
    <>
      <Dialog open={open && !showPixModal} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px]">
          {isSuccess ? (
            <div className="py-8 text-center">
              <div className="mb-4 text-6xl">🎉</div>
              <DialogTitle className="mb-2 text-2xl">Muito obrigado!</DialogTitle>
              <DialogDescription>
                {hasPixConfigured
                  ? "Sua contribuição foi reservada com muito carinho! Você pode fazer o Pix agora se quiser ❤️"
                  : "Sua contribuição foi guardada com muito carinho! A gente vai amar! ❤️"
                }
              </DialogDescription>
            </div>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>Contribuir com Este Item</DialogTitle>
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
                              maxLength={getPhoneMaxLength(selectedCountry)}
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

      {/* Modal do Pix */}
      {hasPixConfigured && product && (
        <PixPaymentModal
          open={showPixModal}
          onOpenChange={handlePixModalClose}
          productName={product.name}
          amount={Number(product.price)}
        />
      )}
    </>
  );
}
