import "dotenv/config";
import type { Config } from "drizzle-kit";

if (!process.env.DATABASE_URL)
    throw new Error("DATABASE_URL not found in environment");

export default {
    schema: "./src/app/db/schema.ts",
    dialect: "postgresql",
    dbCredentials: {
        url: process.env.DATABASE_URL,
    },
    strict: true,
} satisfies Config;
