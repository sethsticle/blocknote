"use client";

import { uploadFiles } from "@/utils/UploadThing";

// import React, { useMemo, useState } from 'react';÷≥≤µ˜∫√ç≈`åß∂∂ƒ©˙
import "@blocknote/core/fonts/inter.css";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useCreateBlockNote } from "@blocknote/react";
import "@blocknote/react/style.css";
import { BlockNoteEditor, PartialBlock } from '@blocknote/core';

import { UpdateNoteContentAction } from '../action';


import { Button } from './ui/button';

interface EditorProps {
  onChange: () => void;
  initialContent?: string;
  editable?: boolean;
}

const Editor: React.FC<EditorProps> = ({
  onChange,
  initialContent,
  editable = true,
}) => {
  const editor: BlockNoteEditor = useCreateBlockNote({
    initialContent: initialContent
      ? (JSON.parse(initialContent) as PartialBlock[])
      : undefined,
    uploadFile: async (file: File) => {
      const [res] = await uploadFiles("imageUploader", { files: [file] });
      return res.url;
    },
  });

  return (
    <div className="-mx-[54px] my-4">
      <BlockNoteView
        editor={editor}
        editable={editable}
        theme="dark"
        onChange={onChange}
      />
    </div>
  );
};

export default Editor;

// "use client"
// import React, { useMemo, useState } from 'react';
// import "@blocknote/core/fonts/inter.css";
// import { BlockNoteView } from "@blocknote/mantine";
// import "@blocknote/mantine/style.css";
// import { useCreateBlockNote } from "@blocknote/react";
// import "@blocknote/react/style.css";
// import { BlockNoteEditor, PartialBlock } from '@blocknote/core';

// import { UpdateNoteContentAction } from '../action';

// import { uploadFiles } from "../utils/UploadThing";
// import { Button } from './ui/button';


// export interface EditorProps {
//   onChange: () => void;
//   initialContent?: string;
//   editable?: boolean;
//   noteId?: string
// }

// const Editor: React.FC<EditorProps> = ({ onChange, initialContent, editable }) => {
//   const [isSaving, setIsSaving] = useState(false);


//    const editor: BlockNoteEditor = useCreateBlockNote({
//     initialContent: initialContent ? (JSON.parse(initialContent) as PartialBlock[]) : undefined, 
//       uploadFile: async (file: File) => {
//         const [res] = await uploadFiles('imageUploader', { files: [file] });
//         return res.url;
//       }
//     });

//     const handleSaveNote = async () => {
//       setIsSaving(true);
//       try {
//         const content = editor.document;
//         await UpdateNoteContentAction(noteId, { content });
//         onChange();
//       } catch (error) {
//         console.error("Error saving note:", error);
//       } finally {
//         setIsSaving(false);
//       }
//     };

//   return (
//     <div className="-mx-14 my-4">
//       <BlockNoteView editor={editor} editable={editable} theme="light" onChange={onChange}/>
//       <Button 
//         onClick={handleSaveNote} 
//         className="mt-4 p-2 bg-blue-500 text-white rounded"
//         disabled={isSaving}
//       >
//         {isSaving ? 'Saving...' : 'Save Note'}
//       </Button>
//     </div>
//   );
// };



