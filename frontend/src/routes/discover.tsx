import { Spinner } from "@/components/minimal-tiptap/components/spinner";
import { Button } from "@/components/ui/button";
import { useArticles } from "@/hooks/articles";
import { getPlainText } from "@/lib/utils";
import { useAuth } from "@/stores/auth.store";
import { Link, useNavigate } from "react-router-dom";

const Discover = () => {
	const { data, error, isLoading } = useArticles();
	const navigate = useNavigate();
	const auth = useAuth();

	if (!data || isLoading) {
		return (
			<div className="flex justify-center items-center h-full">
				<Spinner className="size-8" />
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex flex-col justify-center items-center h-full">
				<span className="text-red-400">Error loading</span>
				<p>{error.message}</p>
			</div>
		);
	}

	return (
		<div className="flex justify-center h-full p-4">
			{data.articles.length === 0 ? (
				<div className="flex flex-col justify-center text-lg font-semibold">
					No articles yet!
					<Button
						onClick={() => {
							navigate(
								auth.isAuthenticated()
									? "/create-article"
									: "/login"
							);
						}}
					>
						Create one
					</Button>
				</div>
			) : (
				<div className="max-w-2xl w-full flex flex-col items-center">
					<div className="flex justify-between py-10 w-full items-center">
						<h2 className="text-2xl">Articles</h2>
						<Button
							onClick={() => {
								navigate(
									auth.isAuthenticated()
										? "/create-article"
										: "/login"
								);
							}}
						>
							Create one
						</Button>
					</div>
					<div className="flex flex-col gap-4 max-w-2xl">
						{data.articles.map((article) => {
							const plainText = getPlainText(article.content);

							return (
								<Link
									to={`/article/${article.id}`}
									className="group"
									key={article.id}
								>
									<div
										className="bg-gray-200 rounded-md p-4"
										key={article.id}
									>
										<h3 className="font-semibold py-2 break-words">
											{article.title}
										</h3>
										<p className="text-ellipsis overflow-hidden line-clamp-3 break-words">
											{plainText}
										</p>
										<p className="text-right cursor-pointer group-hover:underline">
											Читати далі
										</p>
									</div>
								</Link>
							);
						})}
					</div>
				</div>
			)}
		</div>
	);
};

export default Discover;
