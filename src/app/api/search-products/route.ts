import { NextRequest, NextResponse } from "next/server";
import { searchProducts } from "@/lib/services/serper";
import { auth } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { query } = await request.json();

    if (!query || typeof query !== "string") {
      return NextResponse.json(
        { error: "Query de busca é obrigatória" },
        { status: 400 }
      );
    }

    const results = await searchProducts(query);

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    return NextResponse.json(
      { error: "Erro ao buscar produtos" },
      { status: 500 }
    );
  }
}
