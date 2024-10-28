import { Session, User } from "./schemas";

export type Env = {
	Variables: {
		user: User | null;
		session: Session | null;
	};
};
