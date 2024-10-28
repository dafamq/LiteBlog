import { isRouteErrorResponse, useRouteError } from "react-router-dom";

const ErrorBoundary = () => {
	const error = useRouteError();
	if (!isRouteErrorResponse(error)) throw error;

	return (
		<div className="h-full flex justify-center items-center">
			<div className="prose text-center">
				<h1 className="text-6xl !m-2">{error.status}</h1>
				<h2 className="text-red-600 !m-2">{error.statusText}</h2>
				<p className="font-semibold">Oops, something went wrong</p>
			</div>
		</div>
	);
};

export default ErrorBoundary;
