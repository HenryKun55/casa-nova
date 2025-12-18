import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { reservas, produtos } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const whatsapp = searchParams.get("whatsapp");

    if (!whatsapp) {
      return NextResponse.json(
        { error: "WhatsApp é obrigatório" },
        { status: 400 }
      );
    }

    // Normaliza o WhatsApp removendo caracteres especiais
    const whatsappNormalizado = whatsapp.replace(/\D/g, "");

    // Busca todas as reservas do usuário
    const minhasReservas = await db
      .select({
        id: reservas.id,
        nomeConvidado: reservas.nomeConvidado,
        emailConvidado: reservas.emailConvidado,
        whatsapp: reservas.whatsapp,
        mensagem: reservas.mensagem,
        confirmado: reservas.confirmado,
        createdAt: reservas.createdAt,
        produto: {
          id: produtos.id,
          nome: produtos.nome,
          descricao: produtos.descricao,
          preco: produtos.preco,
          cor: produtos.cor,
          imagemUrl: produtos.imagemUrl,
          linkCompra: produtos.linkCompra,
        },
      })
      .from(reservas)
      .innerJoin(produtos, eq(reservas.produtoId, produtos.id))
      .where(eq(reservas.whatsapp, whatsapp))
      .orderBy(reservas.createdAt);

    // Se não encontrou com o formato exato, tenta com normalizado
    if (minhasReservas.length === 0 && whatsappNormalizado) {
      const reservasNormalizadas = await db
        .select({
          id: reservas.id,
          nomeConvidado: reservas.nomeConvidado,
          emailConvidado: reservas.emailConvidado,
          whatsapp: reservas.whatsapp,
          mensagem: reservas.mensagem,
          confirmado: reservas.confirmado,
          createdAt: reservas.createdAt,
          produto: {
            id: produtos.id,
            nome: produtos.nome,
            descricao: produtos.descricao,
            preco: produtos.preco,
            cor: produtos.cor,
            imagemUrl: produtos.imagemUrl,
            linkCompra: produtos.linkCompra,
          },
        })
        .from(reservas)
        .innerJoin(produtos, eq(reservas.produtoId, produtos.id))
        .orderBy(reservas.createdAt);

      // Filtra manualmente comparando números normalizados
      const reservasFiltradas = reservasNormalizadas.filter((r) => {
        const whatsappReservaNormalizado = r.whatsapp?.replace(/\D/g, "") || "";
        return whatsappReservaNormalizado === whatsappNormalizado;
      });

      return NextResponse.json(reservasFiltradas);
    }

    return NextResponse.json(minhasReservas);
  } catch (error) {
    console.error("Erro ao buscar reservas:", error);
    return NextResponse.json(
      { error: "Erro ao buscar reservas" },
      { status: 500 }
    );
  }
}
