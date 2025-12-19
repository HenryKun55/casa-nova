"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { getAnonymousMode, setAnonymousMode as saveAnonymousMode } from "@/lib/constants/app-config";

interface SettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsModal({ open, onOpenChange }: SettingsModalProps) {
  const [anonymousMode, setAnonymousMode] = useState(false);

  useEffect(() => {
    setAnonymousMode(getAnonymousMode());
  }, []);

  const handleAnonymousModeChange = (checked: boolean) => {
    setAnonymousMode(checked);
    saveAnonymousMode(checked);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Configurações</DialogTitle>
          <DialogDescription>
            Gerencie as configurações do seu chá de casa nova
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between space-x-4">
              <div className="flex-1 space-y-1">
                <Label htmlFor="anonymous-mode">Modo Anônimo</Label>
                <p className="text-sm text-muted-foreground">
                  Ocultar nomes dos convidados na lista pública. Apenas
                  administradores poderão ver quem reservou cada presente.
                </p>
              </div>
              <Switch
                id="anonymous-mode"
                checked={anonymousMode}
                onCheckedChange={handleAnonymousModeChange}
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
