import { Spinner } from "@/components/minimal-tiptap/components/spinner";
import { useArticles } from "@/hooks/articles";

const Discover = () => {
	const { data, error, isLoading } = useArticles();

	if (!data || isLoading) return <Spinner className="size-8" />;
	if (error) return <div>Error loading {error.message}</div>;

	return (
		<div className="flex justify-center h-full">
			{data.articles.length === 0 ? (
				<div className="flex items-center text-lg font-semibold">
					No articles yet!
				</div>
			) : (
				<div className="max-w-md w-full flex flex-col items-center">
					{data.articles.map((article) => (
						<div>
							<h1>{article.title}</h1>
							<p className="">{article.content}</p>
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default Discover;
