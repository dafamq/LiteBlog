import { ISession } from "@/lib/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import dayjs from "dayjs";

type AuthStore = {
	session: ISession | null;
	setSession: (session: ISession | null) => void;
	isAuthenticated: () => boolean;
};

export const useAuth = create<AuthStore>()(
	persist(
		(set, get) => ({
			session: null,
			setSession: (session) => set({ session }),
			isAuthenticated: () => {
				const session = get().session;
				if (!session) return false;
				return dayjs().isBefore(session.expiresAt);
			},
		}),
		{ name: "authStore" }
	)
);
