import Image from "next/image";
import Link from "next/link";
import React from "react";

import { Button } from "@/components/ui/button";
import { dummyInterviews } from "@/constants";
import InterviewCard from "@/components/interview-card";

const Home = () => {
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
						className="btn-primary w-[250px] max-lg:mt-3 animate-bounce"
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

			<section className="flex flex-col gap-6 mt-16">
				<h2 className="">Your Interviews</h2>

				<div className="interviews-section">
					{dummyInterviews.map((interview) => (
						<InterviewCard key={interview.id} {...interview} />
					))}

					{/* <p className="">You haven&apos;t taken any interviews yet.</p> */}
				</div>
			</section>

			<section className="flex flex-col gap-6 mt-16">
				<h2 className="">Take an Interview</h2>

				<div className="interviews-section">
					{dummyInterviews.map((interview) => (
						<InterviewCard key={interview.id} {...interview} />
					))}

					{/* <p className="">There are no interviews available.</p> */}
				</div>
			</section>
		</>
	);
};

export default Home;
