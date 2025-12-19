"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getAnonymousMode, setAnonymousMode as saveAnonymousMode, APP_CONFIG } from "@/lib/constants/app-config";
import { formatCurrencyInput, parseCurrency } from "@/lib/utils/format";
import { toast } from "sonner";
import { Save, Lock, Target, Calendar, CreditCard } from "lucide-react";

export default function SettingsPage() {
  const [anonymousMode, setAnonymousMode] = useState(false);
  const [fundraisingGoal, setFundraisingGoal] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [pixKey, setPixKey] = useState("");
  const [pixName, setPixName] = useState("");
  const [pixCity, setPixCity] = useState("");
  const [hasChanges, setHasChanges] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setAnonymousMode(getAnonymousMode());
    const goalValue = (APP_CONFIG.fundraisingGoal * 100).toString();
    setFundraisingGoal(formatCurrencyInput(goalValue));
    setEventDate(APP_CONFIG.event.date.toISOString().split('T')[0]);
    setPixKey(APP_CONFIG.pix.key);
    setPixName(APP_CONFIG.pix.name);
    setPixCity(APP_CONFIG.pix.city);
  }, []);

  const handleAnonymousModeChange = (checked: boolean) => {
    setAnonymousMode(checked);
    saveAnonymousMode(checked);
    toast.success(checked ? "Modo anônimo ativado" : "Modo anônimo desativado");
  };

  const handleSave = () => {
    setIsLoading(true);

    const goalValue = parseCurrency(fundraisingGoal);
    if (isNaN(goalValue) || goalValue <= 0) {
      toast.error("Meta deve ser um valor positivo");
      setIsLoading(false);
      return;
    }

    APP_CONFIG.fundraisingGoal = goalValue;
    APP_CONFIG.event.date = new Date(eventDate);
    APP_CONFIG.pix.key = pixKey.trim();
    APP_CONFIG.pix.name = pixName.trim();
    APP_CONFIG.pix.city = pixCity.trim();

    if (typeof window !== 'undefined') {
      localStorage.setItem('fundraisingGoal', goalValue.toString());
      localStorage.setItem('eventDate', eventDate);
      localStorage.setItem('pixKey', pixKey.trim());
      localStorage.setItem('pixName', pixName.trim());
      localStorage.setItem('pixCity', pixCity.trim());
    }

    setHasChanges(false);
    toast.success("Configurações salvas com sucesso!");

    setTimeout(() => {
      window.location.href = '/dashboard';
    }, 1000);
  };

  const handleReset = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('fundraisingGoal');
      localStorage.removeItem('eventDate');
      localStorage.removeItem('anonymousMode');
      localStorage.removeItem('pixKey');
      localStorage.removeItem('pixName');
      localStorage.removeItem('pixCity');
    }

    toast.success("Configurações restauradas para padrão");

    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

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
                  ficarão ocultos na lista pública. Apenas administradores poderão
                  ver quem reservou cada item.
                </p>
              </div>
              <Switch
                id="anonymous-mode"
                checked={anonymousMode}
                onCheckedChange={handleAnonymousModeChange}
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
              <p className="text-sm text-muted-foreground">
                Meta salva: {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(APP_CONFIG.fundraisingGoal)}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              <CardTitle>Informações do Evento</CardTitle>
            </div>
            <CardDescription>
              Detalhes sobre o chá de casa nova
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
            <Separator />
            <div className="space-y-2">
              <Label>Casal</Label>
              <p className="text-sm text-muted-foreground">
                {APP_CONFIG.event.couple}
              </p>
            </div>
            <div className="space-y-2">
              <Label>Nome do Evento</Label>
              <p className="text-sm text-muted-foreground">
                {APP_CONFIG.event.name}
              </p>
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
              <p className="text-xs text-muted-foreground">
                Pode ser CPF, CNPJ, e-mail, telefone ou chave aleatória
              </p>
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
              <p className="text-xs text-muted-foreground">
                Nome que aparecerá no Pix
              </p>
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
              <p className="text-xs text-muted-foreground">
                Cidade do beneficiário
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center justify-between gap-4 p-4 rounded-lg border bg-muted/50">
        <div className="space-y-1">
          <p className="font-medium">Restaurar Configurações Padrão</p>
          <p className="text-sm text-muted-foreground">
            Voltar todas as configurações para os valores iniciais
          </p>
        </div>
        <Button variant="outline" onClick={handleReset}>
          Restaurar
        </Button>
      </div>

      <div className="flex justify-end gap-3">
        <Button
          size="lg"
          onClick={handleSave}
          disabled={!hasChanges || isLoading}
        >
          <Save className="mr-2 h-4 w-4" />
          {isLoading ? "Salvando..." : "Salvar Alterações"}
        </Button>
      </div>
    </div>
  );
}
