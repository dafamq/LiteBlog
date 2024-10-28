import { User } from "./schemas";

export type Env = {
	Variables: {
		user: User | null;
	};
};
