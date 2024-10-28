import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import "dotenv/config";
import { db } from "./db.js";

const app = new Hono().basePath("/api");

app.use(cors());

app.get("/", (c) => {
	return c.text("Hello Hono!");
});

app.get("/test", async (c) => {
	const articles = await db.query.articles.findMany();

	return c.json({ articles });
});

const port = Number(process.env.PORT) || 3000;
console.log(`Server is running on http://localhost:${port}`);

serve({
	fetch: app.fetch,
	port,
});
