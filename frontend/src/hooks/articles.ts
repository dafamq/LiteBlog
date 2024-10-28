import { api } from "@/lib/api";
import { IArticle } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";

type ArticlesResponse = {
	success: boolean;
	count: number;
	articles: IArticle[];
};

type ArticleResponse = {
	success: boolean;
	article: IArticle;
};

export const useArticles = (limit = 20, offset = 0) => {
	return useQuery({
		queryKey: ["articles", limit, offset],
		queryFn: async () => {
			return await api
				.get<ArticlesResponse>(
					`/articles?limit=${limit}&offset=${offset}`
				)
				.then((res) => res.data);
		},
	});
};

export const useArticle = (id: string) => {
	return useQuery({
		queryKey: ["articles", id],
		queryFn: async () => {
			return await api
				.get<ArticleResponse>(`/articles/${id}`)
				.then((res) => res.data);
		},
	});
};
