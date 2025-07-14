import dayjs from "dayjs";
import Image from "next/image";
import { CalendarDaysIcon, StarIcon } from "lucide-react";
import Link from "next/link";

import { Button } from "./ui/button";
import TechIcons from "./tech-icons";
import { getFeedbackByIds } from "@/lib/actions/interview.action";

const InterviewCard = async ({
	id,
	currentUserId,
	role,
	type,
	coverImage,
	techStack,
	createdAt,
}: InterviewCardProps) => {
	let feedback = null;

	if (currentUserId && id) {
		feedback = await getFeedbackByIds({ interviewId: id, currentUserId });
	}

	const normalizedType = /mix/gi.test(type) ? "Mixed" : type;
	const formattedDate = dayjs(
		feedback?.createdAt || createdAt || Date.now()
	).format("MMM D, YYYY");

	return (
		<div className="card-border min-h-96 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary-100/15 transition-transform duration-300">
			<div className="card-interview">
				<div>
					<div className="absolute top-0 right-0 w-fit px-4 py-2 rounded-bl-lg bg-light-600">
						<p className="badge-text">{normalizedType}</p>
					</div>

					<Image
						src={coverImage}
						alt="interview cover"
						width={90}
						height={90}
						className="rounded-full object-contain size-[90px]"
					/>

					<h3 className="mt-5 capitalize">{role} Interview</h3>

					<div className="flex flex-row gap-5 mt-3">
						<div className="flex flex-row gap-2">
							<CalendarDaysIcon size={22} />
							<p>{formattedDate}</p>
						</div>

						<div className="flex flex-row gap-2 items-center">
							<StarIcon fill="#FBBF24" stroke="#FBBF24" size={22} />
							<p>{feedback?.totalScore || "---"}/100</p>
						</div>
					</div>

					<p className="line-clamp-2 mt-5">
						{feedback?.finalAssessment ||
							"You have not taken this interview yet. Take it now to improve your interview skills."}
					</p>
				</div>

				<div className="flex flex-row justify-between items-center gap-5 flex-wrap">
					<div className="shrink-0 mr-5">
						<TechIcons techStack={techStack} />
					</div>

					<Button
						className="btn-primary flex-1 active:scale-95 transition-transform duration-300"
						asChild
					>
						<Link
							href={
								feedback ? `/interview/${id}/feedback` : `/interview/${id}/`
							}
						>
							{feedback ? "View Feedback" : "Take Interview"}
						</Link>
					</Button>
				</div>
			</div>
		</div>
	);
};

export default InterviewCard;
