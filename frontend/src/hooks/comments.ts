import { api } from "@/lib/api";
import { IComment } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";

type CommentsResponse = {
	success: boolean;
	comments: IComment[];
};

export const useComments = (articleId: string) => {
	return useQuery({
		queryKey: ["comments", articleId],
		queryFn: async () => {
			return await api
				.get<CommentsResponse>(`/comments/${articleId}`)
				.then((res) => res.data);
		},
	});
};
