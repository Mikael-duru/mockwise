import Agent from "@/components/agent";
import { getCurrentUser } from "@/lib/actions/auth.action";

const InterviewPage = async () => {
	const user = await getCurrentUser();

	return (
		<section className="space-y-10">
			<h3>Interview Generation</h3>

			<Agent
				userName={user?.name || "Anonymous"}
				userPhotoURL={user?.photoURL || ""}
				userId={user?.id}
				type="generate"
			/>
		</section>
	);
};

export default InterviewPage;
