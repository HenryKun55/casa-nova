"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrencyInput, parseCurrency } from "@/lib/utils/format";
import { toast } from "sonner";
import { Save, Lock, Target, Calendar, CreditCard, Loader2 } from "lucide-react";

interface Settings {
  id: string;
  eventDate: string;
  fundraisingGoal: string;
  pixKey: string | null;
  pixName: string | null;
  pixCity: string | null;
  anonymousMode: boolean;
}

export default function SettingsPage() {
  const queryClient = useQueryClient();
  const [fundraisingGoal, setFundraisingGoal] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [pixKey, setPixKey] = useState("");
  const [pixName, setPixName] = useState("");
  const [pixCity, setPixCity] = useState("");
  const [anonymousMode, setAnonymousMode] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);

  const { data: settings, isLoading } = useQuery<Settings>({
    queryKey: ["settings"],
    queryFn: async () => {
      const res = await fetch("/api/settings");
      if (!res.ok) throw new Error("Erro ao carregar configurações");
      return res.json();
    },
  });

  const updateSettings = useMutation({
    mutationFn: async (data: Partial<Settings>) => {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Erro ao salvar configurações");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
      toast.success("Configurações salvas com sucesso!");
      setHasChanges(false);
    },
    onError: () => {
      toast.error("Erro ao salvar configurações");
    },
  });

  useEffect(() => {
    if (settings) {
      const goalValue = (parseFloat(settings.fundraisingGoal) * 100).toString();
      setFundraisingGoal(formatCurrencyInput(goalValue));
      setEventDate(new Date(settings.eventDate).toISOString().split("T")[0]);
      setPixKey(settings.pixKey || "");
      setPixName(settings.pixName || "");
      setPixCity(settings.pixCity || "");
      setAnonymousMode(settings.anonymousMode);
    }
  }, [settings]);

  const handleSave = () => {
    const goalValue = parseCurrency(fundraisingGoal);
    if (isNaN(goalValue) || goalValue <= 0) {
      toast.error("Meta deve ser um valor positivo");
      return;
    }

    updateSettings.mutate({
      eventDate,
      fundraisingGoal: goalValue.toString(),
      pixKey: pixKey.trim() || null,
      pixName: pixName.trim() || null,
      pixCity: pixCity.trim() || null,
      anonymousMode,
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-5 w-72 mt-2" />
        </div>
        <div className="grid gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-4 w-64" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Configurações</h1>
        <p className="text-muted-foreground">
          Gerencie as configurações do seu chá de casa nova
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              <CardTitle>Privacidade</CardTitle>
            </div>
            <CardDescription>
              Controle a visibilidade das informações dos convidados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between space-x-4 p-4 rounded-lg border bg-muted/50">
              <div className="flex-1 space-y-1">
                <Label htmlFor="anonymous-mode" className="cursor-pointer font-medium">
                  Modo Anônimo
                </Label>
                <p className="text-sm text-muted-foreground">
                  Quando ativado, os nomes dos convidados que reservaram presentes
                  ficarão ocultos na lista pública.
                </p>
              </div>
              <Switch
                id="anonymous-mode"
                checked={anonymousMode}
                onCheckedChange={(checked) => {
                  setAnonymousMode(checked);
                  setHasChanges(true);
                }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              <CardTitle>Data do Evento</CardTitle>
            </div>
            <CardDescription>
              Data do chá de casa nova (aparece no countdown da página inicial)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
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
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              <CardTitle>Meta de Arrecadação</CardTitle>
            </div>
            <CardDescription>
              Defina o valor total que você deseja arrecadar
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fundraising-goal">Valor da Meta</Label>
              <Input
                id="fundraising-goal"
                type="text"
                value={fundraisingGoal}
                onChange={(e) => {
                  const formatted = formatCurrencyInput(e.target.value);
                  setFundraisingGoal(formatted);
                  setHasChanges(true);
                }}
                placeholder="R$ 15.000,00"
                className="text-lg font-medium"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              <CardTitle>Pagamento via Pix</CardTitle>
            </div>
            <CardDescription>
              Configure sua chave Pix para receber pagamentos dos convidados
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="pix-key">Chave Pix</Label>
              <Input
                id="pix-key"
                type="text"
                value={pixKey}
                onChange={(e) => {
                  setPixKey(e.target.value);
                  setHasChanges(true);
                }}
                placeholder="email@exemplo.com, CPF, telefone ou chave aleatória"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pix-name">Nome do Beneficiário</Label>
              <Input
                id="pix-name"
                type="text"
                value={pixName}
                onChange={(e) => {
                  setPixName(e.target.value);
                  setHasChanges(true);
                }}
                placeholder="Seu nome completo"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pix-city">Cidade</Label>
              <Input
                id="pix-city"
                type="text"
                value={pixCity}
                onChange={(e) => {
                  setPixCity(e.target.value);
                  setHasChanges(true);
                }}
                placeholder="Sua cidade"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end gap-3">
        <Button
          size="lg"
          onClick={handleSave}
          disabled={!hasChanges || updateSettings.isPending}
        >
          {updateSettings.isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          {updateSettings.isPending ? "Salvando..." : "Salvar Alterações"}
        </Button>
      </div>
    </div>
  );
}
