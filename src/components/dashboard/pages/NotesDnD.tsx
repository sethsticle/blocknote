"use client";

import { useState } from "react";
import { motion, Reorder } from "framer-motion";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { useRef } from "react";




interface NotesDnDProps {
    notes: Array<{
        id: string;
        image: string;
        title: string;
        createdAt: string;
        page: { subdirectory: string | "" }; // Allow null values here
    }>;
    pageId: string;
}

const NotesDnD: React.FC<NotesDnDProps> = ({ notes, pageId }) => {
    const [reorderedNotes, setReorderedNotes] = useState(notes);
    const tableRef = useRef<HTMLDivElement>(null); // Reference to table container


    const handleReorder = (newOrder: Array<{
        id: string;
        image: string;
        title: string;
        createdAt: string;
        page: { subdirectory: string };
    }>) => {
        setReorderedNotes(newOrder);
    }

    return (
        <div className="overflow-x-auto" ref={tableRef}>
            <Card className="w-full h-screen">
                <CardHeader>
                    <CardTitle className="text-2xl">Notes</CardTitle>
                    <CardDescription>Manage your notes here.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="w-full">
                        <div className="grid grid-cols-[128px_1fr_100px] sm:grid-cols-[128px_1fr_100px_150px_100px] gap-4 bg-white mb-4">
                            <div className="font-bold text-center">Image</div>
                            <div className="font-bold text-center">Title</div>
                            <div className="hidden sm:block ">Created At</div> {/* Hidden on mobile */}
                            <div className="hidden sm:block text-center">Status</div> {/* Hidden on mobile */}
                            <div className="font-bold text-center">Actions</div>
                        </div>
                        <Reorder.Group as="div" axis="y" values={reorderedNotes} onReorder={handleReorder}>
                            {reorderedNotes.map((item) => (
                                <Reorder.Item
                                    key={item.id}
                                    value={item}
                                    dragConstraints={tableRef}
                                    className="grid grid-cols-[128px_1fr_100px] sm:grid-cols-[128px_1fr_100px_150px_100px] gap-4 items-center py-2 border-t-2"
                                >

                                    <Image src={item.image} alt={item.title} className="rounded-sm object-cover" width={128} height={128} />
                                    <div className="text-center">{item.title}</div>
                                    <div className="hidden sm:block">{new Date(item.createdAt).toLocaleDateString()}</div> {/* Hidden on mobile */}
                                    <div className="hidden sm:block text-center">
                                        <Badge className="bg-green-500/10 text-green-500">Published</Badge>
                                    </div> {/* Hidden on mobile */}
                                    <div className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost">Actions</Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuItem>Edit</DropdownMenuItem>
                                                <DropdownMenuItem>Delete</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </Reorder.Item>
                            ))}
                        </Reorder.Group>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default NotesDnD;

//////////////////working but looks shit//////////////////////////////////////////////////////////
// "use client"


// import { useState } from "react";
// import { motion, Reorder } from "framer-motion";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import Image from "next/image";
// import { Badge } from "@/components/ui/badge";
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// interface NotesDnDProps {
//     notes: Array<{
//         id: string;
//         image: string;
//         title: string;
//         createdAt: string;
//         page: { subdirectory: string | "" }; // Allow null values here
//     }>;
//     pageId: string;
// }

// const NotesDnD: React.FC<NotesDnDProps> = ({ notes, pageId }) => {
//     const [reorderedNotes, setReorderedNotes] = useState(notes);

//     const handleReorder = (newOrder: Array<{
//         id: string;
//         image: string;
//         title: string;
//         createdAt: string;
//         page: { subdirectory: string };
//     }>) => {
//         setReorderedNotes(newOrder);
//     }

//     return (

//         <div>
//            <Card className="w-full">
//             <CardHeader>
//                 <CardTitle className="text-2xl">Notes</CardTitle>
//                 <CardDescription>Manage your notes here.</CardDescription>
//             </CardHeader>
//             <CardContent>
//                     <Table>
//                         <TableHeader>
//                             <TableRow>
//                             <TableHead className="w-[400px] bg-white">Image</TableHead>
//                                 <TableHead>Title</TableHead>
//                                 <TableHead className="w-[100px]">Status</TableHead>
//                                 <TableHead className="w-[150px]">Created At</TableHead>
//                                 <TableHead className="text-right w-[100px]">Actions</TableHead>
//                             </TableRow>
//                         </TableHeader>

//                         <TableBody>
//                             < Reorder.Group as="tbody" axis="y" values={reorderedNotes} onReorder={handleReorder}>
//                                 {reorderedNotes.map((item) => (
//                                     <Reorder.Item key={item.id} value={item} >
//                                         <TableRow className="bg-green-300 w-full" key={item.id}>
//                                         <TableCell >
//                                             <Image src={item.image} alt={item.title} className='rounded-sm object-cover border-black-100' width={128} height={128} />
//                                             </TableCell>
//                                             <TableCell>{item.title}</TableCell>
//                                             <TableCell className="w-[100px]"><Badge className="bg-green-500/10 text-green-500">Published</Badge></TableCell>
//                                             <TableCell>{new Date(item.createdAt).toLocaleDateString()}</TableCell>
//                                             <TableCell className="text-right">
//                                                 <DropdownMenu>
//                                                     <DropdownMenuTrigger asChild>
//                                                         <Button variant="ghost">Actions</Button>
//                                                     </DropdownMenuTrigger>
//                                                     <DropdownMenuContent>
//                                                         <DropdownMenuLabel>Actions</DropdownMenuLabel>
//                                                         <DropdownMenuItem>Edit</DropdownMenuItem>
//                                                         <DropdownMenuItem>Delete</DropdownMenuItem>
//                                                     </DropdownMenuContent>
//                                                 </DropdownMenu>
//                                             </TableCell>
//                                         </TableRow>
//                                     </Reorder.Item>
//                                 ))}
//                             </Reorder.Group>
//                         </TableBody>
//                     </Table>
//                 </CardContent>
//             </Card>
//         </div>

//     );
// };

// export default NotesDnD;

////////////////////////////////////////////////////////////

// <Table className="bg-muted/40">
//     <TableHeader>
//         <TableRow>
//             <TableHead>Image</TableHead>
//             <TableHead>Title</TableHead>
//             <TableHead>Status</TableHead>
//             <TableHead>Created At</TableHead>
//             <TableHead className="text-right">Actions</TableHead>
//         </TableRow>
//     </TableHeader>

//     {/* Framer Motion Reorder Group */}
//     < Reorder.Group as="tbody" axis="y" values={reorderedNotes} onReorder={handleReorder}>
//         {reorderedNotes.map((item) => (
//             <Reorder.Item key={item.id} value={item} >
//                 <TableRow>
//                     <TableCell>
//                         <Image src={item.image} alt={item.title} width={64} height={64} className="rounded-md" />
//                     </TableCell>
//                     <TableCell>{item.title}</TableCell>
//                     <TableCell><Badge className="bg-green-500/10 text-green-500">Published</Badge></TableCell>
//                     <TableCell>{new Date(item.createdAt).toLocaleDateString()}</TableCell>
//                     <TableCell className="text-right">
//                         <DropdownMenu>
//                             <DropdownMenuTrigger asChild>
//                                 <Button variant="ghost">Actions</Button>
//                             </DropdownMenuTrigger>
//                             <DropdownMenuContent>
//                                 <DropdownMenuLabel>Actions</DropdownMenuLabel>
//                                 <DropdownMenuItem>Edit</DropdownMenuItem>
//                                 <DropdownMenuItem>Delete</DropdownMenuItem>
//                             </DropdownMenuContent>
//                         </DropdownMenu>
//                     </TableCell>
//                 </TableRow>
//             </Reorder.Item>
//         ))}
//     </Reorder.Group>
// </Table>