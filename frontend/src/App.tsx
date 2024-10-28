import { Content, generateHTML, JSONContent } from "@tiptap/core";
import { useEffect, useState } from "react";
import { MinimalTiptapEditor } from "./components/minimal-tiptap";
import { TooltipProvider } from "./components/ui/tooltip";
import { StarterKit } from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Color from "@tiptap/extension-color";
import TextStyle from "@tiptap/extension-text-style";

const App = () => {
	const [value, setValue] = useState<Content>("");
	const [html, setHtml] = useState<string>("");

	useEffect(() => {
		if (!value) return;
		const json = value as JSONContent;
		setHtml(
			generateHTML(json, [StarterKit, Image, Link, Color, TextStyle])
		);
	}, [value, html]);

	return (
		<TooltipProvider>
			<div className="w-full p-8 flex">
				<MinimalTiptapEditor
					value={value}
					onChange={setValue}
					className="w-full"
					editorContentClassName="p-5"
					placeholder="Type something..."
					output="json"
					autofocus={true}
					editable={true}
					editorClassName="focus:outline-none"
				/>
				<div
					className="p-4 prose"
					dangerouslySetInnerHTML={{ __html: html }}
				/>
			</div>
		</TooltipProvider>
	);
};

export default App;
