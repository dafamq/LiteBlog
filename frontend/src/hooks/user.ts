import { api } from "@/lib/api";
import { IUser } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";

type Response = {
	success: boolean;
	user: IUser;
};

export const useUser = (id: string) => {
	return useQuery({
		queryKey: ["user", id],
		queryFn: async () => {
			return await api
				.get<Response>(`/user/${id}`)
				.then((res) => res.data);
		},
	});
};
