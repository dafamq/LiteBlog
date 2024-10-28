import { useAuth } from "@/stores/auth.store";
import { ReactElement } from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }: { children: ReactElement }) => {
	const auth = useAuth();
	if (!auth.isAuthenticated()) {
		return <Navigate to="/login" replace />;
	}

	return children;
};

export default ProtectedRoute;
