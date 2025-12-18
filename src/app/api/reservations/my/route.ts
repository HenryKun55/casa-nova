import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { reservations, products } from "@/db/schema";
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

    const normalizedWhatsapp = whatsapp.replace(/\D/g, "");

    const myReservations = await db
      .select({
        id: reservations.id,
        guestName: reservations.guestName,
        guestEmail: reservations.guestEmail,
        whatsapp: reservations.whatsapp,
        message: reservations.message,
        confirmed: reservations.confirmed,
        createdAt: reservations.createdAt,
        product: {
          id: products.id,
          name: products.name,
          description: products.description,
          price: products.price,
          color: products.color,
          imageUrl: products.imageUrl,
          purchaseLink: products.purchaseLink,
        },
      })
      .from(reservations)
      .innerJoin(products, eq(reservations.productId, products.id))
      .where(eq(reservations.whatsapp, whatsapp))
      .orderBy(reservations.createdAt);

    if (myReservations.length === 0 && normalizedWhatsapp) {
      const allReservations = await db
        .select({
          id: reservations.id,
          guestName: reservations.guestName,
          guestEmail: reservations.guestEmail,
          whatsapp: reservations.whatsapp,
          message: reservations.message,
          confirmed: reservations.confirmed,
          createdAt: reservations.createdAt,
          product: {
            id: products.id,
            name: products.name,
            description: products.description,
            price: products.price,
            color: products.color,
            imageUrl: products.imageUrl,
            purchaseLink: products.purchaseLink,
          },
        })
        .from(reservations)
        .innerJoin(products, eq(reservations.productId, products.id))
        .orderBy(reservations.createdAt);

      const filteredReservations = allReservations.filter((r) => {
        const reservationWhatsappNormalized = r.whatsapp?.replace(/\D/g, "") || "";
        return reservationWhatsappNormalized === normalizedWhatsapp;
      });

      return NextResponse.json(filteredReservations);
    }

    return NextResponse.json(myReservations);
  } catch (error) {
    console.error("Erro ao buscar reservas:", error);
    return NextResponse.json(
      { error: "Erro ao buscar reservas" },
      { status: 500 }
    );
  }
}
