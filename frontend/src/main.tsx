import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Root from "./routes/root";
import Login from "./routes/login";
import Home from "./routes/home";
import SignUp from "./routes/signup";
import Discover from "./routes/discover";
import Profile from "./routes/profile";
import ProtectedRoute from "./components/protected-route";
import CreateArticle from "./routes/create-article";
import Article from "./routes/article";
import EditArticle from "./routes/edit-article";
import ErrorBoundary from "./components/error-boundary";
import "./index.css";

const queryClient = new QueryClient();

const router = createBrowserRouter([
	{
		path: "/",
		element: <Root />,
		errorElement: <ErrorBoundary />,
		children: [
			{ index: true, element: <Home /> },
			{
				path: "/login",
				element: <Login />,
			},
			{
				path: "/signup",
				element: <SignUp />,
			},
			{
				path: "/discover",
				element: <Discover />,
			},
			{
				path: "/article/:id",
				element: <Article />,
			},
			{
				path: "/",
				element: (
					<ProtectedRoute>
						<Outlet />
					</ProtectedRoute>
				),
				children: [
					{
						path: "/profile",
						element: <Profile />,
					},
					{
						path: "/create-article",
						element: <CreateArticle />,
					},
					{
						path: "/edit-article/:id",
						element: <EditArticle />,
					},
				],
			},
		],
	},
]);

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<QueryClientProvider client={queryClient}>
			<RouterProvider router={router} />
		</QueryClientProvider>
	</StrictMode>
);
