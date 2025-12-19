import * as XLSX from "xlsx";
import type { ReservationWithProduct } from "@/hooks/use-reservations";

export function exportReservationsToExcel(reservations: ReservationWithProduct[]) {
  const data = reservations.map((reservation) => ({
    "Nome do Convidado": reservation.guestName,
    "Email": reservation.guestEmail || "-",
    "WhatsApp": reservation.whatsapp || "-",
    "Produto": reservation.product.name,
    "Categoria": reservation.product.category || "-",
    "Preço": `R$ ${Number(reservation.product.price).toFixed(2)}`,
    "Cor": reservation.product.color || "-",
    "Status": reservation.confirmed ? "Recebido" : "Pendente",
    "Data da Reserva": new Date(reservation.createdAt).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
    "Mensagem": reservation.message || "-",
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Reservas");

  const maxWidths: { [key: string]: number } = {};
  data.forEach((row) => {
    Object.keys(row).forEach((key) => {
      const value = String(row[key as keyof typeof row]);
      maxWidths[key] = Math.max(maxWidths[key] || 10, value.length);
    });
  });

  worksheet["!cols"] = Object.values(maxWidths).map((width) => ({
    wch: Math.min(width + 2, 50),
  }));

  const fileName = `reservas-cha-casa-nova-${new Date().toISOString().split("T")[0]}.xlsx`;
  XLSX.writeFile(workbook, fileName);
}

export function exportReservationsToCSV(reservations: ReservationWithProduct[]) {
  const data = reservations.map((reservation) => ({
    "Nome do Convidado": reservation.guestName,
    "Email": reservation.guestEmail || "-",
    "WhatsApp": reservation.whatsapp || "-",
    "Produto": reservation.product.name,
    "Categoria": reservation.product.category || "-",
    "Preço": `R$ ${Number(reservation.product.price).toFixed(2)}`,
    "Cor": reservation.product.color || "-",
    "Status": reservation.confirmed ? "Recebido" : "Pendente",
    "Data da Reserva": new Date(reservation.createdAt).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
    "Mensagem": reservation.message || "-",
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const csv = XLSX.utils.sheet_to_csv(worksheet);

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", `reservas-cha-casa-nova-${new Date().toISOString().split("T")[0]}.csv`);
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
