"use client";

import {
	deleteUser,
	EmailAuthProvider,
	GoogleAuthProvider,
	reauthenticateWithCredential,
	reauthenticateWithPopup,
} from "firebase/auth";
import { deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Loader2, UserRoundCheck } from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import ProfileImageUpload from "./image-upload";
import { Button } from "@/components/ui/button";
import { auth, db } from "@/firebase/client";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "./ui/form";
import FormField from "./form-fields";
import { deleteCookie } from "@/lib/actions/auth.action";

const formSchema = z.object({
	password: z.string().min(6),
	deleteAcct: z.string(),
});

const UserProfile = ({ user }: { user: User }) => {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);
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

	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: {
			password: "",
			deleteAcct: "",
		},
	});

	const currentUser = auth?.currentUser;

	const isEmailUser =
		currentUser?.providerData.some(
			(provider) => provider.providerId === "password"
		) || false;

	const isGoogleUser =
		currentUser?.providerData.some(
			(provider) => provider.providerId === "google.com"
		) || false;

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		setIsLoading(true);
		const { password } = values;

		if (!currentUser) {
			toast.error("User not found. Please refresh and try again.");
			setIsLoading(false);
			return;
		}

		try {
			// Reauthenticate user
			if (isEmailUser) {
				if (!password) {
					setIsLoading(false);
					return;
				}

				const email = currentUser.email!;
				const credential = EmailAuthProvider.credential(email, password);

				await reauthenticateWithCredential(currentUser, credential).catch(
					(error) => {
						const errorMessage =
							error.code === "auth/wrong-password" ||
							error.code === "auth/invalid-credential"
								? "Incorrect password. Please try again."
								: "Email/Password Reauthentication failed. Please try again.";
						setIsLoading(false);
						throw new Error(errorMessage);
					}
				);
			} else if (isGoogleUser) {
				const googleProvider = new GoogleAuthProvider();
				await reauthenticateWithPopup(currentUser, googleProvider).catch(
					(error) => {
						toast.error("Google Reauthentication failed. Please try again.");
						setIsLoading(false);
						throw new Error("Reauthentication failed.");
					}
				);
			}

			// Proceed with deleting the user account
			await Promise.all([
				deleteDoc(doc(db, "users", currentUser.uid)),
				deleteUser(currentUser),
			]);

			toast.success("Account deleted successfully!");
			await deleteCookie();
			router.push("/sign-in");
		} catch (error) {
			console.error("[Delete_Account]", error);
			toast.error("Something went wrong. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Card>
			<CardContent className="space-y-8 pt-6">
				<Card>
					<CardContent className="space-y-4 max-sm:px-4">
						<div className="pt-6 sm:flex justify-between max-sm:text-center">
							<div>
								<Avatar className="h-24 w-24 border-2 border-primary/20 max-sm:mx-auto">
									<AvatarImage
										src={photoURL || user?.photoURL}
										alt="user profile pic"
										className="object-cover"
									/>
									<AvatarFallback>
										<UserRoundCheck size={50} />
									</AvatarFallback>
								</Avatar>
								<div className="pt-2">
									<h1 className="gradient-title text-2xl">{user?.name}</h1>
									<p className="text-sm  text-muted-foreground line-clamp-1">
										{user?.email}
									</p>
								</div>
							</div>
							<ProfileImageUpload user={user} />
						</div>
					</CardContent>
				</Card>

				<Card className="border-red-900">
					<CardHeader>
						<CardTitle className="gradient-title text-3xl">
							Delete Account
						</CardTitle>
						<CardDescription>
							This action cannot be undone. This will permanently delete your
							account and remove your data from our server.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(onSubmit)}
								className="w-full space-y-6 mt-1 form"
							>
								{isEmailUser && (
									<FormField
										name="password"
										control={form.control}
										label="Password"
										type="password"
										placeholder="Enter your password"
										isLoading={isLoading}
									/>
								)}

								<div>
									<span className="text-sm inline-block">
										Type the word{" "}
										<span className="text-red-600 inline">
											&quot;Delete&quot;
										</span>{" "}
										to confirm
									</span>

									<FormField
										control={form.control}
										name="deleteAcct"
										type="text"
										placeholder='Enter the word "Delete"'
										isLoading={isLoading}
									/>
								</div>

								<Button
									variant="destructive"
									disabled={form.watch("deleteAcct") !== "Delete" || isLoading}
									type="submit"
									className="active:scale-95 w-full max-w-[150px]"
								>
									{isLoading ? (
										<>
											<Loader2 size={20} className="animate-spin" />
											Deleting account...
										</>
									) : (
										"Confirm"
									)}
								</Button>
							</form>
						</Form>
					</CardContent>
				</Card>
			</CardContent>
		</Card>
	);
};

export default UserProfile;
