import Image from "next/image";
import Link from "next/link";
import React from "react";

import { Button } from "@/components/ui/button";
import InterviewCard from "@/components/interview-card";
import { getCurrentUser } from "@/lib/actions/auth.action";
import {
	getInterviewsByUserId,
	getCommunityInterviews,
} from "@/lib/actions/interview.action";
import { MicOffIcon } from "lucide-react";

const Home = async () => {
	const user = await getCurrentUser();

	const [userInterviews, communityInterviews] = await Promise.all([
		await getInterviewsByUserId(user?.id as string),
		await getCommunityInterviews({ userId: user?.id as string }),
	]);

	const hasPastInterviews = (userInterviews ?? [])?.length > 0;
	const hasCommunityInterviews = (communityInterviews ?? [])?.length > 0;

	return (
		<>
			<section className="card-cta gap-14 mt-5">
				<div className="flex flex-col gap-6 max-w-lg">
					<h2>Ace Your Interviews with AI-Driven Practice & Smart Feedback</h2>

					<p className="text-lg">
						Train with real interview scenarios and get helpful tips to level up
						Your answer.
					</p>

					<Button
						className="btn-primary w-[250px] max-lg:mt-3 animate-bounce hover:animate-none active:scale-95 transition-transform"
						asChild
					>
						<Link href="/interview">Start an Interview</Link>
					</Button>
				</div>

				<Image
					src="/3d-robot.png"
					alt="3D robot interviewing a person at a desk with a microphone."
					width={400}
					height={400}
					className="shrink-0"
				/>
			</section>

			<section className="flex flex-col gap-8 mt-16">
				<h2 className="">Your Interviews</h2>

				<div className="interviews-section">
					{hasPastInterviews ? (
						userInterviews?.map((interview: Interview) => (
							<InterviewCard key={interview.id} {...interview} />
						))
					) : (
						<p className="pt-5 flex items-center gap-3 col-span-4">
							<MicOffIcon className="shrink-0 max-sm:size-7" />
							You haven&apos;t generated any interviews yet.
						</p>
					)}
				</div>
			</section>

			<section className="flex flex-col gap-8 mt-24">
				<div className="space-y-3">
					<h2 className="">Community Interviews</h2>
					<p className="text-lg font-medium">
						Explore community-generated interviews
					</p>
				</div>

				<div className="interviews-section">
					{hasCommunityInterviews ? (
						communityInterviews?.map((interview: Interview) => (
							<InterviewCard key={interview.id} {...interview} />
						))
					) : (
						<p className="pt-5 flex items-center gap-3 col-span-4">
							<MicOffIcon className="shrink-0 max-sm:size-7" />
							No community-generated interviews available yet.
						</p>
					)}
				</div>
			</section>
		</>
	);
};

export default Home;
