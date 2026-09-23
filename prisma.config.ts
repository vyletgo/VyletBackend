// prisma.config.ts
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Las migraciones necesitan conexión directa (puerto 5432 / DIRECT_URL).
    // El runtime del cliente usa DATABASE_URL (pooler 6543) a través del adapter-pg,
    // no a través de este config.
    url: process.env["DIRECT_URL"] ?? process.env["DATABASE_URL"],
  },
});