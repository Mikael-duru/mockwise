"use server";

import { db } from "@/firebase/admin";

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
