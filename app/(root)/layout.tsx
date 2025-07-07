import { ReactNode } from "react";
import { redirect } from "next/navigation";

import Header from "@/components/header";
import { getCurrentUser } from "@/lib/actions/auth.action";

const RootLayout = async ({ children }: { children: ReactNode }) => {
	const isUserAuthenticated = await getCurrentUser();

	if (!isUserAuthenticated) redirect("/sign-in");

	return (
		<div className="root-layout">
			<Header />

			<main>{children}</main>
		</div>
	);
};

export default RootLayout;
