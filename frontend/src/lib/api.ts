import { useAuth } from "@/stores/auth.store";
import axios, { isAxiosError } from "axios";

export const api = axios.create({
	baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
	const session = useAuth.getState().session;
	if (session) {
		config.headers.Authorization = `Bearer ${session.id}`;
	}

	return config;
});

api.interceptors.response.use(
	(response) => response,
	(error) => {
		if (
			isAxiosError(error) &&
			error.response &&
			error.response.status === 401
		) {
			useAuth.setState({ session: null });
			window.location.href = "/login";
		}

		return Promise.reject(error);
	}
);
