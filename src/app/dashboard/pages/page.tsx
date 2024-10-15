import prisma from "@/utils/db";
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

///////////////////Auth goes here////////////////////////////////////////////////////////////////////////////////////////////


    const data = await getData();
    return ()
}