"use server"

import { redirect } from "next/navigation";
import { parseWithZod } from '@conform-to/zod'
import prisma from "@/utils/db"; //CRUCIAL ERROR DONT FORGET
import { requireUser } from "./utils/requireUser";
import { NoteSchema, PageCreationSchema, UpdateNoteContentSchema } from "./utils/zodSchema";

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


  type Note = {
    content: object,
  }  

export async function CreateNoteAction(_prevState: unknown, formData: FormData) {

    const user = await requireUser()
    const submission = parseWithZod(formData, {
      schema: NoteSchema,
    })
    if (submission.status !== 'success') {
        return submission.reply()
    }

    const pageId = formData.get('pageId') as string | null
    if (!pageId) {
        throw new Error('Page ID is missing and required')
    }

    await prisma.note.create({
        data: {
            title: submission.value.title,
            slug: submission.value.slug,
            image: submission.value.image,
            pageId,
            userId: user.id,
            content: undefined
        },
    })

    return redirect(`/dashboard/pages/${formData.get('pageId')}/${submission.value.slug}`)

}



export async function UpdateNoteContentAction( noteId: string, newNote: {content: object} ) {

  const user = await requireUser()

//going to leave zod schema checking on the note for now to get it working
  // const submission = parseWithZod(formData, {
  //   schema: UpdateNoteContentSchema,
  // })

  // const content = formData.get('content') // Assuming content is being sent from formData
  // if (!content) {
  //     throw new Error('Content is missing')
  // }

  // Check if the note belongs to the user

  if (!newNote.content) {
      throw new Error('Content is missing')
  }



  // Find the note and update only the content field
  try {
    const note = await prisma.note.update({
      where: {
        id: noteId,
        userId: user.id,
      },
      data: {
        content: newNote.content,
      },
    });

    return { success: true, note };
  } catch (error) {
    console.error("Error updating note:", error);
    throw new Error('Failed to update note');
  }

  //return redirect(`/dashboard/pages/${note.pageId}/${note.slug}`)
}

// type Note {
//     id: string;
//     title?: string;
//     content?: object,
//     slug: string;
//     image?: string;
//     pageId: string;
//     userId: string;
// }

// export async function saveNoteAction(noteId: string, content: string) {
//     const user = await requireUser();
  
//     // Check if the note belongs to the user
//     const note = await prisma.note.findUnique({
//       where: { id: noteId, userId: user.id },
//     });
  
//     if (!note) {
//       throw new Error("Note not found or unauthorized access");
//     }

//     await prisma.note.update({
//         where: { id: noteId, userId: user.id },
//         data: { content: JSON.parse(content) },  // Save the note content as JSON
//       });
  
//     return { success: true };
//   }