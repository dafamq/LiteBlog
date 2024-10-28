import { signupSchema } from "@/lib/schemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { ISession } from "@/lib/types";
import { Link, useNavigate } from "react-router-dom";
import { isAxiosError } from "axios";

type signupSchemaData = z.infer<typeof signupSchema>;

const SignUp = () => {
	const form = useForm<signupSchemaData>({
		resolver: zodResolver(signupSchema),
		defaultValues: {
			email: "",
			password: "",
			confirmPassword: "",
		},
	});

	const navigate = useNavigate();
	const mutation = useMutation({
		mutationFn: async (data: signupSchemaData) => {
			return await api
				.post<{ session: ISession }>("/signup", data)
				.then((res) => res.data);
		},
		onSuccess: () => navigate("/login"),
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

	return (
		<div className="flex flex-col justify-center items-center h-full">
			<h2 className="text-3xl font-semibold m-4">Sign up</h2>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit((data) =>
						mutation.mutate(data)
					)}
					className="flex flex-col max-w-sm w-full gap-2"
				>
					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Email</FormLabel>
								<FormControl>
									<Input type="email" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="password"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Password</FormLabel>
								<FormControl>
									<Input type="password" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="confirmPassword"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Confirm password</FormLabel>
								<FormControl>
									<Input type="password" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Button type="submit" disabled={mutation.isPending}>
						Submit
					</Button>
					{form.formState.errors.root && (
						<p className="text-sm text-red-400">
							{form.formState.errors.root.message}
						</p>
					)}
					<p className="text-blue-400 text-center">
						Already have an account?{" "}
						<Link to="/login" className="underline">
							login
						</Link>
					</p>
				</form>
			</Form>
		</div>
	);
};

export default SignUp;
