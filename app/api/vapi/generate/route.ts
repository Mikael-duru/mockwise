import { generateText } from "ai";
import { google } from "@ai-sdk/google";

import { generateQuestions } from "@/lib/prompts";
import { getRandomInterviewCover } from "@/lib/utils";
import { db } from "@/firebase/admin";

export const GET = async () => {
	return Response.json(
		{ success: true, data: "THANK YOU!" },
		{
			status: 200,
		}
	);
};

export const POST = async (request: Request) => {
	const { type, role, level, techstack, amount, userid } = await request.json();

	try {
		const { text: questions } = await generateText({
			model: google("gemini-2.0-flash-001"),
			prompt: generateQuestions(type, role, level, techstack, amount),
		});

		const interview = {
			role,
			level,
			type,
			techStack: techstack.split(","),
			questions: JSON.parse(questions),
			userId: userid,
			coverImage: getRandomInterviewCover(),
			finalized: true,
			createdAt: new Date().toISOString(),
		};

		await db.collection("interviews").add(interview);

		return Response.json(
			{ success: true },
			{
				status: 200,
			}
		);
	} catch (error) {
		console.error(error);

		return Response.json(
			{ success: false, error },
			{
				status: 500,
			}
		);
	}
};
