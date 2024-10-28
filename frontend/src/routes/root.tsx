import Footer from "@/components/footer";
import Header from "@/components/header";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Outlet } from "react-router-dom";

const Root = () => {
	return (
		<TooltipProvider>
			<div className="flex flex-col min-h-full h-full">
				<Header />
				<main className="flex-auto">
					<Outlet />
				</main>
				<Footer />
			</div>
		</TooltipProvider>
	);
};

export default Root;
