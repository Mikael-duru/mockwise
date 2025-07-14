import React from "react";
import {
	FormControl,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control, Controller, FieldValues, Path } from "react-hook-form";

interface FormFieldProps<T extends FieldValues> {
	name: Path<T>;
	control: Control<T>;
	label?: string;
	placeholder?: string;
	type?: "text" | "password" | "email";
	isLoading?: boolean;
	setDeleteAccount?: (value: any) => void;
}

export const FormField = <T extends FieldValues>({
	name,
	control,
	label,
	placeholder,
	type = "text",
	isLoading,
}: FormFieldProps<T>) => (
	<Controller
		control={control}
		name={name}
		render={({ field }) => (
			<FormItem>
				<FormLabel htmlFor={name} className="label">
					{label}
				</FormLabel>
				<FormControl>
					<Input
						id={name}
						type={type}
						disabled={isLoading}
						isLoading={isLoading}
						className="input"
						placeholder={placeholder}
						showPasswordToggle={type === "password"}
						{...field}
					/>
				</FormControl>
				<FormMessage />
			</FormItem>
		)}
	/>
);

export default FormField;
