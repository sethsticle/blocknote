"use client";

import { uploadFiles } from "@/utils/UploadThing";
import "@blocknote/core/fonts/inter.css";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import "@blocknote/react/style.css";
import { BlockNoteEditor, BlockNoteSchema, defaultBlockSpecs, PartialBlock } from '@blocknote/core';
import { useEffect, useMemo, useState } from "react";
import { Button } from "./ui/button";

import { UpdateNoteContentAction } from "@/action";

// Custom schema that removes audio and video blocks
const schema = BlockNoteSchema.create({
  blockSpecs: {
    ...defaultBlockSpecs,
    audio: undefined as any,
    video: undefined as any,
  },
});

// export async function getNoteContent(noteId: string, pageId: string): Promise<PartialBlock[] | undefined> {
//   const user = await requireUser();
//   try {
    
//     if (!note) {
//       console.log('Note not found');
//       return undefined;
//     }

//     // Validate if the content can be parsed as PartialBlock[]
//     const parsedContent = (note.content as PartialBlock[]) || [];
    
//     return parsedContent;
//   } catch (error) {
//     console.error("Error fetching note content:", error);
//     throw new Error("Failed to load note content");
//   }
// }


// async function saveNoteContent(noteId: string, jsonBlocks: Block[]) {
//   try {
//     await UpdateNoteContentAction(noteId, { content: jsonBlocks });
//     console.log("Note content saved to the database");
//   } catch (error) {
//     console.error("Error saving note content:", error);
//   }
// }

// Functions for STORAGE
// async function saveToStorage(jsonBlocks: Block[]) {
//   localStorage.setItem("editorContent", JSON.stringify(jsonBlocks));
//   console.log("Saved to local storage");
// }

// //Function for LOADING
// async function loadFromStorage() {
//   const storageString = localStorage.getItem("editorContent");
//   return storageString
//     ? (JSON.parse(storageString) as PartialBlock[])
//     : undefined;
// }

// Editor component with storage functionality


interface EditorProps {
  //onChange?: () => void;
  initialContent?: string;
  editable?: boolean;
  pageId: string;
  noteId: string;
}

const Editor: React.FC<EditorProps> = ({ initialContent, pageId, noteId, editable}) => {
  // State to manage the initial content load status
  const [loadedContent, setLoadedContent] = useState<PartialBlock[] | "loading">("loading");

  // Effect to load content from  storage on mount
  useEffect(() => {
    // Parse the initial content from the server-side into BlockNote format
    if (initialContent) {
      setLoadedContent(JSON.parse(initialContent) as PartialBlock[]);
    } else {
      setLoadedContent([{
        type: "paragraph",
        content: "Start writing here...",
      }] as PartialBlock[]);
    }
  }, [initialContent]);

  // Memoized editor initialization after content is loaded
  const editor = useMemo(() => {
    if (loadedContent === "loading") return undefined;

    return BlockNoteEditor.create({
      initialContent: loadedContent,
      schema,
      uploadFile: async (file: File) => {
        try {
          const [res] = await uploadFiles("imageUploader", { files: [file] }); // Ensure that "imageUploader" matches your server-side configuration
          if (res && res.url) {
            return res.url; // Return the file URL for rendering in the editor
          } else {
            console.error("Upload failed: No URL returned");
            return "";
          }
        } catch (error) {
          console.error("Upload failed:", error);
          return "";
        }
      }
    });
  }, [loadedContent]);

  if (editor === undefined) {
    return <p>Loading editor content...</p>;  // Loading state before editor is ready
  }

   // Save the content back to the server when user clicks "Save"
   const handleSave = async () => {
    try {
      await UpdateNoteContentAction(noteId, { content: editor.document });
      console.log("Note content saved");
    } catch (error) {
      console.error("Error saving note:", error);
    }
  };

  // Render the editor and save content on changes
  return (
    <div className="-mx-[54px] my-4">
      <BlockNoteView
        editor={editor}
        editable={true}
        theme="dark"
        onChange={() => {
          console.log("BlockNoteView OnChange triggered"); // Save content to local storage on every change
        }}
      />
       <Button onClick={handleSave}>Save</Button>
       <Button
  onClick={async () => {
    const file = new File(["test"], "/2.png", { type: "image/png" });
    const [res] = await uploadFiles("imageUploader", { files: [file] });
    console.log("Upload test response:", res);
  }}
>
  Test Upload
</Button>
    </div>
  );
};

export default Editor;


// "use client";



// import { uploadFiles } from "@/utils/UploadThing";

// // import React, { useMemo, useState } from 'react';÷≥≤µ˜∫√ç≈`åß∂∂ƒ©˙
// import "@blocknote/core/fonts/inter.css";
// import { BlockNoteView } from "@blocknote/mantine";
// import "@blocknote/mantine/style.css";
// import { useCreateBlockNote } from "@blocknote/react";
// import "@blocknote/react/style.css";
// import { Block, BlockNoteEditor, BlockNoteSchema, defaultBlockSpecs, PartialBlock } from '@blocknote/core';

// import { UpdateNoteContentAction } from '../action';


// import { Button } from './ui/button';
// // Inside your Editor component or wherever you create the editor instance
// const schema = BlockNoteSchema.create({
//   blockSpecs: {
//     // Use the default block specs
//     ...defaultBlockSpecs,

//     // Remove the audio and video blocks
//     audio: undefined as any,
//     video: undefined as any,
//     // Add a new block spec for a custom slash menu item
//   },
// });

// async function saveToStorage(jsonBlocks: Block[]) {
//   // Save contents to local storage. You might want to debounce this or replace
//   // with a call to your API / database.
//   localStorage.setItem("editorContent", JSON.stringify(jsonBlocks));
//   console.log("Saved to local storage");
// }
 
// async function loadFromStorage() {
//   // Gets the previously stored editor contents.
//   const storageString = localStorage.getItem("editorContent");
//   return storageString
//     ? (JSON.parse(storageString) as PartialBlock[])
//     : undefined;
// }




// interface EditorProps {
//   onChange: () => void;
//   initialContent?: string;
//   editable?: boolean;
// }


// const Editor: React.FC<EditorProps> = ({ onChange, initialContent,editable = true,}) => {
  
  
//   const editor: BlockNoteEditor = useCreateBlockNote({
//     initialContent: initialContent
//       ? (JSON.parse(initialContent) as PartialBlock[])
//       : undefined,
//       uploadFile: async (file: File) => {
//         try {
//           const [res] = await uploadFiles("imageUploader", { files: [file] });
//           if (res && res.url) {
//             return res.url;
//           } else {
//             console.error("Upload failed: No URL returned");
//             return "";
//           }
//         } catch (error) {
//           console.error("Upload failed:", error);
//           return "";
//         }
//       },
//       schema,
//   });

//   return (
//     <div className="-mx-[54px] my-4">
//       <BlockNoteView
//         editor={editor}
//         editable={editable}
//         theme="dark"
//         onChange={onChange}
//       />
//     </div>
//   );
// };

// export default Editor;

/////////*****************/////////*****************/////////*****************/////////*****************/////////*****************/////////*****************
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



