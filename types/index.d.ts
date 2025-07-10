interface Feedback {
	id: string;
	interviewId: string;
	totalScore: number;
	categoryScores: Array<{
		name: string;
		score: number;
		comment: string;
	}>;
	strengths: string[];
	areasForImprovement: string[];
	finalAssessment: string;
	createdAt: string;
}

interface Interview {
	id: string;
	role: string;
	level: string;
	coverImage: string;
	questions: string[];
	techStack: string[];
	createdAt: string;
	userId: string;
	type: string;
	finalized: boolean;
}

interface CreateFeedbackParams {
	interviewId: Interview["id"];
	userId: string;
	transcript: { role: string; content: string }[];
	feedbackId?: string;
}

interface User {
	name: string;
	email: string;
	photoURL: string;
	id: string;
}

interface InterviewCardProps {
	id?: Interview["id"];
	userId?: string;
	role: string;
	type: string;
	coverImage: string;
	techStack: string[];
	createdAt?: string;
}

interface AgentProps {
	userName: string;
	userId?: string;
	userPhotoURL?: string;
	interviewId?: Interview["id"];
	feedbackId?: string;
	type: "generate" | "interview";
	questions?: string[];
}

interface RouteParams {
	params: Promise<Record<string, string>>;
	searchParams: Promise<Record<string, string>>;
}

interface GetFeedbackByInterviewIdParams {
	interviewId: Interview["id"];
	userId: string;
}

interface GetCommunityInterviewsParams {
	userId: string;
	limit?: number;
}

interface SignInParams {
	email: string;
	idToken: string;
}

interface CreateUserParams {
	uid: string;
	name: string;
	email: string;
	photoURL: string;
}

type FormType = "sign-in" | "sign-up" | "reset-password";

interface InterviewFormProps {
	interviewId: Interview["id"];
	role: string;
	level: string;
	type: string;
	techStack: string[];
	amount: number;
}

interface TechIconProps {
	techStack: string[];
}
