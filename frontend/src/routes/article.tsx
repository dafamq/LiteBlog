import { Spinner } from "@/components/minimal-tiptap/components/spinner";
import { useArticle } from "@/hooks/articles";
import { generateHTML, JSONContent } from "@tiptap/core";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Color from "@tiptap/extension-color";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import TextStyle from "@tiptap/extension-text-style";
import StarterKit from "@tiptap/starter-kit";
import { useAuth } from "@/stores/auth.store";
import { Button } from "@/components/ui/button";

const Article = () => {
	const { id } = useParams();
	const { data, error, isLoading } = useArticle(id!);
	const [html, setHtml] = useState("");
	const auth = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		if (!data) return;

		const html = generateHTML(
			JSON.parse(data.article.content) as JSONContent,
			[StarterKit, Image, Link, Color, TextStyle]
		);
		setHtml(html);
	}, [data]);

	if (!data || isLoading)
		return (
			<div className="flex justify-center items-center h-full">
				<Spinner className="size-8" />
			</div>
		);

	if (error)
		return (
			<div className="flex flex-col justify-center items-center h-full">
				<span className="text-red-400">Error loading</span>
				<p>{error.message}</p>
			</div>
		);

	return (
		<div className="flex flex-col items-center">
			<div className="p-4 max-w-2xl w-full">
				<div className="flex justify-between items-center">
					<h1 className="my-8 text-xl">{data?.article.title}</h1>
					{data.article.authorId === auth.session?.userId && (
						<Button
							onClick={() => {
								navigate(`/edit-article/${data.article.id}`);
							}}
							variant="secondary"
						>
							Edit
						</Button>
					)}
				</div>
			</div>
			<div
				className="prose max-w-2xl p-4 pt-0"
				dangerouslySetInnerHTML={{ __html: html }}
			/>
		</div>
	);
};

export default Article;
