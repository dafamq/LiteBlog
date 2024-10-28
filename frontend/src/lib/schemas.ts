import { z } from "zod";

export const loginSchema = z.object({
	email: z.string().email(),
	password: z.string().min(8).max(50),
});

export const signupSchema = z
	.object({
		email: z.string().email(),
		password: z.string().min(8).max(50),
		confirmPassword: z.string().min(8).max(50),
	})
	.superRefine((data, ctx) => {
		if (data.password !== data.confirmPassword) {
			ctx.addIssue({
				code: "custom",
				path: ["confirmPassword"],
				message: "Passwords don't match",
			});
		}
	});

export const articleSchema = z.object({
	title: z.string().min(1).max(255),
	content: z.string(),
});

export const commentSchema = z.object({
	content: z.string().min(1).max(255),
});
