import Image from "next/image";
import React from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserCheck2Icon } from "lucide-react";
import { cn } from "@/lib/utils";

enum CallStatus {
	INACTIVE = "INACTIVE",
	CONNECTING = "CONNECTING",
	ACTIVE = "ACTIVE",
	FINISHED = "FINISHED",
}

const Agent = ({ userName, userPhotoURL }: AgentProps) => {
	const callStatus = CallStatus.INACTIVE;
	const isSpeaking = false;

	const messages = [
		"What is your name",
		"My name is John Doe, Nice to meet you!",
	];

	const lastMessage = messages[messages.length - 1];

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
							key={lastMessage}
						>
							{lastMessage}
						</p>
					</div>
				</div>
			)}

			<div className="w-full flex justify-center">
				{callStatus !== "ACTIVE" ? (
					<button className="relative btn-call active:scale-95 transition-transform duration-300">
						<span
							className={cn(
								"absolute animate-ping rounded-full opacity-75",
								callStatus !== "CONNECTING" && "hidden"
							)}
						/>

						<span>
							{callStatus === "INACTIVE" || callStatus === "FINISHED" ? (
								"Call"
							) : (
								<Image
									src={"/calling.gif"}
									alt="call"
									width={20}
									height={20}
									className="object-cover mx-auto -mt-[7px] py-1.5"
								/>
							)}
						</span>
					</button>
				) : (
					<button className="btn-disconnect active:scale-95 transition-transform duration-300">
						End Call
					</button>
				)}
			</div>
		</>
	);
};

export default Agent;
