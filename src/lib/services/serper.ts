export interface SerperShoppingResult {
  title: string;
  link: string;
  source: string;
  price: string;
  imageUrl?: string;
  rating?: number;
  ratingCount?: number;
  delivery?: string;
}

export interface SerperSearchResponse {
  shopping?: Array<{
    title: string;
    link: string;
    source: string;
    price: string;
    imageUrl?: string;
    rating?: number;
    ratingCount?: number;
    delivery?: string;
  }>;
}

export async function searchProducts(query: string): Promise<SerperShoppingResult[]> {
  const apiKey = process.env.SERPER_API_KEY;

  if (!apiKey) {
    throw new Error("SERPER_API_KEY não configurada");
  }

  try {
    const response = await fetch("https://google.serper.dev/shopping", {
      method: "POST",
      headers: {
        "X-API-KEY": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        q: query,
        gl: "br",
        hl: "pt-br",
        num: 20,
      }),
    });

    if (!response.ok) {
      throw new Error(`Serper API error: ${response.status}`);
    }

    const data: SerperSearchResponse = await response.json();

    if (!data.shopping || data.shopping.length === 0) {
      return [];
    }

    return data.shopping.map((result) => ({
      title: result.title,
      link: result.link,
      source: result.source,
      price: result.price,
      imageUrl: result.imageUrl,
      rating: result.rating,
      ratingCount: result.ratingCount,
      delivery: result.delivery,
    }));
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    throw error;
  }
}

export function parsePrice(priceString: string): number {
  const cleaned = priceString.replace(/[^\d,]/g, "").replace(",", ".");
  return parseFloat(cleaned) || 0;
}

export function detectCategory(title: string): string | null {
  const titleLower = title.toLowerCase();

  if (
    titleLower.includes("geladeira") ||
    titleLower.includes("refrigerador") ||
    titleLower.includes("freezer")
  ) {
    return "Eletrodomésticos";
  }

  if (
    titleLower.includes("fogão") ||
    titleLower.includes("cooktop") ||
    titleLower.includes("forno")
  ) {
    return "Eletrodomésticos";
  }

  if (
    titleLower.includes("microondas") ||
    titleLower.includes("air fryer") ||
    titleLower.includes("liquidificador") ||
    titleLower.includes("batedeira")
  ) {
    return "Eletrodomésticos";
  }

  if (
    titleLower.includes("sofá") ||
    titleLower.includes("poltrona") ||
    titleLower.includes("cadeira")
  ) {
    return "Móveis";
  }

  if (
    titleLower.includes("cama") ||
    titleLower.includes("colchão") ||
    titleLower.includes("guarda-roupa") ||
    titleLower.includes("armário")
  ) {
    return "Móveis";
  }

  if (
    titleLower.includes("mesa") ||
    titleLower.includes("rack") ||
    titleLower.includes("estante")
  ) {
    return "Móveis";
  }

  if (
    titleLower.includes("panela") ||
    titleLower.includes("jogo de panelas") ||
    titleLower.includes("frigideira")
  ) {
    return "Utensílios";
  }

  if (
    titleLower.includes("prato") ||
    titleLower.includes("copo") ||
    titleLower.includes("talher") ||
    titleLower.includes("jogo de jantar")
  ) {
    return "Utensílios";
  }

  if (
    titleLower.includes("toalha") ||
    titleLower.includes("lençol") ||
    titleLower.includes("edredom") ||
    titleLower.includes("travesseiro")
  ) {
    return "Cama, Mesa e Banho";
  }

  if (
    titleLower.includes("cortina") ||
    titleLower.includes("tapete") ||
    titleLower.includes("almofada")
  ) {
    return "Decoração";
  }

  if (
    titleLower.includes("luminária") ||
    titleLower.includes("lustre") ||
    titleLower.includes("abajur")
  ) {
    return "Decoração";
  }

  return null;
}
