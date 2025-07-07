import React, { useState } from "react";
import Image from "next/image";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { Button } from "./ui/button";
import { auth } from "@/firebase/client";
import { createUser, storeIdToken } from "@/lib/actions/auth.action";
import { Loader2Icon } from "lucide-react";

const SignInWithGoogle = () => {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);

	const handleGoogleSignIn = async () => {
		setIsLoading(true);

		try {
			const provider = new GoogleAuthProvider();
			const userCredential = await signInWithPopup(auth, provider);
			const user = userCredential.user;

			await createUser({
				uid: user.uid,
				name: user.displayName!,
				email: user.email!,
				photoURL: user.photoURL || "",
			});

			await storeIdToken({
				email: user.email!,
				idToken: await user.getIdToken(),
			});

			toast.success("Signed in successfully.");
			router.push("/");
		} catch (e: any) {
			console.error("Error signing in with Google:", e);

			if (
				e.code === "auth/popup-closed-by-user" ||
				e.code === "auth/cancelled-popup-request"
			) {
				toast.error("Google sign in request cancelled by user.");
			} else {
				toast.error("Failed to log in. Please try again.");
			}
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div>
			<Button
				variant={"secondary"}
				className="w-full py-6 cursor-pointer active:scale-95 transition-transform duration-300"
				onClick={handleGoogleSignIn}
				disabled={isLoading}
			>
				{isLoading ? (
					<Loader2Icon className="animate-spin" />
				) : (
					<>
						<Image src="/google.svg" alt="google logo" width={20} height={20} />
						Sign in with Google
					</>
				)}
			</Button>
		</div>
	);
};

export default SignInWithGoogle;
