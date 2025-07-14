"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
	EmailAuthProvider,
	reauthenticateWithCredential,
	signOut,
	updatePassword,
} from "firebase/auth";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { auth } from "@/firebase/client";
import { toast } from "sonner";
import FormField from "./form-fields";

const formSchema = z.object({
	currentPassword: z.string().min(6, {
		message:
			"Current password is required (must contain at least 6 characters).",
	}),
	newPassword: z.string().min(6, {
		message: "New password is required (must contain at least 6 characters).",
	}),
});

const ChangePassword = () => {
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();

	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: {
			currentPassword: "",
			newPassword: "",
		},
	});

	// 2. Define a submit handler.
	const onSubmit = async (data: z.infer<typeof formSchema>) => {
		try {
			setIsLoading(true);

			const { currentPassword, newPassword } = data;

			if (currentPassword === newPassword) {
				toast.error("New password cannot be the same as current password.");
				return;
			}

			const user = auth?.currentUser;

			if (user && user.email) {
				const credential = EmailAuthProvider.credential(
					user.email,
					currentPassword
				);

				await reauthenticateWithCredential(user, credential);

				await updatePassword(user, newPassword);
				toast.success("Password changed successfully!");

				await signOut(auth);
				router.push("/sign-in");
			} else {
				toast.error("User not found. Please log in again.");
			}
		} catch (error: any) {
			console.error(error);
			if (error.code === "auth/invalid-credential") {
				toast.error("Current password is incorrect. Please try again.");
			} else {
				toast.error("An error occurred. Please try again.");
			}
		} finally {
			setIsLoading(false);
		}
	};
	return (
		<Card>
			<CardHeader>
				<CardTitle className="gradient-title text-3xl">
					Change Password
				</CardTitle>
				<CardDescription>
					After saving, you&apos;ll be logged out.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="w-full space-y-6 mt-1 form"
					>
						<FormField
							name="currentPassword"
							label="Current Password"
							type="password"
							placeholder="Enter your password"
							control={form.control}
							isLoading={isLoading}
						/>

						<FormField
							name="newPassword"
							label="New Password"
							type="password"
							placeholder="Enter your new password"
							control={form.control}
							isLoading={isLoading}
						/>

						<Button type="submit" disabled={isLoading}>
							{isLoading ? (
								<>
									<Loader2 size={20} className="animate-spin" />{" "}
									&nbsp;Loading...
								</>
							) : (
								"Save password"
							)}
						</Button>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
};

export default ChangePassword;
