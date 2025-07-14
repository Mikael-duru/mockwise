import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/actions/auth.action";
import {
	getFeedbackByIds,
	getInterviewById,
} from "@/lib/actions/interview.action";
import { CalendarDaysIcon, StarIcon } from "lucide-react";
import dayjs from "dayjs";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const FeedbackPage = async ({ params }: RouteParams) => {
	const { id } = await params;
	const user = await getCurrentUser();

	const interview = await getInterviewById(id);

	const feedback = await getFeedbackByIds({
		interviewId: id,
	});

	if (!interview || !feedback) redirect("/");

	return (
		<section className="section-feedback">
			<div className="flex flex-row justify-center">
				<h1 className="text-4xl font-semibold">
					Feedback for {user?.name} –{" "}
					<span className="capitalize">{interview?.role}</span> Interview
				</h1>
			</div>

			<div className="space-y-4">
				<div className="flex flex-row justify-center">
					<div className="flex flex-row gap-5  flex-wrap">
						<div className="flex flex-row gap-2 items-center">
							<StarIcon size={22} fill="#FBBF24" stroke="#FBBF24" />
							<p>
								Overall Impression:{" "}
								<span className="text-primary-200">{feedback?.totalScore}</span>
								/100
							</p>
						</div>

						<div className="flex flex-row gap-2 items-center">
							<CalendarDaysIcon size={22} />
							<p>
								{feedback?.createdAt
									? dayjs(feedback.createdAt).format("MMM D, YYYY h:mm A")
									: "N/A"}
							</p>
						</div>
					</div>
				</div>

				<Separator />
			</div>

			<div className="space-y-3">
				<h2>Final Assessments:</h2>
				<p>{feedback?.finalAssessment}</p>
			</div>

			<div className="space-y-4">
				<h2>Breakdown of Evaluation:</h2>
				{feedback?.categoryScores?.map((category, index) => (
					<div key={index} className="space-y-1">
						<p className="font-bold">
							{index + 1}. {category.name} ({category?.score}/100)
						</p>
						<p>{category.comment}</p>
					</div>
				))}
			</div>

			<div className="space-y-3">
				<h3>Strengths:</h3>
				<ul className="space-y-0.5">
					{feedback?.strengths && feedback?.strengths?.length > 0 ? (
						feedback?.strengths?.map((strength, index) => (
							<li key={index}>{strength}</li>
						))
					) : (
						<li className="text-gray-500 italic">
							No notable strengths identified yet. Focus on the areas for
							improvement below.
						</li>
					)}
				</ul>
			</div>

			<div className="space-y-3">
				<h3>Weaknesses:</h3>
				<ul className="space-y-0.5">
					{feedback?.weaknesses && feedback?.weaknesses?.length > 0 ? (
						feedback?.weaknesses?.map((weakness, index) => (
							<li key={index}>{weakness}</li>
						))
					) : (
						<li className="text-gray-500 italic">
							No significant weaknesses identified. Great job!
						</li>
					)}
				</ul>
			</div>

			<div className="space-y-3">
				<h3>Areas for Improvement:</h3>
				<ul className="space-y-0.5">
					{feedback?.areasForImprovement &&
					feedback?.areasForImprovement?.length > 0 ? (
						feedback?.areasForImprovement?.map((improvement, index) => (
							<li key={index}>{improvement}</li>
						))
					) : (
						<li className="text-gray-500 italic">
							No significant areas for improvement identified. Well done!
						</li>
					)}
				</ul>
			</div>

			<div className="buttons">
				<Button className="btn-secondary flex-1" asChild>
					<Link
						href="/"
						className="flex w-full justify-center text-sm font-semibold text-primary-200 text-center"
					>
						Back to Home
					</Link>
				</Button>

				<Button className="btn-primary flex-1" asChild>
					<Link
						href={`/interview/${id}`}
						className="flex w-full justify-center text-sm font-semibold text-white text-center"
					>
						Retake Interview
					</Link>
				</Button>
			</div>
		</section>
	);
};

export default FeedbackPage;
