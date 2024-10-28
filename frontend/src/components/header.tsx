import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { useAuth } from "@/stores/auth.store";

const Header = () => {
	const { isAuthenticated } = useAuth();
	const navigate = useNavigate();

	return (
		<header className="flex justify-between items-center p-4">
			<Link to="/" className="text-lg font-medium">
				LiteBlog
			</Link>
			<Button variant="link" className="text-lg">
				<Link to="/discover">Discover</Link>
			</Button>
			<div>
				{isAuthenticated() ? (
					<Button
						onClick={() => navigate("/profile")}
						variant="default"
						className="text-lg"
					>
						Profile
					</Button>
				) : (
					<Button
						onClick={() => navigate("/login")}
						variant="secondary"
						className="text-lg"
					>
						Log In
					</Button>
				)}
			</div>
		</header>
	);
};

export default Header;
