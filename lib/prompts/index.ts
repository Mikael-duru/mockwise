export const generateQuestions = (
	role: string,
	level: string,
	techstack: string,
	type: string,
	amount: number
) => {
	return [
		`Prepare questions for a job interview.
        The job role is ${role}.
        The job experience level is ${level}.
        The tech stack used in the job is: ${techstack}.
        The focus between behavioural and technical questions should lean towards: ${type}.
        The amount of questions required is: ${amount}.
        Please return only the questions, without any additional text.
        The questions are going to be read by a voice assistant so do not use "/" or "*" or any other special characters which might break the voice assistant.
        Return the questions formatted like this:
        ["Question 1", "Question 2", "Question 3"]
        
        Thank you! <3
    `,
	].join("\n");
};

export const generateFeedback = (formattedTranscript: string) => {
	return `
You are an AI interviewer analyzing a mock interview. Your task is to provide honest, constructive criticism of the person’s performance, based on the transcript below.

Be thorough. Do not be lenient — point out any weaknesses, mistakes, or areas for improvement. If they perform well, acknowledge their strengths clearly too.

Address your feedback directly to them — use ‘you’ instead of ‘the candidate.’ Write in a second-person perspective so your feedback feels personal and actionable.

Transcript:
${formattedTranscript}

Please score them from 0 to 100 in the following areas. Do not add categories other than the ones provided:
- **Communication Skills**: Clarity, articulation, structure.
- **Technical Knowledge**: Understanding of key concepts for the role.
- **Problem-Solving**: Ability to analyze problems and propose solutions.
- **Cultural & Role Fit**: Alignment with company values and the job role.
- **Confidence**: Confidence in responses and overall engagement.

Your feedback should:
- Be personalized, detailed, specific, and balanced.
- Highlight what they did well, using ‘you’ statements.
- Provide clear, actionable suggestions for what to improve.
- Avoid generic praise.

Keep your tone professional, supportive, and realistic.

Thank you.
`;
};
