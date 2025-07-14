import { Loader2, Upload } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { updateUser } from "@/lib/actions/auth.action";

const ProfileImageUpload = ({ user }: { user: User }) => {
	const [isLoading, setIsLoading] = useState(false);

	const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (!file) return;

		setIsLoading(true);

		try {
			const formData = new FormData();
			formData.append("file", file);

			const [uploadRes, oldPublicId] = await Promise.all([
				fetch("/api/image/upload", {
					method: "POST",
					body: formData,
				}),
				user?.imgPublicId || "",
			]);

			const uploadData = await uploadRes.json();
			if (!uploadRes.ok) throw new Error(uploadData.error);

			await Promise.all([
				await updateUser({
					uid: user?.id,
					photoURL: uploadData.imageUrl,
					imgPublicId: uploadData.publicId,
				}),

				oldPublicId &&
					fetch("/api/image/delete", {
						method: "POST",
						body: JSON.stringify({ publicId: oldPublicId }),
					}),
			]);

			toast.success("Profile picture updated!");
		} catch (error) {
			console.error("Upload error:", error);
			toast.error("Failed to upload image.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="flex flex-col items-center">
			<Button
				variant="outline"
				className="mt-6 max-sm:text-xs h-10 active:scale-95"
				size="sm"
			>
				<label
					htmlFor="file-upload"
					className="relative flex items-center cursor-pointer text-sm w-full h-full"
				>
					{isLoading ? (
						<>
							<Loader2 size={20} className="animate-spin w-full mr-2" />{" "}
							Uploading...
						</>
					) : (
						<>
							<Upload className="h-4 w-4 mr-2" />
							Change Photo
						</>
					)}
					<input
						type="file"
						accept="image/*"
						id="file-upload"
						className="sr-only"
						disabled={isLoading}
						onChange={handleUpload}
					/>
				</label>
			</Button>
			<p className="text-[10px] leading-5 text-muted-foreground pt-1">
				PNG, JPG, JPEG up to 10MB
			</p>
		</div>
	);
};

export default ProfileImageUpload;
