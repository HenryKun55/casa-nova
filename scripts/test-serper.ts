/**
 * Script para testar a integração com a API do Serper
 *
 * Uso:
 *   bun run scripts/test-serper.ts
 */

import { searchProducts } from "@/lib/services/serper";

async function testSerperAPI() {
  console.log("🔍 Testando API do Serper...\n");

  try {
    // Verifica se a API key está configurada
    const apiKey = process.env.SERPER_API_KEY;
    console.log("✓ API Key presente:", apiKey ? "Sim" : "❌ NÃO");

    if (!apiKey) {
      console.error("\n❌ ERRO: SERPER_API_KEY não está configurada!");
      console.log("Configure a variável de ambiente SERPER_API_KEY no arquivo .env.local");
      process.exit(1);
    }

    console.log("\n📦 Buscando por 'geladeira'...");
    const results = await searchProducts("geladeira");

    console.log(`\n✓ Sucesso! Encontrados ${results.length} produtos\n`);

    // Mostra os 3 primeiros resultados
    console.log("📋 Primeiros 3 resultados:\n");
    results.slice(0, 3).forEach((result, index) => {
      console.log(`${index + 1}. ${result.title}`);
      console.log(`   Preço: ${result.price}`);
      console.log(`   Loja: ${result.source}`);
      console.log(`   Link: ${result.link}`);
      console.log(`   Imagem: ${result.imageUrl || "N/A"}`);
      console.log("");
    });

    console.log("✅ Teste concluído com sucesso!");
    console.log("\n💡 A API está funcionando corretamente!");
    console.log("Se o erro 500 está acontecendo na Vercel, verifique:");
    console.log("  1. Se a variável SERPER_API_KEY está configurada na Vercel");
    console.log("  2. Se você está autenticado (session válida)");
    console.log("  3. Os logs da função na Vercel para mais detalhes\n");

  } catch (error) {
    console.error("\n❌ Erro ao testar API do Serper:");
    console.error(error);
    console.error("\nVerifique:");
    console.log("  1. Se a SERPER_API_KEY está correta");
    console.log("  2. Se você tem internet");
    console.log("  3. Se a API do Serper está online");
    process.exit(1);
  }
}

testSerperAPI();
