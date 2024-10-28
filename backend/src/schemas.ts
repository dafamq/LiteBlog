import { createId } from "@paralleldrive/cuid2";
import { relations, sql } from "drizzle-orm";
import { pgTable, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";

export const users = pgTable(
	"users",
	{
		id: text("id")
			.primaryKey()
			.$defaultFn(() => createId()),
		email: text("email").notNull(),
		password: text("password").notNull(),
		createdAt: timestamp("createdAt", { mode: "date" })
			.notNull()
			.defaultNow(),
	},
	(table) => ({
		emailUniqueIndex: uniqueIndex("emailUniqueIndex").on(
			sql`lower(${table.email})`
		),
	})
);

export const sessions = pgTable("sessions", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => createId()),
	userId: text("userId")
		.references(() => users.id)
		.notNull(),
	expiresAt: timestamp("expiresAt", { mode: "date" }).notNull(),
});

export const articles = pgTable("articles", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => createId()),
	title: text("title").notNull(),
	content: text("content").notNull(),
	authorId: text("authorId")
		.references(() => users.id)
		.notNull(),
	publishedAt: timestamp("publishedAt", { mode: "date" })
		.notNull()
		.defaultNow(),
});

export const comments = pgTable("comments", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => createId()),
	content: text("content").notNull(),
	authorId: text("authorId")
		.references(() => users.id)
		.notNull(),
	articleId: text("articleId")
		.references(() => articles.id)
		.notNull(),
	createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
});

export const userRelations = relations(users, ({ many }) => ({
	sessions: many(sessions),
	articles: many(articles),
	comments: many(comments),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
	user: one(users, {
		fields: [sessions.userId],
		references: [users.id],
	}),
}));

export const articlesRelations = relations(articles, ({ one, many }) => ({
	author: one(users, {
		fields: [articles.authorId],
		references: [users.id],
	}),
	comments: many(comments),
}));

export const commentsRelations = relations(comments, ({ one }) => ({
	author: one(users, {
		fields: [comments.authorId],
		references: [users.id],
	}),
	article: one(articles, {
		fields: [comments.articleId],
		references: [articles.id],
	}),
}));

export type User = typeof users.$inferSelect;
export type Session = typeof sessions.$inferSelect;
export type Article = typeof articles.$inferSelect;
