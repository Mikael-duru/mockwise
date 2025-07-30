import type { Metadata } from "next";
import { Mona_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const monaSans = Mona_Sans({
	variable: "--font-mona-sans",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "MockWise",
	description:
		"An AI-powered interview mock-prep app designed to help job seekers rehearse, improve, and master their interview skills. Practice real-world interview questions with instant feedback, smart tips, and personalized coaching.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" className="dark">
			<body className={`${monaSans.className} antialiased`}>
				<div className="fixed inset-0 -z-1">
					<div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background"></div>
					<div className="absolute inset-0 bg-[linear-gradient(var(--grid-color)_1px,transparent_1px),linear-gradient(90deg,var(--grid-color)_1px,transparent_1px)] bg-[size:60px_60px]"></div>
				</div>

				{children}

				<Toaster richColors />
			</body>
		</html>
	);
}
