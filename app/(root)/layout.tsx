import { ReactNode } from "react";
import { redirect } from "next/navigation";

import Header from "@/components/header";
import { getCurrentUser } from "@/lib/actions/auth.action";

const RootLayout = async ({ children }: { children: ReactNode }) => {
	const isUserAuthenticated = await getCurrentUser();

	if (!isUserAuthenticated) redirect("/sign-in");

	return (
		<div className="root-layout">
			<Header user={isUserAuthenticated} />

			<main>{children}</main>

			<footer className="text-center text-sm text-gray-500 mt-10">
				<p>&copy; 2025 MockWise. All rights reserved.</p>
			</footer>
		</div>
	);
};

export default RootLayout;
