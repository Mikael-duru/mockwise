"use server";

import { feedbackSchema } from "@/constants";
import { db } from "@/firebase/admin";
import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { generateFeedback } from "../prompts";
import { getCurrentUser } from "./auth.action";

export const getInterviewsByUserId = async (
	userId: string
): Promise<Interview[] | null> => {
	const interviews = await db
		.collection("interviews")
		.where("userId", "==", userId)
		.orderBy("createdAt", "desc")
		.get();

	return interviews.docs.map((doc) => ({
		id: doc.id,
		...doc.data(),
	})) as Interview[];
};

export const getCommunityInterviews = async (
	params: GetCommunityInterviewsParams
): Promise<Interview[] | null> => {
	const { userId, limit = 20 } = params;

	const interviews = await db
		.collection("interviews")
		.where("finalized", "==", true)
		.where("userId", "!=", userId)
		.orderBy("createdAt", "desc")
		.limit(limit)
		.get();

	return interviews.docs.map((doc) => ({
		id: doc.id,
		...doc.data(),
	})) as Interview[];
};

export const getInterviewById = async (
	id: string
): Promise<Interview | null> => {
	const interview = await db.collection("interviews").doc(id).get();

	return interview.data() as Interview | null;
};

export const createFeedback = async (params: CreateFeedbackParams) => {
	const { interviewId, userId, transcript } = params;

	try {
		// Check if user ever spoke - if not, don't generate feedback
		const userHasSpoken = transcript.some(
			(line) =>
				line.role.toLowerCase() === "user" && line.content.trim().length > 0
		);

		if (!userHasSpoken) {
			console.warn("No user responses found — skipping feedback.");
			return {
				success: false,
				reason: "No user responses found.",
			};
		}

		const formattedTranscript = transcript
			.map(
				(sentence: { role: string; content: string }) =>
					`- ${sentence.role}: ${sentence.content}\n`
			)
			.join("");

		const {
			object: {
				totalScore,
				categoryScores,
				strengths,
				weaknesses,
				areasForImprovement,
				finalAssessment,
			},
		} = await generateObject({
			model: google("gemini-2.0-flash-001", {
				structuredOutputs: false,
			}),
			schema: feedbackSchema,
			prompt: generateFeedback(formattedTranscript),
			system:
				"You are a professional interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories",
		});

		const feedback = await db.collection("feedbacks").add({
			interviewId,
			userId,
			totalScore,
			categoryScores,
			strengths,
			weaknesses,
			areasForImprovement,
			finalAssessment,
			createdAt: new Date().toISOString(),
		});

		return {
			success: true,
			feedbackId: feedback.id,
		};
	} catch (e) {
		console.error("Error saving a feedback", e);

		return {
			success: false,
		};
	}
};

export const getFeedbackByIds = async (
	params: GetFeedbackByInterviewIdParams
): Promise<Feedback | null> => {
	const { interviewId } = params;
	const user = await getCurrentUser();

	const feedback = await db
		.collection("feedbacks")
		.where("interviewId", "==", interviewId)
		.where("userId", "==", user?.id)
		.limit(1)
		.get();

	if (feedback.empty) return null;

	const feedbackDoc = feedback.docs[0];

	return { id: feedbackDoc.id, ...feedbackDoc.data() } as Feedback;
};
