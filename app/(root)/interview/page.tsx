import Agent from "@/components/agent";

const InterviewPage = async () => {
	return (
		<section className="space-y-10">
			<h3>Interview Generation</h3>

			<Agent
				userName="You"
				userPhotoURL={"/user-avatar.png"}
				userId="1"
				type="generate"
			/>
		</section>
	);
};

export default InterviewPage;
