import { createMiddleware } from "hono/factory";
import { db } from "./db";
import { eq } from "drizzle-orm";
import { sessions } from "./schemas";
import { Env } from "./types";

export const authMiddleware = createMiddleware<Env>(async (c, next) => {
	const authHeader = c.req.header("Authorization");
	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		return c.json({ error: "Unauthorized" }, 401);
	}

	const sessionWithUser = await db.query.sessions.findFirst({
		where: eq(sessions.id, authHeader.split(" ")[1]),
		with: { user: true },
	});

	if (!sessionWithUser) {
		return c.json({ error: "Unauthorized" }, 401);
	}

	const { user, ...session } = sessionWithUser;
	if (session.expiresAt < new Date()) {
		await db.delete(sessions).where(eq(sessions.id, session.id));
		return c.json({ error: "Unauthorized" }, 401);
	}

	c.set("user", user);
	c.set("session", session);

	await next();
});
