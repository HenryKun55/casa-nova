import { NextRequest, NextResponse } from "next/server";
import { searchProducts } from "@/lib/services/serper";
import { auth } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    console.log("Session:", session ? "Autenticado" : "Não autenticado");

    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { query } = await request.json();
    console.log("Query recebida:", query);

    if (!query || typeof query !== "string") {
      return NextResponse.json(
        { error: "Query de busca é obrigatória" },
        { status: 400 }
      );
    }

    console.log("Iniciando busca no Serper...");
    const results = await searchProducts(query);
    console.log("Resultados encontrados:", results.length);

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Erro detalhado ao buscar produtos:", error);
    console.error("Stack trace:", error instanceof Error ? error.stack : "N/A");
    return NextResponse.json(
      {
        error: "Erro ao buscar produtos",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
