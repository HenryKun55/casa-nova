"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getAnonymousMode, setAnonymousMode as saveAnonymousMode, APP_CONFIG } from "@/lib/constants/app-config";
import { toast } from "sonner";

interface SettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsModal({ open, onOpenChange }: SettingsModalProps) {
  const [anonymousMode, setAnonymousMode] = useState(false);
  const [fundraisingGoal, setFundraisingGoal] = useState(APP_CONFIG.fundraisingGoal.toString());
  const [eventDate, setEventDate] = useState(APP_CONFIG.event.date.toISOString().split('T')[0]);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (open) {
      setAnonymousMode(getAnonymousMode());
      setFundraisingGoal(APP_CONFIG.fundraisingGoal.toString());
      setEventDate(APP_CONFIG.event.date.toISOString().split('T')[0]);
      setHasChanges(false);
    }
  }, [open]);

  const handleAnonymousModeChange = (checked: boolean) => {
    setAnonymousMode(checked);
    saveAnonymousMode(checked);
    setHasChanges(true);
    toast.success(checked ? "Modo anônimo ativado" : "Modo anônimo desativado");
    window.dispatchEvent(new Event('storage'));
  };

  const handleSave = () => {
    const goalValue = parseFloat(fundraisingGoal);
    if (isNaN(goalValue) || goalValue <= 0) {
      toast.error("Meta deve ser um valor positivo");
      return;
    }

    APP_CONFIG.fundraisingGoal = goalValue;
    APP_CONFIG.event.date = new Date(eventDate);

    if (typeof window !== 'undefined') {
      localStorage.setItem('fundraisingGoal', goalValue.toString());
      localStorage.setItem('eventDate', eventDate);
    }

    setHasChanges(false);
    toast.success("Configurações salvas com sucesso!");
    onOpenChange(false);
    window.location.reload();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Configurações</DialogTitle>
          <DialogDescription>
            Gerencie as configurações do seu chá de casa nova
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold mb-3">Privacidade</h3>
              <div className="flex items-center justify-between space-x-4 p-3 rounded-lg border bg-card">
                <div className="flex-1 space-y-1">
                  <Label htmlFor="anonymous-mode" className="cursor-pointer">Modo Anônimo</Label>
                  <p className="text-sm text-muted-foreground">
                    Ocultar nomes dos convidados na lista pública
                  </p>
                </div>
                <Switch
                  id="anonymous-mode"
                  checked={anonymousMode}
                  onCheckedChange={handleAnonymousModeChange}
                />
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-sm font-semibold mb-3">Meta de Arrecadação</h3>
              <div className="space-y-2">
                <Label htmlFor="fundraising-goal">Valor da Meta (R$)</Label>
                <Input
                  id="fundraising-goal"
                  type="number"
                  min="0"
                  step="0.01"
                  value={fundraisingGoal}
                  onChange={(e) => {
                    setFundraisingGoal(e.target.value);
                    setHasChanges(true);
                  }}
                  placeholder="15000.00"
                />
                <p className="text-xs text-muted-foreground">
                  Meta atual: {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(APP_CONFIG.fundraisingGoal)}
                </p>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-sm font-semibold mb-3">Informações do Evento</h3>
              <div className="space-y-2">
                <Label htmlFor="event-date">Data do Evento</Label>
                <Input
                  id="event-date"
                  type="date"
                  value={eventDate}
                  onChange={(e) => {
                    setEventDate(e.target.value);
                    setHasChanges(true);
                  }}
                />
                <p className="text-xs text-muted-foreground">
                  Casal: {APP_CONFIG.event.couple}
                </p>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={!hasChanges}>
            Salvar Alterações
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
