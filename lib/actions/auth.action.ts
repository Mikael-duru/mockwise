"use server";

import { auth, db } from "@/firebase/admin";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

const ONE_WEEK = 60 * 60 * 24 * 7;

export const createUser = async (params: CreateUserParams) => {
	const { uid, name, email, photoURL, imgPublicId } = params;
	try {
		const userRecord = await db.collection("users").doc(uid).get();

		// if user already exists do nothing
		if (userRecord.exists) {
			return {
				success: true,
				message: "User already exists",
			};
		}

		await db.collection("users").doc(uid).set({
			name,
			email,
			photoURL,
			imgPublicId,
		});

		return {
			success: true,
			message: "User account created successfully",
		};
	} catch (e: any) {
		console.error("[Error creating a user", e);

		return {
			success: false,
			message: "Failed to create user account",
		};
	}
};

export const updateUser = async (params: UpdateUserParams) => {
	const { uid, photoURL, imgPublicId } = params;

	try {
		await db.collection("users").doc(uid).update({
			photoURL,
			imgPublicId,
		});

		return {
			success: true,
			message: "User updated successfully",
		};
	} catch (e: any) {
		console.error("[Error updating user]", e);

		return {
			success: false,
			message: "Failed to update user",
		};
	}
};

export const storeIdToken = async (params: SignInParams) => {
	const { email, idToken } = params;

	try {
		const userRecord = await auth.getUserByEmail(email);

		if (!userRecord) {
			return {
				success: false,
				message: "User not found",
			};
		}

		await setSessionCookie(idToken);
	} catch (e: any) {
		console.error(e);
	}
};

export const setSessionCookie = async (idToken: string) => {
	const cookieStore = await cookies();

	const sessionCookie = await auth.createSessionCookie(idToken, {
		expiresIn: ONE_WEEK * 1000,
	});

	cookieStore.set("__session_mockWise", sessionCookie, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		path: "/",
		sameSite: "lax",
		maxAge: ONE_WEEK,
	});
};

export const getCurrentUser = async (): Promise<User | null> => {
	const cookieStore = await cookies();
	const sessionCookie = cookieStore.get("__session_mockWise")?.value;

	if (!sessionCookie) return null;

	try {
		const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);

		const userRecord = await db
			.collection("users")
			.doc(decodedClaims.uid)
			.get();

		if (!userRecord.exists) return null;

		return {
			...userRecord.data(),
			id: userRecord.id,
		} as User;
	} catch (e) {
		console.log(e);
		return null;
	}
};

export const isAuthenticated = async () => {
	const user = await getCurrentUser();

	return !!user;
};

export const deleteCookie = async () => {
	const cookieStore = await cookies();
	cookieStore.delete("__session_mockWise");
};
