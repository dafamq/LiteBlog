import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Home = () => {
	const navigate = useNavigate();

	return (
		<div className="flex flex-col justify-center items-center h-full">
			<div className="prose text-center">
				<h1>Lite Blog - Блог-платформа</h1>
				<h2 className="mt-2 text-lg">
					Діліться своїми думками та ідеями з усім світом!
				</h2>
				<Button
					onClick={() => navigate("/discover")}
					variant="secondary"
					className="bg-yellow-300 hover:bg-yellow-100"
				>
					Дивитись останні статті
				</Button>
			</div>
		</div>
	);
};

export default Home;
