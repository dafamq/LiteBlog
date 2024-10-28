import "dotenv/config";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { db } from "./db";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { compare, genSalt, hash } from "bcrypt";
import { count, eq, sql } from "drizzle-orm";
import { articles, sessions, users } from "./schemas";
import dayjs from "dayjs";

const app = new Hono().basePath("/api");

app.use(cors());

app.post(
	"/signup",
	zValidator(
		"json",
		z.object({
			email: z.string().email(),
			password: z.string().min(8).max(50),
		})
	),
	async (c) => {
		const validated = c.req.valid("json");

		const user = await db.query.users.findFirst({
			where: eq(
				sql`lower(${users.email})`,
				validated.email.toLowerCase()
			),
		});

		if (user) {
			return c.json(
				{
					success: false,
					error: "Email already in use",
				},
				400
			);
		}

		const salt = await genSalt();
		const passwordHash = await hash(validated.password, salt);
		await db.insert(users).values({
			email: validated.email,
			password: passwordHash,
		});

		return c.json({
			success: true,
			message: "User has been created!",
		});
	}
);

app.post(
	"/login",
	zValidator(
		"json",
		z.object({
			email: z.string().email(),
			password: z.string().min(8).max(50),
		})
	),
	async (c) => {
		const validated = c.req.valid("json");

		const user = await db.query.users.findFirst({
			where: eq(
				sql`lower(${users.email})`,
				validated.email.toLowerCase()
			),
		});

		if (!user) {
			return c.json(
				{
					success: false,
					error: "Invalid email or password",
				},
				400
			);
		}

		const isPasswordValid = await compare(
			validated.password,
			user.password
		);

		if (!isPasswordValid) {
			return c.json(
				{
					success: false,
					error: "Invalid email or password",
				},
				400
			);
		}

		const session = await db.insert(sessions).values({
			userId: user.id,
			expiresAt: dayjs().add(14, "day").toDate(),
		});

		return c.json({ session });
	}
);

app.get(
	"/articles",
	zValidator(
		"query",
		z.object({
			limit: z.coerce.number().max(100),
			offset: z.coerce.number(),
		})
	),
	async (c) => {
		const validated = c.req.valid("query");

		const countArticles = await db
			.select({ value: count() })
			.from(articles);

		const foundArticles = await db.query.articles.findMany({
			limit: validated.limit,
			offset: validated.offset,
		});

		return c.json({
			count: countArticles[0].value,
			articles: foundArticles,
		});
	}
);

app.get("/articles/:id", async (c) => {
	const id = c.req.param("id");

	const article = await db.query.articles.findFirst({
		where: eq(articles.id, id),
	});

	if (!article) {
		return c.json({ success: false, error: "Article not found" }, 404);
	}

	return c.json({ article });
});

const port = Number(process.env.PORT) || 3000;
console.log(`Server is running on http://localhost:${port}`);

serve({
	fetch: app.fetch,
	port,
});
