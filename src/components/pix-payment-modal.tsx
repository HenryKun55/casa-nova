"use client";

import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { APP_CONFIG } from "@/lib/constants/app-config";
import { generatePixPayload } from "@/lib/utils/pix";

interface PixPaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productName: string;
  amount: number;
}

export function PixPaymentModal({
  open,
  onOpenChange,
  productName,
  amount,
}: PixPaymentModalProps) {
  const [copied, setCopied] = useState(false);

  const pixKey = APP_CONFIG.pix.key;
  const pixName = APP_CONFIG.pix.name;
  const pixCity = APP_CONFIG.pix.city;

  if (!pixKey || !pixName || !pixCity) {
    return null;
  }

  const pixPayload = generatePixPayload({
    pixKey,
    description: productName.substring(0, 25),
    merchantName: pixName,
    merchantCity: pixCity,
    amount,
  });

  const handleCopyPixCode = async () => {
    try {
      await navigator.clipboard.writeText(pixPayload);
      setCopied(true);
      toast.success("Código Pix copiado!");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Erro ao copiar código");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Pagamento via Pix</DialogTitle>
          <DialogDescription>
            Escaneie o QR Code ou copie o código para pagar
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-6 py-4">
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <QRCodeSVG
              value={pixPayload}
              size={200}
              level="H"
              includeMargin={true}
            />
          </div>

          <div className="w-full space-y-2">
            <div className="rounded-lg bg-muted p-4">
              <p className="text-sm font-medium mb-1">Valor a pagar</p>
              <p className="text-2xl font-bold text-primary">
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(amount)}
              </p>
            </div>

            <div className="rounded-lg bg-muted p-4">
              <p className="text-sm font-medium mb-1">Produto</p>
              <p className="text-sm text-muted-foreground">{productName}</p>
            </div>

            <div className="rounded-lg bg-muted p-4">
              <p className="text-sm font-medium mb-1">Beneficiário</p>
              <p className="text-sm text-muted-foreground">{pixName}</p>
            </div>
          </div>

          <div className="w-full space-y-2">
            <p className="text-sm font-medium">Código Pix Copia e Cola</p>
            <div className="flex gap-2">
              <div className="flex-1 rounded-lg bg-muted p-3 overflow-hidden">
                <p className="text-xs text-muted-foreground break-all line-clamp-2">
                  {pixPayload}
                </p>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={handleCopyPixCode}
                title="Copiar código Pix"
              >
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="w-full rounded-lg border border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20 p-4">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              <strong>Atenção:</strong> Após realizar o pagamento, o administrador
              confirmará manualmente sua reserva. Você receberá uma confirmação em breve.
            </p>
          </div>

          <Button
            onClick={() => onOpenChange(false)}
            className="w-full"
            variant="outline"
          >
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
