import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import prisma from "@/utils/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { PlusCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

async function getData(userid: string) {
    const data = await prisma.page.findMany({
        where: {
            userId: userid,
        },
        orderBy: {
            createdAt: 'desc'
        }
    })
    return data
}


async function Pages() {


    ///////////////////Auth goes here////////////////////////////////////////////////////////////////////////////////////////////
    const { getUser } = getKindeServerSession()
    const user = await getUser()

    if (!user) {
        redirect("/api/auth/login")
    }
    ///////////////////Auth goes here////////////////////////////////////////////////////////////////////////////////////////////


    const data = await getData(user.id);
    return (
        <>
            {/* button */}
            <div className='flex w-full justify-end'>
                <Button asChild><Link href={'/dashboard/pages/new'}>
                    <PlusCircle className='mr-2 size-4' />Create page</Link></Button>
            </div>

            {/* default state */}
            {data === undefined || data.length === 0 ?
                (
                    <p>There are no sites created just yet You are welcome to create some by clicking the button</p>
                ) :
                (

                    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5'>
                        {data.map((item) => (
                            <Card key={item.id}>
                                <Image src={item.imageUrl ?? '/2.png'} alt={item.name}
                                    className='rounded-t-lg object-cover w-full h-[200px]'
                                    width={400} height={200} />

                                <CardHeader>
                                    <CardTitle className='truncate'>{item.name}</CardTitle>
                                    <CardDescription className='line-clamp-3'>{item.description}</CardDescription>
                                </CardHeader>

                                <CardFooter>
                                    <Button asChild className='w-full'>
                                        <Link href={`/dashboard/pages/${item.id}`}>View Page</Link>
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}
        </>
    )
}

export default Pages