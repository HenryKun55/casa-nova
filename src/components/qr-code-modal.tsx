"use client";

import { QRCodeSVG } from "qrcode.react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Share2, Copy, Check, Image as ImageIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface QRCodeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  url: string;
  title?: string;
  description?: string;
}

export function QRCodeModal({
  open,
  onOpenChange,
  url,
  title = "Compartilhar Lista",
  description = "Escaneie o QR Code para acessar a lista de presentes",
}: QRCodeModalProps) {
  const [copied, setCopied] = useState(false);
  const [imageCopied, setImageCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Link copiado!");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Erro ao copiar link");
    }
  };

  const handleCopyImage = async () => {
    try {
      const svg = document.getElementById("qr-code");
      if (!svg) return;

      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();

      img.onload = async () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);

        canvas.toBlob(async (blob) => {
          if (blob) {
            try {
              await navigator.clipboard.write([
                new ClipboardItem({ "image/png": blob })
              ]);
              setImageCopied(true);
              toast.success("QR Code copiado como imagem!");
              setTimeout(() => setImageCopied(false), 2000);
            } catch (err) {
              toast.error("Erro ao copiar imagem");
            }
          }
        }, "image/png");
      };

      img.src = "data:image/svg+xml;base64," + btoa(svgData);
    } catch (error) {
      toast.error("Erro ao copiar imagem");
    }
  };

  const handleDownloadQR = () => {
    const svg = document.getElementById("qr-code");
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");

      const downloadLink = document.createElement("a");
      downloadLink.download = "qr-code-lista-presentes.png";
      downloadLink.href = pngFile;
      downloadLink.click();

      toast.success("QR Code baixado!");
    };

    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url,
        });
        toast.success("Compartilhado com sucesso!");
      } catch (error) {
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-6 py-4">
          {/* QR Code */}
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <QRCodeSVG
              id="qr-code"
              value={url}
              size={200}
              level="H"
              includeMargin={true}
            />
          </div>

          {/* URL Display */}
          <div className="w-full rounded-lg bg-muted p-3">
            <p className="break-all text-center text-sm text-muted-foreground">
              {url}
            </p>
          </div>

          <div className="grid w-full grid-cols-2 gap-2">
            <Button variant="outline" size="sm" onClick={handleCopyLink}>
              {copied ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Link Copiado
                </>
              ) : (
                <>
                  <Copy className="mr-2 h-4 w-4" />
                  Copiar Link
                </>
              )}
            </Button>
            <Button variant="outline" size="sm" onClick={handleCopyImage}>
              {imageCopied ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  QR Copiado
                </>
              ) : (
                <>
                  <ImageIcon className="mr-2 h-4 w-4" />
                  Copiar QR
                </>
              )}
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownloadQR}>
              <Download className="mr-2 h-4 w-4" />
              Baixar QR
            </Button>
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="mr-2 h-4 w-4" />
              Compartilhar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
