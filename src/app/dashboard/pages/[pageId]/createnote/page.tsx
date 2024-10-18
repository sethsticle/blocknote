"use client"
import React, { useState } from "react"
import { toast } from "sonner"
import slugify from 'react-slugify'
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Atom } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { parse } from "path"
import { parseWithZod } from "@conform-to/zod"
import { NoteSchema } from "@/utils/zodSchema"
import { useForm } from "@conform-to/react"
import { useFormState } from "react-dom"
import { CreateNoteAction } from "@/action"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import { UploadDropzone } from "@/utils/UploadThing"
import { SubmitButton } from "@/components/dashboard/SubmitButton"

export default function noteCreationRoute({ params }: { params: { pageId: string } }) {

    const [imageUrl, setImageUrl] = useState<undefined | string>(undefined)
    // const [value, setValue] = useState<JSONContent | undefined>(undefined)
    const [title, setTitle] = useState<string | undefined>(undefined)
    const [slug, setSlugValue] = useState<string | undefined>(undefined)

    const [lastResult, action] = useFormState(CreateNoteAction, undefined)
    const [form, fields] = useForm({
        lastResult,
        onValidate({ formData }) {
            return parseWithZod(formData, {
                schema: NoteSchema,
            })
        },
        shouldValidate: "onBlur",
        shouldRevalidate: "onInput",
    })

    function handleSlugGeneration() {
        //const titleInput = title.replaceAll(" ", "-").toLowerCase()
        const titleInput = title

        if (titleInput?.length === 0 || titleInput === undefined) {
            return toast.error("Please enter a title for your article first")
        }

        setSlugValue(slugify(titleInput))

        return toast.success("Slug has been generated")
    }


    return (
        <>
            {/* return button */}
            <div className='flex items-center gap-2'>
                <Button asChild><Link href={`/dashboard/pages/${params.pageId}`}><ArrowLeft className='size-4' /></Link></Button>
                <h1 className='text-xl font-semibold'>View Notes</h1>
            </div>

            {/* form */}
            <Card>
                <CardHeader>
                    <CardTitle>
                        Note details
                    </CardTitle>
                    <CardDescription>Make a note and save it to your page</CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={action} id={form.id} className='flex flex-col gap-6' onSubmit={form.onSubmit}>

                        <input type="hidden" name="pageId" value={params.pageId} />
                        <div className="grid gap-2">
                            <Label>Title</Label>
                            <Input key={fields.title.key} value={title} placeholder="Title required" onChange={(e)=>setTitle(e.target.value)} name={fields.title.name} defaultValue={fields.title.initialValue} />
                            <p className="text-sm text-red-500">{fields.title.errors}</p>
                        </div>

                        <div className="grid gap-2">
                            <Label>Slug</Label>
                            <Input key={fields.slug.key} value={slug} name={fields.slug.name}
                                placeholder="Slug required" defaultValue={fields.slug.initialValue}
                                onChange={(e) => setSlugValue(e.target.value)} />

                            <Button className='w-fit' variant={'secondary'} type='button' onClick={handleSlugGeneration}>
                                <Atom className='size-4 mr-2' />
                                Generate Slug
                            </Button>
                            <p className='text-red-500'>{fields.slug.errors}</p>

                        </div>

                        {/* cover image input */}
                        <div className='grid gap-2'>
                            <Label>Cover Image</Label>
                            <input type="hidden"
                                name={fields.image.name}
                                key={fields.image.key}
                                defaultValue={fields.image.initialValue}
                                value={imageUrl}
                            />
                            {imageUrl ?
                                (
                                    <Image src={imageUrl} alt='UploadedImage' className='object-cover w-[200px] h-[200px] rounded-lg' width={200} height={200} />
                                ) : (
                                    <UploadDropzone
                                        endpoint="imageUploader"
                                        onClientUploadComplete={(res) => {
                                            setImageUrl(res[0].url);
                                            toast.success("Hooray! Image has been uploaded");
                                        }}
                                        onUploadError={() => {
                                            toast.error("We are terribly sorry, but the image has failed to upload");
                                        }}
                                    />
                                )}

                            <p className='text-red-500 text-sm'>{fields.image.errors}</p>
                        </div>


                        <SubmitButton text='Submit' />
                    </form>
                </CardContent>
            </Card>

        </>
    )

}