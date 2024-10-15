"use client";

import { useState } from "react";
import { Button } from '@/components/ui/button';
import { PlusCircle, SettingsIcon } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";


import { Reorder } from "framer-motion";

// Temporary data for testing
interface Note {
    id: string;
    title: string;
    createdAt: Date;
    image: string;
}

const testNotes: Note[] = [
    {
        id: '1',
        title: 'First Test Note',
        createdAt: new Date(),
        image: 'https://via.placeholder.com/64',
    },
    {
        id: '2',
        title: 'Second Test Note',
        createdAt: new Date(),
        image: 'https://via.placeholder.com/64',
    },
    {
        id: '3',
        title: 'Third Test Note',
        createdAt: new Date(),
        image: 'https://via.placeholder.com/64',
    }
];

import { useMotionValue } from "framer-motion";
import { useRaisedShadow } from "@/utils/framer-motion/use-raised-shadow"

interface Props {
    item: string;
}

export const Item = ({ item }: Props) => {
    const y = useMotionValue(0);
    const boxShadow = useRaisedShadow(y);

    return (
        <Reorder.Item
            value={item}
            id={item}
            style={{ boxShadow, y }}
            className="h-full w-full"
        >
            <div className="w-full h-full flex justify-center items-center bg-yellow-300">
                <span>{item}</span>
            </div>
        </Reorder.Item>
    );
};

const initialItems = ["🍅 Tomato", "🥒 Cucumber", "🧀 Cheese", "🥬 Lettuce"];


const PageIdRoute = () => {
    const [items, setItems] = useState(initialItems);
    // const [items, setItems] = useState<Note[]>(testNotes);

    return (
        <>
            <div className="h-screen flex flex-col gap-4 justify-center items-center ">
                <div className="w-1/2 h-1/2 rounded-lg shadow-xl overflow-hidden">
                    <Reorder.Group
                        axis="y"
                        onReorder={setItems}
                        values={items}
                        className="w-full h-full flex flex-col gap-4 justify-center items-center bg-slate-200"
                    >
                        {items.map((item) => (
                            <Item key={item} item={item} />
                        ))}
                    </Reorder.Group>
                </div>
            </div>
            {/* Action buttons*/}
            {/* <div className='flex w-full justify-end gap-x-4 mb-4'>
                <Button variant={'secondary'} asChild>
                    <Link href="#"><PlusCircle className='mr-2 size-4' />Create article</Link>
                </Button>

                <Button asChild>
                    <Link href="#"><SettingsIcon className='mr-2 size-4' />Settings</Link>
                </Button>
            </div> */}

            {/* Cards container */}
            {/* <div className="px-8">
                    {items.map((note) => (
                        
                            <Card>
                                <Image
                                    src={note.image}
                                    alt={note.title}
                                    className="rounded-t-lg object-cover w-full h-[200px]"
                                    width={400}
                                    height={200}
                                />
                                <CardHeader>
                                    <CardTitle className="truncate">{note.title}</CardTitle>
                                    <CardDescription className="line-clamp-3">{note.title}</CardDescription>
                                </CardHeader>
                                <CardFooter>
                                    <Button asChild className="w-full">
                                        View Page
                                    </Button>
                                </CardFooter>
                            </Card>
                    ))}
            </div> */}
        </>
    );
};

export default PageIdRoute;


// import prisma from '@/uti/TableRow>ls/db'
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
//     //console.log('User ID in string:', user.id.toString()); // Check if user ID is correct
//     //console.log('Site ID:', params.siteId); // Check if site ID is correct
//     //console.log('prisma query returns below:')
//     //console.log(await prisma.$queryRaw`SELECT "id", "siteId", "title" FROM "Post" WHERE "userId" = ${user.id} AND "siteId" = ${params.siteId};`)

//     //Fetch the data from the post model related to the siteId and also the userId (dont think we need the toString but to be safe)
//     const data = await getData(user.id.toString(), params.pageId.toString())
//     //console.log('Data:', data); // Log fetched data

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
//                     <Link href={`/dashboard/sites/${params.pageId}/create`}><PlusCircle className='mr-2 size-4' />Create article</Link>
//                 </Button>

//                 <Button asChild>
//                     <Link href={`/dashboard/sites/${params.pageId}/settings`}><SettingsIcon className='mr-2 size-4' />Settings</Link>
//                 </Button>
//             </div>

//             {/* default state for no posts made */}
//             {data === undefined || data.length === 0 ? (
//                 <p>No Posts have been made</p>

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
//                                                                 <Link href={`/dashboard/sites/${params.pageId}/${item.id}`}>
//                                                                     Edit</Link>
//                                                             </DropdownMenuItem>
//                                                             <DropdownMenuItem asChild>
//                                                                 <Link href={`/dashboard/sites/${params.pageId}/${item.id}/delete`}
//                                                                 ><span className='text-red-500'>Delete</span></Link>
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