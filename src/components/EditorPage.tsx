"use client"
import TextareaAutoSize from "react-textarea-autosize";
import React from 'react'
import dynamic from "next/dynamic";
import { useMemo } from "react";

function EditorPage() {

    const Editor = useMemo(
        () => dynamic(() => import('@/components/Editor'), {ssr: false}),
        []
    )

    return (
        <div className="flex flex-col px-24 py-10 w-full">
            <TextareaAutoSize placeholder="Untitled" className="w-full resize-none appearance-none overflow-hidden bg-transparent text-5xl font-bold focus:outline-none" />

            {/* this is where we will write to the db */}
            <Editor onChange={() => { }} />
        </div>
    )
}

export default EditorPage