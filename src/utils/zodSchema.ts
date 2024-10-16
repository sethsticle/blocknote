import { conformZodMessage } from "@conform-to/zod";
import { z } from "zod";

// Define the schema for title and editor content
export const editorSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title must be less than 100 characters"),
  content: z.string().min(1, "Content is required") // Editor content as JSON string
});



export const PageSchema = z.object({
  name: z.string().min(1, "Name is required").max(40, "Name must be less than 40 characters"),
  description: z.string().min(1, "Description is required").max(200, "Description must be less than 200 characters"),
  subdirectory: z.string().min(1, "Subdirectory is required").max(40, "Subdirectory must be less than 40 characters"),
  image: z.string().min(1, "Image is required")
})

export function PageCreationSchema(options?: {
  isSubdirectoryUnique: () => Promise<boolean>;
}) {
  return z.object({
    subdirectory: z
        .string()
        .min(1)
        .max(40)
        .regex(/^[a-z]+$/, "Subdirectory must only use lowercase letters.")
        .transform((value) => value.toLocaleLowerCase())
        .pipe(
          z.string().superRefine((email, ctx) => {
            if (typeof options?.isSubdirectoryUnique !== "function") {
              ctx.addIssue({
                code: "custom",
                message: conformZodMessage.VALIDATION_UNDEFINED,
                fatal: true,
              });
              return;
            }
  
            return options.isSubdirectoryUnique().then((isUnique) => {
              if (!isUnique) {
                ctx.addIssue({
                  code: "custom",
                  message: "Subdirectory is already taken...",
                });
              }
            });
          })
        ),
        name: z.string().min(1, "Name is required").max(40, "Name must be less than 40 characters"),
        description: z.string().min(1, "Description is required").max(200, "Description must be less than 200 characters"),
        image: z.string().min(1, "Image is required"),
})

}