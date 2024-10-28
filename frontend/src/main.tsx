import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./routes/root";
import Login from "./routes/login";
import SignUp from "./routes/signup";
import ErrorBoundary from "./components/error-boundary";
import "./index.css";

const router = createBrowserRouter([
	{
		path: "/",
		element: <Root />,
		errorElement: <ErrorBoundary />,
	},
	{
		path: "login",
		element: <Login />,
		errorElement: <ErrorBoundary />,
	},
	{
		path: "signup",
		element: <SignUp />,
		errorElement: <ErrorBoundary />,
	},
]);

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<RouterProvider router={router} />
	</StrictMode>
);
