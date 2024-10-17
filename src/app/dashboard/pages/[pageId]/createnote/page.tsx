"use client"
import React, { useState } from "react"

export default function noteCreationRoute ({params}: {params: {pageId: string}}) {

    const [imageUrl, setImageUrl] = useState<undefined | string>(undefined)
   // const [value, setValue] = useState<JSONContent | undefined>(undefined)
    const [title, setTitle] = useState<string | undefined>(undefined)
    const [slug, setSlugValue] = useState<string | undefined>(undefined)

    return (
        <>

        </>
    )

}