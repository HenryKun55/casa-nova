"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, X } from "lucide-react";
import Image from "next/image";

interface ImageViewerModalProps {
  imageUrl: string;
  alt: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ImageViewerModal({
  imageUrl,
  alt,
  open,
  onOpenChange,
}: ImageViewerModalProps) {
  const [zoom, setZoom] = useState(1);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.25, 0.5));
  const handleReset = () => setZoom(1);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[90vw] w-full h-[90vh] p-0">
        <DialogTitle className="sr-only">{alt}</DialogTitle>
        <div className="relative w-full h-full bg-black/95 rounded-lg overflow-hidden">
          <div className="absolute top-4 right-4 z-10 flex gap-2">
            <Button
              variant="secondary"
              size="icon"
              onClick={handleZoomOut}
              disabled={zoom <= 0.5}
              className="bg-black/50 hover:bg-black/70 text-white border-white/20"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              onClick={handleReset}
              className="bg-black/50 hover:bg-black/70 text-white border-white/20 min-w-[60px]"
            >
              {Math.round(zoom * 100)}%
            </Button>
            <Button
              variant="secondary"
              size="icon"
              onClick={handleZoomIn}
              disabled={zoom >= 3}
              className="bg-black/50 hover:bg-black/70 text-white border-white/20"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="bg-black/50 hover:bg-black/70 text-white border-white/20"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="w-full h-full flex items-center justify-center p-8 overflow-auto">
            <div
              style={{
                transform: `scale(${zoom})`,
                transition: "transform 0.2s ease-in-out",
              }}
              className="relative"
            >
              <Image
                src={imageUrl}
                alt={alt}
                width={1200}
                height={1200}
                className="max-w-full max-h-full object-contain"
                style={{ width: "auto", height: "auto", maxHeight: "calc(90vh - 4rem)" }}
                priority
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
