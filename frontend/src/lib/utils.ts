import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Editor } from "@tiptap/core";
import Color from "@tiptap/extension-color";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import TextStyle from "@tiptap/extension-text-style";
import StarterKit from "@tiptap/starter-kit";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const getPlainText = (content: string) => {
	const editor = new Editor({
		extensions: [StarterKit, Image, Link, Color, TextStyle],
		content: JSON.parse(content),
		editable: false,
	});

	return editor.getText();
};
