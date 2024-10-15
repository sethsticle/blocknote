import prisma from "@/utils/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
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
    redirect("/api/authlogin")
}
///////////////////Auth goes here////////////////////////////////////////////////////////////////////////////////////////////


    const data = await getData(user.id);
    return (
        <>
        </>
    )
}