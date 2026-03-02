"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FadeIn } from "@/components/ui/fade-in";
import { motion } from "framer-motion";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Usuário ou senha inválidos");
      setLoading(false);
    } else {
      window.location.href = "/dashboard";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50 dark:from-stone-950 dark:to-stone-900 p-4">
      <FadeIn delay={0.2}>
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <Card className="w-full max-w-md shadow-lg hover:shadow-2xl transition-shadow duration-300">
            <CardHeader className="space-y-1 text-center">
              <FadeIn delay={0.3}>
                <CardTitle className="text-3xl font-bold">Chá de Casa Nova</CardTitle>
              </FadeIn>
              <FadeIn delay={0.4}>
                <CardDescription>
                  Faça login para gerenciar sua lista de presentes
                </CardDescription>
              </FadeIn>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <FadeIn delay={0.5}>
                  <div className="space-y-2">
                    <Label htmlFor="username">Usuário</Label>
                    <Input
                      id="username"
                      type="text"
                      placeholder="admin"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>
                </FadeIn>
                <FadeIn delay={0.55}>
                  <div className="space-y-2">
                    <Label htmlFor="password">Senha</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </FadeIn>
                {error && (
                  <FadeIn delay={0}>
                    <p className="text-sm text-red-500 text-center">{error}</p>
                  </FadeIn>
                )}
                <FadeIn delay={0.6}>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button type="submit" className="w-full" size="lg" disabled={loading}>
                      {loading ? "Entrando..." : "Entrar"}
                    </Button>
                  </motion.div>
                </FadeIn>
                <FadeIn delay={0.65}>
                  <div className="mt-2 text-center text-sm text-muted-foreground">
                    <p>Apenas administradores autorizados podem acessar</p>
                  </div>
                </FadeIn>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </FadeIn>
    </div>
  );
}
