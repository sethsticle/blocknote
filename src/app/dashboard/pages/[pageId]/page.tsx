
import { Button } from "@/components/ui/button";
import prisma from "@/utils/db";
import { requireUser } from "@/utils/requireUser";
import dynamic from "next/dynamic";
import Link from "next/link";




const NoteDNDWrapper = dynamic(()=> import('@/components/dashboard/pages/NotesDnD'), {ssr: false})

// Server-side data fetching function
async function getData(userId: string, pageId: string) {
    const page = await prisma.page.findUnique({
      where: { id: pageId },
      select: { id: true },
    });
  
    if (!page) return null;
  
    const data = await prisma.note.findMany({
        where: { userId, pageId },
        select: {
          image: true,
          title: true,
          createdAt: true,
          id: true,
          page: { select: { subdirectory: true } },
        },
        orderBy: { createdAt: 'desc' },
      });
      
      // Handle nullable subdirectory
      const formattedData = data.map(item => ({
        ...item,
        createdAt: item.createdAt.toISOString(), // Convert Date to string
        page: { subdirectory: item.page?.subdirectory || "" }, // If page is null, make subdirectory null
      }));
      
      return formattedData;
    
}

export default async function PageIdRoute({ params }: { params: { pageId: string } }) {
    const user = await requireUser();
    const data = await getData(user.id.toString(), params.pageId.toString());
  
    return (
      <main className="container mx-auto p-4 space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Notes</h1>
          <Link href={`/dashboard/pages/${params.pageId}/createnote`}>
            <Button>Create Note</Button>
          </Link>
        </div>
        {!data || data.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-xl">No notes available. Create one to get started.</p>
          </div>
        ) : (
          <NoteDNDWrapper notes={data} pageId={params.pageId} />
        )}
      </main>
    );
  }


///////******WORKING TABLE OF NOTES**************???????????????????? */



// ////////////////////////////////////getData function and original table setup for pages//////////////////////////////////////////////////////

// import { Button } from '@/components/ui/button'
// import { BookIcon, MoreHorizontal, PlusCircle, SettingsIcon } from 'lucide-react'
// import { notFound } from 'next/navigation'
// import Link from 'next/link'
// import React from 'react'
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
// import Image from 'next/image'
// import { Badge } from '@/components/ui/badge'
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
// // import { EmptyState } from '@/app/components/dashboard/EmptyState'
// import { requireUser } from '@/utils/requireUser'
// import prisma from '@/utils/db'
// import { EmptyState } from '@/components/dashboard/EmptyState'

// //  
// //  
// // we want to fetch the data from the post model related to the pageId and also the userId
// // we will get the user and page id through params and when called just passed as args

// async function getData(userId: string, pageId: string) {
//     try {
//         // First, find the page to ensure it exists
//         const page = await prisma.page.findUnique({
//             where: {
//                 id: pageId,
//             },
//             select: {
//                 id: true, // We're just checking if the site exists
//             },
//         });

//         if (!page) {
//             // If the site is not found, throw notFound()
//             notFound(); // This will automatically trigger the Next.js 404 page
//         }

//         // Fetch related posts if the site exists
//         const data = await prisma.note.findMany({
//             where: {
//                 userId,
//                 pageId,
//             },
//             select: {
//                 image: true,
//                 title: true,
//                 createdAt: true,
//                 id: true,
//                 page: {
//                     select: {
//                         subdirectory: true,
//                     },
//                 },
//             },
//             orderBy: { createdAt: 'desc' },
//         });

//         return data;
//     } catch (error) {
//         console.error("Error fetching data:", error);
//         notFound(); // Also trigger 404 in case of any other errors
//     }
// }


// //server component->safe for async
// //params of the siteId->relates to [siteId]
// async function PageIdRoute({ params, }: { params: { pageId: string } }) {

//     const user = await requireUser()
//     ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//     //console.log('User ID:', user.id); // Check if user ID is correct
//     console.log('User ID in string:', user.id.toString()); // Check if user ID is correct
//     console.log('Page ID:', params.pageId); // Check if page ID is correct
//     console.log('prisma query returns below:')
//     //console.log(await prisma.$queryRaw`SELECT "id", "pageId", "title" FROM "Page" WHERE "userId" = ${user.id} AND "pageId" = ${params.pageId};`)

//     //Fetch the data from the post model related to the siteId and also the userId (dont think we need the toString but to be safe)
//     const data = await getData(user.id.toString(), params.pageId.toString())
//     console.log('Data:', data); // Log fetched data
    

//     return (
//         <>
//             {/* buttons */}
//             <div className='flex w-full justify-end gap-x-4'>
//                 <Button variant={'secondary'} asChild>
//                     {data.length > 0 && data[0]?.page && (
//                         <Link href={`/blog/${data[0].page.subdirectory}`}><BookIcon className='mr-2 size-4' />View Blog</Link>
//                     )}
//                 </Button>

//                 <Button variant={'secondary'} asChild>
//                     <Link href={`/dashboard/pages/${params.pageId}/createnote`}><PlusCircle className='mr-2 size-4' />Create note</Link>
//                 </Button>

//                 <Button asChild>
//                     <Link href={`/dashboard/sites/${params.pageId}/settings`}><SettingsIcon className='mr-2 size-4' />Settings</Link>
//                 </Button>
//             </div>

//             {/* default state for no notes made */}
//             {data === undefined || data.length === 0 ? (
//                 <EmptyState title='No notes made' description='Create a new note to get started' path={`/dashboard/pages/${params.pageId}/createnote`} />

//             ) :
//                 // table displaying the posts made
//                 (
//                     <div>
//                         <Card className=''>
//                             <CardHeader>
//                                 <CardTitle className='text-2xl'>Posts</CardTitle>
//                                 <CardDescription>Manage your posts in a simple and intuitive interface</CardDescription>
//                             </CardHeader>
//                             <CardContent>
//                                 <Table>
//                                     <TableHeader>
//                                         <TableRow>
//                                             <TableHead>Image</TableHead>
//                                             <TableHead>Title</TableHead>
//                                             <TableHead>Status</TableHead>
//                                             <TableHead>Created At</TableHead>
//                                             <TableHead className='text-right'>Actions</TableHead>
//                                         </TableRow>
//                                     </TableHeader>
//                                     <TableBody>

//                                         {data.map((item) => (

//                                             <TableRow key={item.id}>
//                                                 <TableCell>
//                                                     <Image src={item.image} alt={item.title} className='size-16 rounded-md object-cover' width={64} height={64} />
//                                                 </TableCell>
//                                                 <TableCell className=''>{item.title}</TableCell>
//                                                 <TableCell><Badge className='bg-green-500/10 text-green-500' variant={'outline'}>Published</Badge></TableCell>
//                                                 <TableCell>{item.createdAt.toDateString()}</TableCell>
//                                                 <TableCell className="text-end">
//                                                     <DropdownMenu>
//                                                         <DropdownMenuTrigger asChild>
//                                                             <Button size="icon" variant="ghost">
//                                                                 <MoreHorizontal className="size-4" />
//                                                             </Button>
//                                                         </DropdownMenuTrigger>
//                                                         <DropdownMenuContent align="end">
//                                                             <DropdownMenuLabel>Actions</DropdownMenuLabel>
//                                                             <DropdownMenuSeparator />
//                                                             <DropdownMenuItem asChild>
//                                                                 <Link href={`/dashboard/pages/${params.pageId}/${item.id}`}>
//                                                                     Edit</Link>
//                                                             </DropdownMenuItem>
//                                                             <DropdownMenuItem >
//                                                                 {/* <Link href={`/dashboard/pages/${params.pageId}/${item.id}/delete`}
//                                                                 ><span className='text-red-500'>Delete</span></Link>
//                                                                  */}
//                                                                  delete page
//                                                             </DropdownMenuItem>
//                                                         </DropdownMenuContent>
//                                                     </DropdownMenu>
//                                                 </TableCell>
//                                             </TableRow>
//                                         ))}
//                                     </TableBody>
//                                 </Table>
//                             </CardContent>
//                         </Card>
//                     </div>
//                 )}
//         </>
//     )
// }

// export default PageIdRoute

////**************WORKING ON THIS PAGE****************

// // "use client"
// import React, {
//     Dispatch,
//     SetStateAction,
//     useState,
//     DragEvent,
//     FormEvent,
//   } from "react";
//   import { FiPlus, FiTrash } from "react-icons/fi";
//   import { motion } from "framer-motion";
//   import { FaFire } from "react-icons/fa";
//   import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"; // Importing Shadcn card
// import prisma from "@/utils/db";
// import { notFound, redirect } from "next/navigation";
// import { requireUser } from "@/utils/requireUser";
// import Image from "next/image";
// import { Button } from "@/components/ui/button";
// import { Link } from "lucide-react";


// //TYPES//////////////////////////////////////////////////////////
// type ColumnType = "backlog" | "todo" | "doing" | "done";

// type NoteType = {
//     title: string;
//     id: string;
//     image: string
//     slug: string
//     column: ColumnType;
//     page: {
//         subdirectory: string;
//     } | null;
//     createdAt: Date;
//   };

// type CardProps = NoteType & {
//     handleDragStart: Function;
//   };  

// type ColumnProps = {
//     title: string;
//     headingColor: string;
//     notes: NoteType[];
//     column: ColumnType;
//     setNotes: Dispatch<SetStateAction<NoteType[]>>;
//   };

// type AddCardProps = {
//     column: ColumnType;
//     setNotes: Dispatch<SetStateAction<NoteType[]>>;
//   };

// type DropIndicatorProps = {
//     beforeId: string | null;
//     column: string;
//   };


// //DATABSE QUERY//////////////////////////////////////////////////////////
//   async function getData(userId: string, pageId: string) {
//     try {
//         // First, find the page to ensure it exists
//         const page = await prisma.page.findUnique({
//             where: {
//                 id: pageId,
//             },
//             select: {
//                 id: true, // We're just checking if the site exists
//             },
//         });

//         if (!page) {
//             // If the site is not found, throw notFound()
//             notFound(); // This will automatically trigger the Next.js 404 page 
//         }

//         // Fetch related posts if the site exists
//         const data = await prisma.note.findMany({
//             where: {
//                 userId,
//                 pageId,
//             },
//             select: {
//                 image: true,
//                 title: true,
//                 createdAt: true,
//                 id: true,
//                 page: {
//                     select: {
//                         subdirectory: true,
//                     },
//                 },
//             },
//             orderBy: { createdAt: 'desc' },
//         });

//         return data;
//     } catch (error) {
//         console.error("Error fetching data:", error);
//         notFound(); // Also trigger 404 in case of any other errors
//     }
// }


// //Default data//////////////////////////////////////////////////////////

// //   const DEFAULT_CARDS: NoteType[] = [
// //     // BACKLOG
// //     { title: "Look into render bug in dashboard", id: "1", column: "backlog" },
// //     { title: "SOX compliance checklist", id: "2", column: "backlog" },
// //     { title: "[SPIKE] Migrate to Azure", id: "3", column: "backlog" },
// //     { title: "Document Notifications service", id: "4", column: "backlog" },
// //     // TODO
// //     {
// //       title: "Research DB options for new microservice",
// //       id: "5",
// //       column: "todo",
// //     },
// //     { title: "Postmortem for outage", id: "6", column: "todo" },
// //     { title: "Sync with product on Q3 roadmap", id: "7", column: "todo" },
  
// //     // DOING
// //     {
// //       title: "Refactor context providers to use Zustand",
// //       id: "8",
// //       column: "doing",
// //     },
// //     { title: "Add logging to daily CRON", id: "9", column: "doing" },
// //     // DONE
// //     {
// //       title: "Set up DD dashboards for Lambda listener",
// //       id: "10",
// //       column: "done",
// //     },
// //   ];

// //Methods//////////////////////////////////////////////////////////

// //how do i recieve the data prop from the parent component?

// const Board = ({notes}: {notes: NoteType[]}) => {

//     const [notesState, setNotes] = useState<NoteType[]>(notes);
    

//     return (
//         <div className="flex h-full w-full gap-3 overflow-scroll p-12">
//           <Column
//             title="Backlog"
//             column="backlog"
//             headingColor="text-neutral-500"
//             notes={notesState.filter(note => note.column === "backlog")}
//             setNotes={setNotes}
//           />
//           <Column
//             title="TODO"
//             column="todo"
//             headingColor="text-yellow-200"
//             notes={notesState.filter(note => note.column === "todo")}
//             setNotes={setNotes}
//           />
//           <Column
//             title="In progress"
//             column="doing"
//             headingColor="text-blue-200"
//             notes={notesState.filter(note => note.column === "doing")}
//             setNotes={setNotes}
//           />
//           <Column
//             title="Complete"
//             column="done"
//             headingColor="text-emerald-200"
//             notes={notesState.filter(note => note.column === "done")}
//             setNotes={setNotes}
//           />
//           <BurnBarrel setNotes={setNotes} />
//         </div>
//       );
//   };

//   const Column = ({
//     title,
//     headingColor,
//     notes,
//     column,
//     setNotes,
//   }: ColumnProps) => {
//     const [active, setActive] = useState(false);
  
//     const handleDragStart = (e: DragEvent, note: NoteType) => {
//       e.dataTransfer.setData("noteId", note.id);
//     };
  
//     const handleDragEnd = (e: DragEvent) => {
//         const noteId = e.dataTransfer.getData("noteId");
//         setActive(false);
//         clearHighlights();
    
//         const indicators = getIndicators();
//         const { element } = getNearestIndicator(e, indicators);
    
//         const before = element.dataset.before || "-1";
    
//         if (before !== noteId) {
//           let copy = [...notes];
    
//           let noteToTransfer = copy.find((n) => n.id === noteId);
//           if (!noteToTransfer) return;
//           noteToTransfer = { ...noteToTransfer, column };
    
//           copy = copy.filter((n) => n.id !== noteId);
    
//           const moveToBack = before === "-1";
    
//           if (moveToBack) {
//             copy.push(noteToTransfer);
//           } else {
//             const insertAtIndex = copy.findIndex((el) => el.id === before);
//             if (insertAtIndex === undefined) return;
//             copy.splice(insertAtIndex, 0, noteToTransfer);
//           }
    
//           setNotes(copy);
//         }
//       };
  
//       const handleDragOver = (e: DragEvent) => {
//         e.preventDefault();
//         highlightIndicator(e);
//         setActive(true);
//       };
  
//     const clearHighlights = (els?: HTMLElement[]) => {
//       const indicators = els || getIndicators();
  
//       indicators.forEach((i) => {
//         i.style.opacity = "0";
//       });
//     };
  
//     const highlightIndicator = (e: DragEvent) => {
//       const indicators = getIndicators();
  
//       clearHighlights(indicators);
  
//       const el = getNearestIndicator(e, indicators);
  
//       el.element.style.opacity = "1";
//     };
  
//     const getNearestIndicator = (e: DragEvent, indicators: HTMLElement[]) => {
//       const DISTANCE_OFFSET = 50;
  
//       const el = indicators.reduce(
//         (closest, child) => {
//           const box = child.getBoundingClientRect();
  
//           const offset = e.clientY - (box.top + DISTANCE_OFFSET);
  
//           if (offset < 0 && offset > closest.offset) {
//             return { offset: offset, element: child };
//           } else {
//             return closest;
//           }
//         },
//         {
//           offset: Number.NEGATIVE_INFINITY,
//           element: indicators[indicators.length - 1],
//         }
//       );
  
//       return el;
//     };
  
//     const getIndicators = () => {
//       return Array.from(
//         document.querySelectorAll(
//           `[data-column="${column}"]`
//         ) as unknown as HTMLElement[]
//       );
//     };
  
//     const handleDragLeave = () => {
//       clearHighlights();
//       setActive(false);
//     };
  
//     const filteredNotes = notes.filter((n) => n.column === column);
  
//     return (
//         <div className="w-56 shrink-0">
//         <div className="mb-3 flex items-center justify-between">
//           <h3 className={`font-medium ${headingColor}`}>{title}</h3>
//           <span className="rounded text-sm text-neutral-400">{filteredNotes.length}</span>
//         </div>
//         <div
//           onDrop={handleDragEnd}
//           onDragOver={handleDragOver}
//           className={`h-full w-full transition-colors ${
//             active ? "bg-neutral-800/50" : "bg-neutral-800/0"
//           }`}
//         >
//           {filteredNotes.map((n) => (
//             <NoteCard key={n.id} {...n} handleDragStart={handleDragStart} />
//           ))}
//           <DropIndicator beforeId={null} column={column} />
//         </div>
//       </div>
//     );
//   };

//   const NoteCard = ({ id, title, image, column, handleDragStart, slug }: CardProps) => {
//     return (
//       <>
//         <DropIndicator beforeId={id} column={column} />
//         <motion.div
//           layout
//           layoutId={id}
//           draggable="true"
//           onDragStart={(e) => handleDragStart(e, { id, title, column })}
//           className="cursor-grab rounded bg-neutral-800 p-3"
//         >
//           {/* Shadcn UI Card displaying the note */}
//           <Card className="p-3 text-sm">
//             <Image
//                 src = {image ?? 'https://via.placeholder.com/64'}
//                 alt = {title}
//                 className="rounded-t-lg object-cover w-full h-[200px]"
//                 width = {400}
//                 height = {200}
//               />
//             <CardHeader>
//               <CardTitle className="truncate">{title}</CardTitle>
//             </CardHeader>
            
//             <CardFooter>
//              <Button asChild>
//                 <Link href={`#`}>
//                 </Link>
//              </Button>
//             </CardFooter>
//           </Card>
//         </motion.div>
//       </>
//     );
//   };

//   const DropIndicator = ({ beforeId, column }: DropIndicatorProps) => {
//     return (
//       <div
//         data-before={beforeId || "-1"}
//         data-column={column}
//         className="my-0.5 h-0.5 w-full bg-violet-400 opacity-0"
//       />
//     );
//   };

//   const BurnBarrel = ({
//     setNotes,
//   }: {
//     setNotes: Dispatch<SetStateAction<NoteType[]>>;
//   }) => {
//     const [active, setActive] = useState(false);
  
//     // const handleDragOver = (e: DragEvent) => {
//     //   e.preventDefault();
//     //   setActive(true);
//     // };
  
//     // const handleDragLeave = () => {
//     //   setActive(false);
//     // };
  
//     // const handleDragEnd = (e: DragEvent) => {
//     //   const cardId = e.dataTransfer.getData("cardId");
  
//     //   setCards((pv) => pv.filter((c) => c.id !== cardId));
  
//     //   setActive(false);
//     // };
  
//     return (
//       <div
//         // onDrop={handleDragEnd}
//         // onDragOver={handleDragOver}
//         // onDragLeave={handleDragLeave}
//         className={`mt-10 grid h-56 w-56 shrink-0 place-content-center rounded border text-3xl ${
//           active
//             ? "border-red-800 bg-red-800/20 text-red-500"
//             : "border-neutral-500 bg-neutral-500/20 text-neutral-500"
//         }`}
//       >
//         {active ? <FaFire className="animate-bounce" /> : <FiTrash />}
//       </div>
//     );
//   };

// // const AddCard = ({ column, setCards }: AddCardProps) => {
// //     const [text, setText] = useState("");
// //     const [adding, setAdding] = useState(false);
  
// //     const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
// //       e.preventDefault();
  
// //       if (!text.trim().length) return;
  
// //       const newCard = {
// //         column,
// //         title: text.trim(),
// //         id: Math.random().toString(),
// //       };
  
// //       setCards((pv) => [...pv, newCard]);
  
// //       setAdding(false);
// //     };
  
// //     return (
// //       <>
// //         {adding ? (
// //           <motion.form layout onSubmit={handleSubmit}>
// //             <textarea
// //               onChange={(e) => setText(e.target.value)}
// //               autoFocus
// //               placeholder="Add new task..."
// //               className="w-full rounded border border-violet-400 bg-violet-400/20 p-3 text-sm text-neutral-50 placeholder-violet-300 focus:outline-0"
// //             />
// //             <div className="mt-1.5 flex items-center justify-end gap-1.5">
// //               <button
// //                 onClick={() => setAdding(false)}
// //                 className="px-3 py-1.5 text-xs text-neutral-400 transition-colors hover:text-neutral-50"
// //               >
// //                 Close
// //               </button>
// //               <button
// //                 type="submit"
// //                 className="flex items-center gap-1.5 rounded bg-neutral-50 px-3 py-1.5 text-xs text-neutral-950 transition-colors hover:bg-neutral-300"
// //               >
// //                 <span>Add</span>
// //                 <FiPlus />
// //               </button>
// //             </div>
// //           </motion.form>
// //         ) : (
// //           <motion.button
// //             layout
// //             onClick={() => setAdding(true)}
// //             className="flex w-full items-center gap-1.5 px-3 py-1.5 text-xs text-neutral-400 transition-colors hover:text-neutral-50"
// //           >
// //             <span>Add card</span>
// //             <FiPlus />
// //           </motion.button>
// //         )}
// //       </>
// //     );
// //   };





//   async function PageIdRoute({ params, }: { params: { pageId: string } }) {

//     const user = await requireUser()
//     ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//     //console.log('User ID:', user.id); // Check if user ID is correct
//     //console.log('User ID in string:', user.id.toString()); // Check if user ID is correct
//     //console.log('Site ID:', params.siteId); // Check if site ID is correct
//     //console.log('prisma query returns below:')
//     //console.log(await prisma.$queryRaw`SELECT "id", "siteId", "title" FROM "Post" WHERE "userId" = ${user.id} AND "siteId" = ${params.siteId};`)

//     //Fetch the data from the post model related to the siteId and also the userId (dont think we need the toString but to be safe)
//     const data = await getData(user.id.toString(), params.pageId.toString())
    
//     console.log('Data:', data); // Log fetched data
//     console.log("from sources userid: ", user.id.toString(), " pageid: ", params.pageId.toString())


//     return (
//         <div className="h-screen w-full bg-neutral-900 text-neutral-50">
//                 //how do I pass the data to the board component?
//                 <Board notes={data} />
            
//          </div>
//     )

// }
    
// export default PageIdRoute

/////////////////////////////////////framer motion simple vertical dragging list///////////////////////////////////////////////////////////////v

// "use client";

// import { useState } from "react";
// import { Button } from '@/components/ui/button';
// import { PlusCircle, SettingsIcon } from 'lucide-react';
// import Link from 'next/link';
// import Image from 'next/image';
// import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";


// import { Reorder } from "framer-motion";

// // Temporary data for testing
// interface Note {
//     id: string;
//     title: string;
//     createdAt: Date;
//     image: string;
// }

// const testNotes: Note[] = [
//     {
//         id: '1',
//         title: 'First Test Note',
//         createdAt: new Date(),
//         image: 'https://via.placeholder.com/64',
//     },
//     {
//         id: '2',
//         title: 'Second Test Note',
//         createdAt: new Date(),
//         image: 'https://via.placeholder.com/64',
//     },
//     {
//         id: '3',
//         title: 'Third Test Note',
//         createdAt: new Date(),
//         image: 'https://via.placeholder.com/64',
//     }
// ];

// import { useMotionValue } from "framer-motion";
// import { useRaisedShadow } from "@/utils/framer-motion/use-raised-shadow"

// interface Props {
//     item: string;
// }

// export const Item = ({ item }: Props) => {
//     const y = useMotionValue(0);
//     const boxShadow = useRaisedShadow(y);

//     return (
//         <Reorder.Item
//             value={item}
//             id={item}
//             style={{ boxShadow, y }}
//             className="h-full w-full"
//         >
//             <div className="w-full h-full flex justify-center items-center bg-yellow-300">
//                 <span>{item}</span>
//             </div>
//         </Reorder.Item>
//     );
// };

// const initialItems = ["🍅 Tomato", "🥒 Cucumber", "🧀 Cheese", "🥬 Lettuce"];


// const PageIdRoute = () => {
//     const [items, setItems] = useState(initialItems);
//     // const [items, setItems] = useState<Note[]>(testNotes);

//     return (
//         <>
//             <div className="h-screen flex flex-col gap-4 justify-center items-center ">
//                 <div className="w-1/2 h-1/2 rounded-lg shadow-xl overflow-hidden">
//                     <Reorder.Group
//                         axis="y"
//                         onReorder={setItems}
//                         values={items}
//                         className="w-full h-full flex flex-col gap-4 justify-center items-center bg-slate-200"
//                     >
//                         {items.map((item) => (
//                             <Item key={item} item={item} />
//                         ))}
//                     </Reorder.Group>
//                 </div>
//             </div>
//             {/* Action buttons*/}
//             {/* <div className='flex w-full justify-end gap-x-4 mb-4'>
//                 <Button variant={'secondary'} asChild>
//                     <Link href="#"><PlusCircle className='mr-2 size-4' />Create article</Link>
//                 </Button>

//                 <Button asChild>
//                     <Link href="#"><SettingsIcon className='mr-2 size-4' />Settings</Link>
//                 </Button>
//             </div> */}

//             {/* Cards container */}
//             {/* <div className="px-8">
//                     {items.map((note) => (
                        
//                             <Card>
//                                 <Image
//                                     src={note.image}
//                                     alt={note.title}
//                                     className="rounded-t-lg object-cover w-full h-[200px]"
//                                     width={400}
//                                     height={200}
//                                 />
//                                 <CardHeader>
//                                     <CardTitle className="truncate">{note.title}</CardTitle>
//                                     <CardDescription className="line-clamp-3">{note.title}</CardDescription>
//                                 </CardHeader>
//                                 <CardFooter>
//                                     <Button asChild className="w-full">
//                                         View Page
//                                     </Button>
//                                 </CardFooter>
//                             </Card>
//                     ))}
//             </div> */}
//         </>
//     );
// };

// export default PageIdRoute;



   
