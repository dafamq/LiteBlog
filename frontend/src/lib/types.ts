export interface IUser {
	id: string;
	email: string;
	createdAt: string;
}

export interface ISession {
	id: string;
	userId: string;
	expiresAt: string;
}

export interface IArticle {
	id: string;
	title: string;
	content: string;
	authorId: string;
	createdAt: string;
	updatedAt: string;
}

export interface IComment {
	id: string;
	content: string;
	authorId: string;
	articleId: string;
	createdAt: string;
}
