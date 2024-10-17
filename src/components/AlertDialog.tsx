"use client"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react";
import { useRouter } from 'next/navigation';

async function handleDelete(noteId: string) {
    try {
        // Call your server action or API to delete the note
        //await deleteNote(noteId); // Example server action
        console.log("Note deleted from handleDelete with noteId of: ", noteId);
    } catch (error) {
        console.error("Failed to delete note:", error);
    }
}

interface AlertDialogProps {
    noteId: string; // The ID of the note to delete
    //onDelete: (noteId: string) => void; // Function to handle deletion
}

export function AlertDialogDelete({ noteId }: AlertDialogProps) {
    const router = useRouter(); // For redirection

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="destructive"><Trash2 className="w-4 h-4" /></Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your note.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                            className="bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90"
                            onClick={() => {
                                console.log("Delete triggered from alert dialog");
                                handleDelete(noteId); // Call the deletion function
                                router.replace('/dashboard/pages'); // Redirect after deletion
                            }}>
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
