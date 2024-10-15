//we are piggybacking off of Kinde Auth's creation route to populate our own database
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/utils/db";
import {error} from "console"

//we are creating a GET api request to ask Kinde for the user data, 
//if it is successful, we will create a new user in our database, 
//if it is unsuccessful, we will return the error

export async function GET() {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user || user===null || !user.id) {
        
    }
}