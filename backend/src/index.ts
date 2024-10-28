import "dotenv/config";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { db } from "./db";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { compare, genSalt, hash } from "bcrypt";
import { and, count, eq, sql } from "drizzle-orm";
import { articles, comments, sessions, users } from "./schemas";
import { authMiddleware } from "./auth.middleware";
import dayjs from "dayjs";

const app = new Hono().basePath("/api");

app.use("*", cors());

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
			message: "User has been successfully created",
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

		const [session] = await db
			.insert(sessions)
			.values({
				userId: user.id,
				expiresAt: dayjs().add(14, "day").toDate(),
			})
			.returning();

		return c.json({ success: true, session });
	}
);

app.get("/logout", authMiddleware, async (c) => {
	const session = c.get("session")!;

	await db.delete(sessions).where(eq(sessions.id, session.id));

	return c.json({
		success: true,
		message: "Successfully logged out",
	});
});

app.get("/logout/:id", authMiddleware, async (c) => {
	const user = c.get("user")!;
	const session = c.get("session")!;

	const [deletedSession] = await db
		.delete(sessions)
		.where(and(eq(sessions.id, session.id), eq(sessions.userId, user.id)))
		.returning({ id: sessions.id });

	if (!deletedSession) {
		return c.json({
			success: false,
			message: "Session not found",
		});
	}

	return c.json({
		success: true,
		message: "Successfully logged out",
	});
});

app.get("/user/:id", async (c) => {
	const id = c.req.param("id");

	const user = await db.query.users.findFirst({
		where: eq(users.id, id),
	});

	if (!user) {
		return c.json({ success: false, error: "User not found" }, 404);
	}

	return c.json({
		success: true,
		user: {
			id: user.id,
			email: user.email,
			createdAt: user.createdAt,
		},
	});
});

app.delete("/user", authMiddleware, async (c) => {
	const user = c.get("user")!;

	await db.delete(users).where(eq(users.id, user.id));

	return c.json({
		success: true,
		message: "User has been successfully deleted",
	});
});

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
			success: true,
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

	return c.json({ success: true, article });
});

app.post(
	"/articles",
	authMiddleware,
	zValidator(
		"json",
		z.object({
			title: z.string().min(1).max(255),
			content: z.string(),
		})
	),
	async (c) => {
		const validated = c.req.valid("json");
		const user = c.get("user")!;

		await db.insert(articles).values({
			authorId: user.id,
			title: validated.title,
			content: validated.content,
		});

		return c.json({
			success: true,
			message: "Article has been successfully created",
		});
	}
);

app.patch(
	"/articles/:id",
	authMiddleware,
	zValidator(
		"json",
		z.object({
			title: z.string().min(1).max(255),
			content: z.string(),
		})
	),
	async (c) => {
		const id = c.req.param("id");
		const validated = c.req.valid("json");
		const user = c.get("user")!;

		const [article] = await db
			.update(articles)
			.set({
				title: validated.title,
				content: validated.content,
			})
			.where(and(eq(articles.id, id), eq(articles.authorId, user.id)))
			.returning({ id: articles.id });

		if (!article) {
			return c.json({
				success: false,
				error: "Article not found",
			});
		}

		return c.json({
			success: true,
			message: "Article has been successfully edited",
		});
	}
);

app.delete("/articles/:id", authMiddleware, async (c) => {
	const id = c.req.param("id");
	const user = c.get("user")!;

	const [deletedArticle] = await db
		.delete(articles)
		.where(and(eq(articles.id, id), eq(articles.authorId, user.id)))
		.returning({ id: articles.id });

	if (!deletedArticle) {
		return c.json({
			success: false,
			error: "Article not found",
		});
	}

	return c.json({
		success: true,
		message: "Article has been successfully deleted",
	});
});

app.get("/comments/:articleId", async (c) => {
	const articleId = c.req.param("articleId");

	const foundComments = await db.query.comments.findMany({
		where: eq(comments.articleId, articleId),
	});

	return c.json({
		success: true,
		comments: foundComments,
	});
});

app.post(
	"/comments/:articleId",
	authMiddleware,
	zValidator(
		"json",
		z.object({
			content: z.string().min(1).max(255),
		})
	),
	async (c) => {
		const articleId = c.req.param("articleId");
		const validated = c.req.valid("json");
		const user = c.get("user")!;

		await db.insert(comments).values({
			articleId: articleId,
			authorId: user.id,
			content: validated.content,
		});

		return c.json({
			success: true,
			message: "Comment has been successfully created",
		});
	}
);

app.delete("/comments/:id", authMiddleware, async (c) => {
	const id = c.req.param("id");
	const user = c.get("user")!;

	await db.transaction(async (tx) => {
		const [deletedComment] = await db
			.delete(comments)
			.where(eq(comments.id, id))
			.returning();

		if (!deletedComment) {
			tx.rollback();
			return c.json({
				success: false,
				error: "Comment not found",
			});
		}

		if (deletedComment.authorId !== user.id) {
			const foundArticle = await db.query.articles.findFirst({
				where: and(
					eq(articles.id, deletedComment.articleId),
					eq(articles.authorId, user.id)
				),
			});

			if (!foundArticle) {
				tx.rollback();
				return c.json({
					success: false,
					error: "Comment not found",
				});
			}
		}
	});

	return c.json({
		success: true,
		message: "Comment has been successfully deleted",
	});
});

const port = Number(process.env.PORT) || 3000;
console.log(`Server is running on http://localhost:${port}`);

serve({
	fetch: app.fetch,
	port,
});
