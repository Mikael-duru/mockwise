import { redirect } from "next/navigation";
import { ReactNode } from "react";

import { getCurrentUser } from "@/lib/actions/auth.action";

const AuthLayout = async ({ children }: { children: ReactNode }) => {
	const isUserAuthenticated = await getCurrentUser();

	if (isUserAuthenticated) redirect("/");

	return <div className="auth-layout">{children}</div>;
};

export default AuthLayout;
