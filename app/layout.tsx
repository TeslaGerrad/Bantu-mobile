import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Ichalo Bantu",
	icons: {
		icon: "/ichalo-1.jpg",
	},
	description: "Report Any Case Anonymously",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={`${inter.className} w-full`}>{children}</body>
		</html>
	);
}
