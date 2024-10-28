import { MinimalTiptapEditor } from "@/components/minimal-tiptap";
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
import { api } from "@/lib/api";
import { articleSchema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useForm } from "react-hook-form";
import { z } from "zod";

type articleSchemaData = z.infer<typeof articleSchema>;

const CreateArticle = () => {
	const form = useForm<articleSchemaData>({
		resolver: zodResolver(articleSchema),
		defaultValues: {
			title: "",
			content: "",
		},
	});

	const mutation = useMutation({
		mutationFn: async (data: articleSchemaData) => {
			return await api.post("/articles", data).then((res) => res.data);
		},
		onSuccess: () => {},
		onError(error) {
			if (!isAxiosError(error)) {
				form.setError("root", { message: error.message });
			}
		},
	});

	return (
		<div className="flex flex-col size-full p-10">
			<h2 className="text-3xl font-semibold my-4">Create an article</h2>
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
										autofocus={true}
										editable={true}
										editorClassName="focus:outline-none"
									/>
								</FormControl>
							</FormItem>
						)}
					/>

					<Button type="submit" disabled={mutation.isPending}>
						Create
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

export default CreateArticle;
