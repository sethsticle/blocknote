"use client"; // Make this a client-side component

import dynamic from "next/dynamic";
import TextareaAutosize from "react-textarea-autosize";
import { useState, useMemo } from "react";

interface EditorWrapperProps {
  initialContent?: string;
  pageId: string;
  noteId: string;
}

const EditorWrapper: React.FC<EditorWrapperProps> = ({ initialContent, pageId, noteId }) => {
  const [title, setTitle] = useState(""); // For TextareaAutosize if needed

  // Dynamically load the Editor component (client-side)
  const Editor = useMemo(
    () => dynamic(() => import("@/components/dashboard/editor/Editor"), { ssr: false }),
    []
  );

  return (
    <div className="flex flex-col gap-2">
      {/* Textarea for note title */}
      <TextareaAutosize
        placeholder="Untitled"
        className="w-full resize-none appearance-none overflow-hidden bg-transparent text-5xl font-bold focus:outline-none"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      
      {/* Render the dynamic Editor component and pass the initial content */}
      <Editor initialContent={initialContent} pageId={pageId} noteId={noteId} editable={true} />
    </div>
  );
};

export default EditorWrapper;
