"use client";

// import Cover from "@/components/Cover";
import dynamic from "next/dynamic";
import { useState, useMemo } from "react";
import TextareaAutosize from "react-textarea-autosize";

export default function Home() {
  const [coverUrl, setCoverUrl] = useState<string>();

  const enableCover = async () => {
    const randomImage = await fetch(
      "https://source.unsplash.com/random/landscape"
    );
    setCoverUrl(randomImage.url);
  };

  const Editor = useMemo(
    () => dynamic(() => import("@/components/Editor"), { ssr: false }),
    []
  );

  return (
    <main className="min-h-screen">
      {/* <Cover url={coverUrl} setUrl={setCoverUrl} /> */}
      <div className="flex flex-col px-24 py-10 w-full">
        <div className="group flex flex-col gap-2">
          {!coverUrl && (
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                className="hover:bg-neutral-100 text-neutral-400 rounded-md px-3 py-1 transition-colors"
                onClick={enableCover}
              >
                📷 Add cover
              </button>
            </div>
          )}
          <TextareaAutosize
            placeholder="Untitled"
            className="w-full resize-none appearance-none overflow-hidden bg-transparent text-5xl font-bold focus:outline-none"
          />
        </div>
        <Editor onChange={() => {}} />
      </div>
    </main>
  );
}

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