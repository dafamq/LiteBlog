import { useComments } from "@/hooks/comments";
import { Spinner } from "./minimal-tiptap/components/spinner";
import dayjs from "dayjs";
import { useAuth } from "@/stores/auth.store";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "./ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { commentSchema } from "@/lib/schemas";
import { z } from "zod";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { api } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import { isAxiosError } from "axios";

type commentSchemaData = z.infer<typeof commentSchema>;

const Comments = ({ articleId }: { articleId: string }) => {
	const { data, error, isLoading, refetch } = useComments(articleId);
	const form = useForm<commentSchemaData>({
		resolver: zodResolver(commentSchema),
		defaultValues: {
			content: "",
		},
	});
	const auth = useAuth();

	const mutation = useMutation({
		mutationFn: async (data: commentSchemaData) => {
			return await api
				.post(`/comments/${articleId}`, data)
				.then((res) => res.data);
		},
		onSuccess: () => {
			form.reset();
			refetch();
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
		<div className="flex flex-col gap-4">
			{auth.isAuthenticated() ? (
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit((data) => {
							mutation.mutate(data);
						})}
						className="flex flex-col w-full gap-4"
					>
						<FormField
							control={form.control}
							name="content"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Enter comment content</FormLabel>
									<FormControl>
										<Textarea {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button type="submit" disabled={mutation.isPending}>
							Post comment
						</Button>
						{form.formState.errors.root && (
							<p className="text-sm text-red-400">
								{form.formState.errors.root.message}
							</p>
						)}
					</form>
				</Form>
			) : (
				<div className="text-center text-blue-500">
					You must be authorized to post comments
				</div>
			)}

			{data.comments.length === 0 && (
				<div className="text-center font-semibold">
					No comments yet!
				</div>
			)}

			{data.comments.map((comment) => (
				<div
					className="flex justify-between bg-gray-200 rounded-md p-4"
					key={comment.id}
				>
					<p>{comment.content}</p>
					<div>
						{comment.authorId === auth.session?.userId && (
							<Button
								onClick={() => {
									api.delete(`/comments/${comment.id}`).then(
										() => {
											refetch();
										}
									);
								}}
								variant="outline"
								size="sm"
								className="bg-transparent border-gray-900 hover:bg-gray-900 hover:text-white"
							>
								delete
							</Button>
						)}
						<p className="text-gray-500 text-sm">
							{dayjs(comment.createdAt).format("DD/MM/YYYY")}
						</p>
					</div>
				</div>
			))}
		</div>
	);
};

export default Comments;
