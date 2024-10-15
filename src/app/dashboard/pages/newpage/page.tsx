import React from 'react'

export default function NewPageRoute() {
  return (
    <div className='flex flex-col flex-1 items-center justify-center'>
       <Card className='max-w-[450px]'>
        <CardHeader className=' flex gap-2 text-center'>
            <CardTitle>
                Create a Page
            </CardTitle>
            <CardDescription>
                Create your page here and click 'Create' to confirm!
            </CardDescription>
        </CardHeader>
        <CardContent>
            <div className='flex flex-col gap-y-6'>
                <div className='grid gap-3'>
                    <Label>Page Name</Label>
                    <Input placeholder='Page name'/>
                </div>
                <div className='grid gap-3'>
                    <Label>Subdirectory</Label>
                    <Input placeholder='Subdirectory'/>
                </div>
                <div className='grid gap-3'>
                    <Label>Description</Label>
                    <Textarea placeholder='Add a small description here...'/>
                </div>
            </div>
        </CardContent>
        <CardFooter className='justify-center'>
            <Button>Submit</Button>
        </CardFooter>
       </Card>
    </div>
  )
}
