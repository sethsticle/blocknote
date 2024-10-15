import { z } from "zod";

// Define the schema for title and editor content
export const editorSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title must be less than 100 characters"),
  content: z.string().min(1, "Content is required") // Editor content as JSON string
});