"use client";
import { useState } from "react";

export function CopyButton({ content }: { content: string }) {
	const [copied, setCopied] = useState(false);

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(content);
			setCopied(true);
			setTimeout(() => setCopied(false), 1500);
		} catch (e) {
			console.error("Не удалось скопировать:", e);
		}
	};

	return (
		<button
			type="button"
			onClick={handleCopy}
			className="flex items-center justify-center text-gray-500 hover:text-black transition-colors"
			aria-label="Скопировать"
		>
			{copied ? <CheckIcon /> : <CopyIcon />}
		</button>
	);
}

function CopyIcon() {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="14"
			height="14"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<title>copy</title>
			<rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
			<path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
		</svg>
	);
}

function CheckIcon() {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="18"
			height="18"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			className="text-green-600"
		>
			<title>copied</title>
			<path d="M20 6 9 17l-5-5" />
		</svg>
	);
}
