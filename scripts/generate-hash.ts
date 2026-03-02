import bcrypt from "bcryptjs";

const password = process.argv[2];

if (!password) {
  console.error("Uso: bun scripts/generate-hash.ts <senha>");
  process.exit(1);
}

const hash = await bcrypt.hash(password, 12);
console.log("\nHash gerado:\n");
console.log(hash);
console.log("\nSQL para inserir no Neon:\n");
console.log(
  `INSERT INTO admin_credentials (id, username, password_hash) VALUES ('1', 'admin', '${hash}');`
);
