import axios, { isAxiosError } from "axios";

export const api = axios.create({
	baseURL: "http://localhost:3000/api",
});

api.interceptors.request.use((config) => {
	// TODO: get session from storage
	const session = { id: "temp", userId: "temp", expiresAt: "never" };
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
			// TODO: redirect user to login page and remove token
		}

		return Promise.reject(error);
	}
);
