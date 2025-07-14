import * as React from "react";

import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";

function Input({
	className,
	type,
	showPasswordToggle = false,
	isLoading = false,
	...props
}: React.ComponentProps<"input"> & {
	showPasswordToggle?: boolean;
	isLoading?: boolean;
}) {
	const [visible, setVisible] = React.useState(false);

	const isPassword = type === "password";
	const inputType =
		isPassword && showPasswordToggle ? (visible ? "text" : "password") : type;

	return (
		<div className="relative w-full">
			<input
				type={inputType}
				data-slot="input"
				className={cn(
					"file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent dark:bg-input/30 px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
					"focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
					"aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
					className
				)}
				{...props}
			/>
			{isPassword && showPasswordToggle && (
				<button
					type="button"
					disabled={isLoading}
					className="absolute inset-y-0 right-5 flex items-center text-primary-200/40 cursor-pointer hover:text-primary-200"
					onClick={() => setVisible(!visible)}
				>
					{visible ? <EyeOff size={20} /> : <Eye size={20} />}
				</button>
			)}
		</div>
	);
}

export { Input };
