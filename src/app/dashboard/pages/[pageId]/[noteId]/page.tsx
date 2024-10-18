// page.tsx
import prisma from "@/utils/db";
import EditorWrapper from "@/components/EditorWrapper";

export default async function Page({ params }: { params: { pageId: string, noteId: string } }) {
  console.log("Params.pageId: ", params.pageId);
  console.log("Params.noteId: ", params.noteId);

  // Fetch the note content from the database using Prisma
  const note = await prisma.note.findFirst({
    where: {
      pageId: params.pageId,
      id: params.noteId,
    },
    select: {
      content: true,
    },
  });

  // Ensure the content is a valid string or undefined
  const initialContent = note?.content && typeof note.content === "object" && note.content !== null
    ? JSON.stringify(note.content) // Convert object content to string
    : typeof note?.content === "string"
    ? note.content // Pass string content directly
    : undefined; // Fallback to undefined if no content

  return (
    <main className="min-h-screen">
      <div className="flex flex-col px-24 py-10 w-full">
        {/* Pass initialContent as a prop to the client-side component */}
        <EditorWrapper initialContent={initialContent} pageId={params.pageId} noteId={params.noteId} />
      </div>
    </main>
  );
}

// "use client"
// import prisma from "@/utils/db";
// // import Cover from "@/components/Cover";
// import dynamic from "next/dynamic";
// import TextareaAutosize from "react-textarea-autosize";
// import { useState, useEffect } from "react";

// export default function Page({ params }: { params: { pageId: string, noteId: string } }) {
//   // const [coverUrl, setCoverUrl] = useState<string>();
//    const [initialContent, setInitialContent] = useState<string | undefined>("loading");
//   // const enableCover = async () => {
//   //   const randomImage = await fetch(
//   //     "https://source.unsplash.com/random/landscape"
//   //   );
//   //   setCoverUrl(randomImage.url);
//   // };

//   // const note = await prisma.note.findUnique({
//   //   where: {
//   //     id: params.noteId,
//   //     pageId: params.pageId, // Ensure both pageId and noteId match
//   //   },
//   //   select: {
//   //     content: true,
//   //   },
//   // });

//   // Function to fetch note content (server-side code)
//   // async function getNoteContent(noteId: string, pageId: string): Promise<string | undefined> {
//   //   const user = await requireUser();
//   //   try {
//   //     const note = await prisma.note.findUnique({
//   //       where: {
//   //         id: noteId,
//   //         pageId: pageId,
//   //       },
//   //       select: {
//   //         content: true,
//   //       },
//   //     });

//   //     if (!note) {
//   //       console.log("Note not found");
//   //       return undefined;
//   //     }

//   //     if (typeof note.content === "object" && note.content !== null) {
//   //       return JSON.stringify(note.content); // Convert object to string
//   //     }

//   //     return note.content as string | undefined; // Return content if it's a string
//   //   } catch (error) {
//   //     console.error("Error fetching note content:", error);
//   //     throw new Error("Failed to load note content");
//   //   }
//   // }

//   // Load the note content using useEffect and set it in state
//   // useEffect(() => {
//   //   async function fetchContent() {
//   //     const content = await getNoteContent(params.noteId, params.pageId);
//   //     setInitialContent(content || ""); // Set initial content once fetched
//   //   }
//   //   fetchContent();
//   // }, [params.noteId, params.pageId]);

//   console.log("Params.pageId: ", params.pageId);
//   console.log("Params.noteId: ", params.noteId);

//   // Fetch the note content from the API route
//   useEffect(() => {
//     async function fetchNoteContent() {
//       try {
//         const response = await fetch(`/api/notes/${params.pageId}/${params.noteId}`);
//         if (response.ok) {
//           const content = await response.json();
//           setInitialContent(content);
//         } else {
//           setInitialContent(undefined);
//           console.error("Failed to fetch note content:", response.status);
//         }
//       } catch (error) {
//         console.error("Error fetching note content:", error);
//         setInitialContent(undefined);
//       }
//     }
  
//     fetchNoteContent();
//   }, [params.pageId, params.noteId]);

//     const Editor = dynamic(() => import("@/components/Editor"), { ssr: false });

//   return (
//     <main className="min-h-screen">
//       {/* <Cover url={coverUrl} setUrl={setCoverUrl} /> */}
//       <div className="flex flex-col px-24 py-10 w-full">
//         <div className="group flex flex-col gap-2">
//           {/* {!coverUrl && (
//             <div className="opacity-0 group-hover:opacity-100 transition-opacity">
//               <button
//                 className="hover:bg-neutral-100 text-neutral-400 rounded-md px-3 py-1 transition-colors"
//                 onClick={enableCover}
//               >
//                 📷 Add cover
//               </button>
//             </div>
//           )} */}
//           <TextareaAutosize
//             placeholder="Untitled"
//             className="w-full resize-none appearance-none overflow-hidden bg-transparent text-5xl font-bold focus:outline-none"
//           />
//         </div>

//         <Editor
//           initialContent={initialContent} // Pass the note content to the editor
//           pageId={params.pageId}
//           noteId={params.noteId}
//           editable={true}
//         />
//       </div>
//     </main>
//   );
// }





////////////////////////*********************////////////////////////////////////////////////*************************///////////////////////////////////////////////////////////////

// // app/dashboard/pages/[pageId]/[noteId]/page.tsx
// "use client"
// import React, { useMemo } from 'react';
// import { notFound } from 'next/navigation';
// import dynamic from 'next/dynamic';
// import prisma from '@/utils/db';
// import { requireUser } from '@/utils/requireUser';
// import { PartialBlock } from '@blocknote/core';
// import { useParams } from 'next/navigation';

// const Editor = useMemo(
//   () => dynamic(() => import("@/components/Editor"), { ssr: false }),
//   []
// );
// interface PageProps {}


// async function getNote(noteId: string) {
//   const user = await requireUser();
//   const note = await prisma.note.findUnique({
//     where: { id: noteId, userId: user.id },
//   });
//   if (!note) notFound();
//   return note;
// }

// export default async function NotePage({ params }: { params: { noteId: string } }) {
//   const note = await getNote(params.noteId);

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-4">{note.title}</h1>
//       <Editor
//         // noteId={params.noteId as string}
//         initialContent={note.content as PartialBlock[]}
//         onChange={() => {
//           // You can add any additional logic here when the note changes
//           console.log('Note changed');
//         }}
//         editable={true}
//       />
//     </div>
//   );
// }
// "use client";
// import React, { useMemo, useState } from 'react';
// import dynamic from 'next/dynamic';
// import TextareaAutoSize from "react-textarea-autosize";
// import { EditorProps } from '@/components/Editor';  // Import the props from Editor

// // Explicitly type the dynamic import

// const Editor = dynamic(() => import('@/components/Editor'), { ssr: false });

// function Page({ pageId, noteId }: { pageId: string, noteId: string }) {
//   const [title, setTitle] = useState("");

//   return (
//     <div>
//       <h1>"blocknote/src/app/dashboard/pages/[pageId]/[slug]/page.tsx"</h1>
//       <TextareaAutoSize
//         placeholder="Untitled"
//         className="w-full resize-none appearance-none overflow-hidden bg-transparent text-5xl font-bold focus:outline-none"
//         value={title}
//         onChange={(e) => setTitle(e.target.value)}
//       />
//        {/* Pass the noteId as prop */}
//        <Editor noteId={noteId} onChange={() => {}} editable={true} />
//     </div>
//   );
// }

// export default Page;