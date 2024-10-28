import { MinimalTiptapEditor } from "@/components/minimal-tiptap";
import { Spinner } from "@/components/minimal-tiptap/components/spinner";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useArticle } from "@/hooks/articles";
import { api } from "@/lib/api";
import { articleSchema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { z } from "zod";

type articleSchemaData = z.infer<typeof articleSchema>;

const EditArticle = () => {
	const { id } = useParams();
	const { data, error, isLoading } = useArticle(id!);
	const [stop, setStop] = useState(false);
	const navigate = useNavigate();

	const form = useForm<articleSchemaData>({
		resolver: zodResolver(articleSchema),
		defaultValues: {
			title: "",
			content: "",
		},
		shouldUnregister: false,
	});

	useEffect(() => {
		if (!data) return;
		form.setValue("title", data.article.title);
		form.setValue("content", JSON.parse(data.article.content));
		setStop(true);
	}, [data, form]);

	const mutation = useMutation({
		mutationFn: async (data: articleSchemaData) => {
			return await api
				.patch(`/articles/${id}`, data)
				.then((res) => res.data);
		},
		onSuccess: () => {
			navigate(`/article/${id}`);
		},
		onError(error) {
			if (!isAxiosError(error) || !error.response) {
				form.setError("root", { message: error.message });
				return;
			}

			const response = error.response.data as {
				error: string;
			};
			form.setError("root", { message: response.error });
		},
	});

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
		<div className="flex flex-col size-full p-10">
			<h2 className="text-3xl font-semibold my-4">Edit an article</h2>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit((data) =>
						mutation.mutate(data)
					)}
					className="flex flex-col size-full gap-4"
				>
					<FormField
						control={form.control}
						name="title"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Title</FormLabel>
								<FormControl>
									<Input type="text" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="content"
						render={({ field }) => (
							<FormItem className="size-full pb-6">
								<FormLabel>Content</FormLabel>
								<FormControl>
									<MinimalTiptapEditor
										{...field}
										// weird moment with rerenders
										key={stop ? field.name : field.value}
										value={field.value}
										onChange={(content) => {
											form.setValue(
												"content",
												JSON.stringify(content)
											);
										}}
										className="size-full"
										editorContentClassName="p-5"
										placeholder="Type something..."
										output="json"
									/>
								</FormControl>
							</FormItem>
						)}
					/>

					<Button type="submit" disabled={mutation.isPending}>
						Update
					</Button>
					{form.formState.errors.root && (
						<p className="text-sm text-red-400">
							{form.formState.errors.root.message}
						</p>
					)}
				</form>
			</Form>
		</div>
	);
};

export default EditArticle;
