"use client";
import React from 'react';
import "@blocknote/core/fonts/inter.css";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useCreateBlockNote } from "@blocknote/react";
import "@blocknote/react/style.css";
import { BlockNoteEditor, PartialBlock } from '@blocknote/core';

import { uploadFiles } from '@/utils/uploadthing';

interface EditorProps {
  onChange: () => void;
  initialContent?: string;
  editable?: boolean;
}

const Editor: React.FC<EditorProps> = ({ onChange, initialContent, editable }) => {
  const editor: BlockNoteEditor = useCreateBlockNote({
    initialContent: initialContent ? (JSON.parse(initialContent) as PartialBlock[]) : undefined, uploadFile: async (file: File) => {
        const [res] = await uploadFiles('imageUploader', {files: [file]});
        return res.url
    }
  
    });

  return (
    <>
      <div className="-mx-14 my-4">
        <BlockNoteView editor={editor} editable={editable} onChange={onChange} theme="dark" />
      </div>
    </>
  );
};

export default Editor;
