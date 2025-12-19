"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FadeIn } from "@/components/ui/fade-in";
import { motion } from "framer-motion";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const handleLogin = async () => {
    await signIn("google", { callbackUrl: "/dashboard" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-100 dark:from-slate-950 dark:to-green-950 p-4">
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
              <FadeIn delay={0.5}>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button onClick={handleLogin} className="w-full" size="lg">
              <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Entrar com Google
                  </Button>
                </motion.div>
              </FadeIn>
              <FadeIn delay={0.6}>
                <div className="mt-6 text-center text-sm text-muted-foreground">
                  <p>Apenas administradores autorizados podem acessar</p>
                </div>
              </FadeIn>
            </CardContent>
          </Card>
        </motion.div>
      </FadeIn>
    </div>
  );
}
