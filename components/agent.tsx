"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { UserCheck2Icon } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { vapi } from "@/lib/vapi.sdk";
import { toast } from "sonner";

enum CallStatus {
	INACTIVE = "INACTIVE",
	CONNECTING = "CONNECTING",
	ACTIVE = "ACTIVE",
	FINISHED = "FINISHED",
}

interface SavedMessage {
	role: "user" | "system" | "assistant";
	content: string;
}

const Agent = ({ userName, userPhotoURL, userId, type }: AgentProps) => {
	const router = useRouter();
	const [isSpeaking, setIsSpeaking] = useState(false);
	const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
	const [messages, setMessages] = useState<SavedMessage[]>([]);
	const firstName = userName.split(" ")[0];

	useEffect(() => {
		const onCallStart = () => setCallStatus(CallStatus.ACTIVE);
		const onCallEnd = () => setCallStatus(CallStatus.FINISHED);

		const onMessage = (message: Message) => {
			if (message.type === "transcript" && message.transcriptType === "final") {
				const newMessage = { role: message.role, content: message.transcript };

				setMessages((prev) => [...prev, newMessage]);
			}
		};

		const onSpeechStart = () => setIsSpeaking(true);
		const onSpeechEnd = () => setIsSpeaking(false);

		const onError = (error: Error) => {
			console.log("Vapi_Error:", error);
			toast.error(error?.message || "Call has ended.");
		};

		vapi.on("call-start", onCallStart);
		vapi.on("call-end", onCallEnd);
		vapi.on("message", onMessage);
		vapi.on("speech-start", onSpeechStart);
		vapi.on("speech-end", onSpeechEnd);
		vapi.on("error", onError);

		return () => {
			vapi.off("call-start", onCallStart);
			vapi.off("call-end", onCallEnd);
			vapi.off("message", onMessage);
			vapi.off("speech-start", onSpeechStart);
			vapi.off("speech-end", onSpeechEnd);
			vapi.off("error", onError);
		};
	}, []);

	useEffect(() => {
		if (callStatus === CallStatus.FINISHED) router.push("/");
	}, [messages, callStatus, type, userId]);

	const handleCall = async () => {
		setCallStatus(CallStatus.CONNECTING);

		await vapi.start(process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID!, {
			variableValues: {
				username: firstName,
				userid: userId,
			},
		});
	};

	const handleEndCall = async () => {
		setCallStatus(CallStatus.FINISHED);

		vapi.stop();
	};

	const latestMessage = messages[messages.length - 1]?.content;

	const isCallInactiveOrFinished =
		callStatus === CallStatus.INACTIVE || callStatus === CallStatus.FINISHED;

	return (
		<>
			<div className="call-view">
				<div className="card-interviewer">
					<div className="avatar">
						<Image
							src="/ai-avatar.png"
							alt="vapi agent avatar"
							width={65}
							height={54}
							className="object-cover"
						/>
						{isSpeaking && <span className="animate-speak" />}
					</div>

					<h3>AI Interviewer</h3>
				</div>

				<div className="card-border">
					<div className="card-content">
						<Avatar className="size-[120px]">
							<AvatarImage src={userPhotoURL} alt={`@${userName}`} />
							<AvatarFallback>
								<UserCheck2Icon size={60} />
							</AvatarFallback>
						</Avatar>

						<h3>{userName}</h3>
					</div>
				</div>
			</div>

			{messages.length > 0 && (
				<div className="transcript-border">
					<div className="transcript">
						<p
							className={cn(
								"opacity-0 transition-opacity duration-500",
								"animate-fadeIn opacity-100"
							)}
							key={latestMessage}
						>
							{latestMessage}
						</p>
					</div>
				</div>
			)}

			<div className="w-full flex justify-center">
				{callStatus !== "ACTIVE" ? (
					<button
						className="relative btn-call active:scale-95 transition-transform"
						onClick={handleCall}
						aria-label={isCallInactiveOrFinished ? "Start Call" : "Connecting"}
						disabled={!isCallInactiveOrFinished}
					>
						<span
							className={cn(
								"absolute inset-0 bg-green-100 animate-ping rounded-full opacity-50",
								callStatus !== "CONNECTING" && "hidden"
							)}
						/>

						<span>
							{isCallInactiveOrFinished ? "Start Call" : "Connecting..."}
						</span>
					</button>
				) : (
					<button
						aria-label="End Call"
						className="btn-disconnect active:scale-95 transition-transform duration-300"
						onClick={handleEndCall}
					>
						End Call
					</button>
				)}
			</div>
		</>
	);
};

export default Agent;
