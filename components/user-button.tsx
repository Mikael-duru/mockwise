"use client";

import { LogOut, Settings, UserRoundCheck } from "lucide-react";
import { useRouter } from "next/navigation";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { auth, db } from "@/firebase/client";
import { deleteCookie } from "@/lib/actions/auth.action";
import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";

const UserButton = ({ user }: { user: User }) => {
	const router = useRouter();
	const [photoURL, setPhotoURL] = useState(user?.photoURL);

	useEffect(() => {
		const userDetails = () => {
			const userDocRef = doc(db, "users", user.id);

			onSnapshot(userDocRef, (doc) => {
				setPhotoURL(doc.data()?.photoURL);
			});
		};

		userDetails();
	}, [user]);

	const firstName = user?.name.split(" ")[0];

	const handleLogout = () => {
		auth.signOut().then(() => {
			router.push("/sign-in");
			deleteCookie();
		});
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger>
				<Avatar className="w-12 h-12 shrink-0 border border-primary-foreground hover:border-transparent hover:ring-4 hover:ring-zinc-600/50 transition-colors transition-shadow duration-300 cursor-pointer">
					<AvatarImage
						src={photoURL || user?.photoURL}
						alt={`@${user?.name}`}
						className="object-cover"
					/>
					<AvatarFallback>
						<UserRoundCheck size={22} />
					</AvatarFallback>
				</Avatar>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="mr-5 mt-1">
				<DropdownMenuLabel className="py-4 px-5">
					<div className="flex items-center justify-center gap-4">
						<Avatar className="w-12 h-12 shrink-0">
							<AvatarImage
								src={photoURL || user?.photoURL}
								alt={`@${user?.name}`}
								className="object-cover"
							/>
							<AvatarFallback>
								<UserRoundCheck size={24} />
							</AvatarFallback>
						</Avatar>
						<div className="space-y-1">
							<h1 className="capitalize">Hi! {firstName}</h1>
							<p className="text-xs lowercase">{user?.email}</p>
						</div>
					</div>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuItem
					className="cursor-pointer"
					onClick={() => router.push("/user-account-settings")}
				>
					<div className="flex items-center justify-center gap-4">
						<div className="flex items-center justify-center w-12 h-12 shrink-0 pl-5">
							<Settings />
						</div>
						<p>Manage account</p>
					</div>
				</DropdownMenuItem>
				<DropdownMenuItem
					className="cursor-pointer hover:text-red-500 dark:hover:text-red-500"
					onClick={handleLogout}
				>
					<div className="flex items-center justify-center gap-4">
						<div className="flex items-center justify-center w-12 h-12 shrink-0 pl-5">
							<LogOut />
						</div>
						<p>Sign out</p>
					</div>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default UserButton;
