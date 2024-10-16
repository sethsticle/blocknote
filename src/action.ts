"use server"

import { redirect } from "next/navigation";
import { parseWithZod } from '@conform-to/zod'
import prisma from "@/utils/db"; //CRUCIAL ERROR DONT FORGET
import { requireUser } from "./utils/requireUser";
import { PageCreationSchema } from "./utils/zodSchema";

export async function CreatePageAction(_prevState: unknown, formData: FormData) {

    const user = await requireUser()

    //setting up infrastructure for subscription tracking
    const [subStatus, pages] = await Promise.all([
        prisma.subscription.findUnique({
            where: {
                userId: user.id,
            },
            select: {
                status: true,
            },
        }),
        prisma.page.findMany({
            where: {
                userId: user.id,
            },
        }),
    ]);

    if (!subStatus || subStatus.status !== "active") {
        if (pages.length < 2) {
            const submission = await parseWithZod(formData, {
                schema: PageCreationSchema({
                    async isSubdirectoryUnique() {
                        const existingSub = await prisma.page.findUnique({
                            where: {
                                userId: user.id,
                                subdirectory: formData.get("subdirectory") as string,
                            },
                        });
                        return !existingSub; //return true is unique and false if not
                    },
                }),
                async: true,
            })


            if (submission.status !== "success") {
                return submission.reply()
            }

            await prisma.page.create({
                data: {
                    description: submission.value.description,
                    name: submission.value.name,
                    subdirectory: submission.value.subdirectory,
                    userId: user.id,
                    imageUrl: submission.value.image,
                }
            })
            return redirect('/dashboard/pages')

        }
        else {
            // User already has two sites, don't allow
            return redirect("/dashboard/pricing");
        }
    } else if (subStatus.status === "active") {
        // User has an active plan, allow site creation
        const submission = await parseWithZod(formData, {
          schema: PageCreationSchema({
            async isSubdirectoryUnique() {
              const existingSubDirectory = await prisma.page.findUnique({
                where: {
                  subdirectory: formData.get("subdirectory") as string,
                },
              });
              return !existingSubDirectory; // Return true if unique, false otherwise
            },
          }),
          async: true,
        });
  
        if (submission.status !== "success") {
          return submission.reply();
        }
  
         await prisma.page.create({
          data: {
            description: submission.value.description,
            name: submission.value.name,
            subdirectory: submission.value.subdirectory,
            userId: user.id,
            imageUrl: submission.value.image
          },
        });
        //console.log('Response:', response);
        return redirect("/dashboard/sites");
      }
  }