"use server"

import { redirect } from "next/navigation";
import { parseWithZod } from '@conform-to/zod'
import prisma from "@/utils/db"; //CRUCIAL ERROR DONT FORGET

export async function CreatePageAction(_prevState:unknown, formData: FormData) {
    
}