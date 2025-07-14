"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import FormField from "./form-fields";
import {
	createUserWithEmailAndPassword,
	sendPasswordResetEmail,
	signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "@/firebase/client";
import { createUser, storeIdToken } from "@/lib/actions/auth.action";
import { Loader2Icon } from "lucide-react";
import { cn } from "@/lib/utils";
import SignInWithGoogle from "./google-auth";
import { Separator } from "./ui/separator";

const authFormSchema = (type: FormType) => {
	return z.object({
		name: type === "sign-up" ? z.string().min(3) : z.string().optional(),
		email: z.string().email(),
		password:
			type === "reset-password" ? z.string().optional() : z.string().min(6),
	});
};

const AuthForm = ({ type }: { type: FormType }) => {
	const router = useRouter();
	const formSchema = authFormSchema(type);
	const [isLoading, setIsLoading] = useState(false);

	// 1. Define your form.
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			email: "",
			password: "",
		},
	});

	// 2. Define a submit handler.
	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		const { name, email, password } = values;
		setIsLoading(true);

		try {
			if (type === "sign-up") {
				const userCredentials = await createUserWithEmailAndPassword(
					auth,
					email,
					password!
				);

				const result = await createUser({
					uid: userCredentials.user.uid,
					name: name!,
					email,
					photoURL: "",
					imgPublicId: "",
				});

				if (!result?.success) {
					toast.error(result?.message);
					auth.signOut();
					return;
				}

				toast.success("Account created successfully.");
				auth.signOut();
				router.push("/sign-in");
			}

			if (type === "sign-in") {
				const userCredentials = await signInWithEmailAndPassword(
					auth,
					email,
					password!
				);

				const idToken = await userCredentials.user.getIdToken();

				if (!idToken) {
					toast.error("Sign in failed. Please try again.");
					return;
				}

				await storeIdToken({ email, idToken });

				toast.success("Signed in successfully.");
				router.push("/");
			}

			if (type === "reset-password") {
				await sendPasswordResetEmail(auth, email);

				toast.success(
					`If an account with "${email}" exists you’ll receive a reset instruction. Please check your inbox.`
				);
				router.push("/sign-in");
			}
		} catch (e: any) {
			console.log(e);
			const errorMessages: { [key: string]: string } = {
				"auth/wrong-password": "Incorrect password",
				"auth/invalid-credential": "Invalid credential",
				"auth/invalid-email": "Invalid email",
				"auth/too-many-requests": "Too many requests",
				"auth/user-disabled": "User disabled",
				"auth/email-already-in-use": "Email already in use",
			};

			toast.error(
				errorMessages[e.code] || "Failed to log in user. Please try again."
			);
		} finally {
			setIsLoading(false);
		}
	};

	const isSignIn = type === "sign-in";
	const isSignUp = type === "sign-up";

	return (
		<div className="relative card-border w-full max-w-[566px] my-2">
			<div className="flex flex-col gap-6 card max-sm:px-6 py-14 px-10">
				<div className="flex flex-row gap-2 items-center justify-start mb-4">
					<Image src={"/logo.png"} alt="logo" width={34} height={28} />
					<p className="text-primary-100 text-2xl">MockWise</p>
				</div>

				<h2 className="text-center">
					{isSignIn ? "Sign In" : isSignUp ? "Sign Up" : "Forgot Password"}
				</h2>

				<h3 className="text-center">
					{isSignIn
						? "Practice job interviews with AI"
						: isSignUp
						? "Enter your details below to create your account"
						: "Enter your email below to get a reset link"}
				</h3>

				{isSignIn && (
					<div className="pt-4">
						<SignInWithGoogle />

						<div className="flex items-center justify-center gap-2 overflow-x-hidden mt-6">
							<Separator className="" />
							<p className="shrink-0">Or continue with</p>
							<Separator />
						</div>
					</div>
				)}

				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="w-full space-y-6 mt-1 form"
					>
						{isSignUp && (
							<FormField
								name="name"
								label="Name"
								placeholder="Enter your name"
								control={form.control}
								isLoading={isLoading}
							/>
						)}

						<FormField
							name="email"
							label="Email"
							type="email"
							placeholder="Enter your email"
							control={form.control}
							isLoading={isLoading}
						/>

						{(isSignIn || isSignUp) && (
							<FormField
								name="password"
								label="Password"
								type="password"
								placeholder="Enter your password"
								control={form.control}
								isLoading={isLoading}
							/>
						)}

						{isSignIn && (
							<p className="-mt-2 text-end">
								<Link href="/forgot-password" className="hover:underline">
									Forgot Password?
								</Link>
							</p>
						)}

						<Button type="submit" className="btn py-6" disabled={isLoading}>
							{isLoading ? (
								<>
									<Loader2Icon className="size-5 animate-spin" />
									{isSignIn
										? "Signing In..."
										: isSignUp
										? "Creating Account..."
										: "Sending reset link..."}
								</>
							) : (
								<>
									{isSignIn
										? "Sign In"
										: isSignUp
										? "Create an Account"
										: "Reset Password"}
								</>
							)}
						</Button>
					</form>
				</Form>

				{(isSignIn || isSignUp) && (
					<p className="text-center">
						{isSignIn ? "Don't have an account? " : "Already have an account? "}
						<Link
							href={isSignIn ? "/sign-up" : "/sign-in"}
							className={cn(
								"font-bold text-user-primary ml-1",
								isLoading && "pointer-events-none text-primary-100/60",
								isSignIn && "hover:underline"
							)}
						>
							{isSignIn ? "Sign Up" : "Sign In"}
						</Link>
					</p>
				)}
			</div>
		</div>
	);
};

export default AuthForm;
