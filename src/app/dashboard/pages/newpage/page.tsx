
"use client"
import { CreatePageAction } from '@/action'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import React from 'react'
import { useFormState } from 'react-dom'
import { useForm } from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'
import { PageSchema } from '@/utils/zodSchema'
import { SubmitButton } from '@/components/dashboard/SubmitButton'

function NewPageRoute() {
    //get the 'status' of the serveraction and action->createSiteAction
    const [lastResult, action] = useFormState(CreatePageAction, undefined)
    //^^ this will keep track fo the form data
    //we now want to set up conform on the client side
    const [form, fields] = useForm({
        //pass the status of the serverAction
        lastResult,
        //here we are validating the data on the client side
        onValidate({ formData }) {
            return parseWithZod(formData, {
                schema: PageSchema
            })
        },
        //so we want to now tell conform when to validate
        shouldValidate: "onBlur", // this will validate when we lose input..another words clicking outside the text entering area
        shouldRevalidate: "onInput" // this will revalidate on input
    })


    return (
        <div className='flex flex-col flex-1 items-center justify-center'>
            <Card className='max-w-[450px]'>
                <CardHeader className=' flex gap-2 text-center'>
                    <CardTitle>
                        Create a Site
                    </CardTitle>
                    <CardDescription>
                        Create your site here and click &apos;Create&apos; to confirm!
                    </CardDescription>
                </CardHeader>

                {/* //form id comes react and uses the useForm hook, first arg - form
        //passing onsubmit prop and action to the usehook as well */}
                <form id={form.id} onSubmit={form.onSubmit} action={action}>

                    <CardContent>
                        <div className='flex flex-col gap-y-6'>
                            <div className='grid gap-3'>
                                <Label>Page Name</Label>
                                <Input
                                    name={fields.name.name}
                                    key={fields.name.name}
                                    defaultValue={fields.name.initialValue} placeholder='Page name' />
                                <p className='text-red-500 text-sm'>{fields.name.errors}</p>
                            </div>
                            <div className='grid gap-3'>
                                <Label>Subdirectory</Label>
                                <Input name={fields.subdirectory.name}
                                    key={fields.subdirectory.key}
                                    defaultValue={fields.subdirectory.initialValue}
                                    placeholder='Subdirectory' />
                                <p className='text-red-500 text-sm'>{fields.subdirectory.errors}</p>
                            </div>
                            <div className='grid gap-3'>
                                <Label>Description</Label>
                                <Textarea
                                    name={fields.description.name}
                                    key={fields.description.name}
                                    defaultValue={fields.description.initialValue}
                                    placeholder='Add a small description here...' />
                                <p className='text-red-500 text-sm'>{fields.description.errors}</p>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className='justify-center'>
                        <SubmitButton text='Submit' />
                    </CardFooter>

                </form>

            </Card>
        </div>
    )
}

export default NewPageRoute

// "use client"
// import { CreatePageAction } from '@/action'
// import { SubmitButton } from '@/components/dashboard/SubmitButton'
// import { Button } from '@/components/ui/button'
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
// import { Input } from '@/components/ui/input'
// import { Label } from '@/components/ui/label'
// import { Textarea } from '@/components/ui/textarea'
// import { PageSchema } from '@/utils/zodSchema'
// import { parseWithZod } from '@conform-to/zod'

// import { useForm } from '@conform-to/react'

// import React from 'react'
// import { useFormState } from 'react-dom'




// export default function NewPageRoute() {



//     const [lastResult, action] = useFormState(CreatePageAction, undefined)
//     //get the 'status' of the serveraction and action->createSiteAction
//     //^^ this will keep track fo the form data
//     //we now want to set up conform on the client side
//     const[form, fields] = useForm({
//         //pass the status of the server action
//         lastResult,
//         //validate the data on the client side
//         onValidate({formData}){
//             return parseWithZod(formData, {
//                 schema: PageSchema,
//             })
//         },
//          //so we want to now tell conform when to validate
//          shouldValidate: "onBlur", // this will validate when we lose input..another words clicking outside the text entering area
//          shouldRevalidate: "onInput" // this will revalidate on input
//     })


//     return (<div className='flex flex-col flex-1 items-center justify-center'>
//         <Card className='max-w-[450px]'>
//             <CardHeader className=' flex gap-2 text-center'>
//                 <CardTitle>
//                     Create a Site
//                 </CardTitle>
//                 <CardDescription>
//                     Create your site here and click &apos;Create&apos; to confirm!
//                 </CardDescription>
//             </CardHeader>

//             {/* //form id comes react and uses the useForm hook, first arg - form
//          //passing onsubmit prop and action to the usehook as well */}
//             <form id={form.id} onSubmit={form.onSubmit} action={action}>

//                 <CardContent>
//                     <div className='flex flex-col gap-y-6'>
//                         <div className='grid gap-3'>
//                             <Label>Site Name</Label>
//                             <Input
//                                 name={fields.name.name}
//                                 key={fields.name.name}
//                                 defaultValue={fields.name.initialValue} placeholder='Site name' />
//                             <p className='text-red-500 text-sm'>{fields.name.errors}</p>
//                         </div>
//                         <div className='grid gap-3'>
//                             <Label>Subdirectory</Label>
//                             <Input name={fields.subdirectory.name}
//                                 key={fields.subdirectory.key}
//                                 defaultValue={fields.subdirectory.initialValue}
//                                 placeholder='Subdirectory' />
//                             <p className='text-red-500 text-sm'>{fields.subdirectory.errors}</p>
//                         </div>
//                         <div className='grid gap-3'>
//                             <Label>Description</Label>
//                             <Textarea
//                                 name={fields.description.name}
//                                 key={fields.description.name}
//                                 defaultValue={fields.description.initialValue}
//                                 placeholder='Add a small description here...' />
//                             <p className='text-red-500 text-sm'>{fields.description.errors}</p>
//                         </div>
//                     </div>
//                 </CardContent>
//                 <CardFooter className='justify-center'>
//                     <SubmitButton text='Submit' />
//                 </CardFooter>

//             </form>

//         </Card>
//     </div>
//     )
// }
