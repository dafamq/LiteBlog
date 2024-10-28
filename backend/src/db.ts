import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schemas";
import "dotenv/config";

export const db = drizzle(process.env.DATABASE_URL!, { schema });
