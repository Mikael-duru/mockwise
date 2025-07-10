import Agent from "@/components/agent";
import TechIcons from "@/components/tech-icons";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { getInterviewById } from "@/lib/actions/interview.action";

import Image from "next/image";
import { redirect } from "next/navigation";

const InterviewPage = async ({ params }: RouteParams) => {
	const { id } = await params;

	const user = await getCurrentUser();
	const interview = await getInterviewById(id);

	if (!interview) redirect("/");

	return (
		<section className="space-y-10">
			<div className="flex flex-row gap-5 md:gap-8 justify-between max-md:flex-col">
				<div className="flex flex-row gap-4 items-center">
					<Image
						src={interview?.coverImage}
						alt="company logo"
						width={40}
						height={40}
						className="rounded-full object-cover size-[40px]"
					/>
					<h3 className="capitalize">{interview?.role} Interview</h3>
				</div>
				<div className="flex-1 flex flex-row gap-10 items-center justify-between">
					<div className="shrink-0">
						<TechIcons techStack={interview?.techStack} />
					</div>

					<p className="bg-dark-200 capitalize px-4 py-2 rounded-lg h-fit">
						{interview?.type}
					</p>
				</div>
			</div>

			<Agent
				userName={user?.name || "Anonymous"}
				userPhotoURL={user?.photoURL || ""}
				userId={user?.id}
				type="interview"
				interviewId={id}
				questions={interview?.questions}
			/>
		</section>
	);
};

export default InterviewPage;
