import { Spinner } from "@/components/minimal-tiptap/components/spinner";
import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/user";
import { api } from "@/lib/api";
import { useAuth } from "@/stores/auth.store";
import dayjs from "dayjs";

const Profile = () => {
	const auth = useAuth();
	const { data, isLoading } = useUser(auth.session!.userId);

	return (
		<div className="flex flex-col justify-center items-center h-full">
			<img
				src="https://i.pravatar.cc/150?img=51"
				alt="avatar"
				className="size-40 rounded-full overflow-hidden shadow-md shadow-black/70"
			/>
			<h2 className="text-2xl mt-4 font-semibold">Danylo</h2>
			{!data || isLoading ? (
				<Spinner className="size-8" />
			) : (
				<>
					<p>{data.user.email}</p>
					<p>
						Member since:{" "}
						{dayjs(data.user.createdAt).format("DD/MM/YYYY")}
					</p>
				</>
			)}
			<Button
				onClick={async () => {
					await api.get("/logout");
					auth.setSession(null);
				}}
				className="mt-4"
			>
				Logout
			</Button>
		</div>
	);
};

export default Profile;
