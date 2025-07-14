import ManageAccount from "@/components/manage-account";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { redirect } from "next/navigation";

const UserAccount = async () => {
	const user = await getCurrentUser();

	if (!user) redirect("/sign-in");

	return <ManageAccount user={user} />;
};

export default UserAccount;
