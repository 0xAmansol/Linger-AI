import { config } from "dotenv";
import { defineConfig } from "prisma/config";

// `dotenv/config`'s default auto-load only reads `.env`, not `.env.local` —
// but Next.js itself loads `.env.local` with higher precedence than `.env`.
// Load both here, in the same precedence order, so `prisma db push` /
// `migrate` see the same DATABASE_URL as `next dev` does.
config({ path: ".env.local" });
config();

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env["DATABASE_URL"],
  },
});
