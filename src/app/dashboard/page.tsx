import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'

function Dashboard() {
    return (
        <>
            <div className='flex flex-col h-screen justify-center items-center align-middle font-bold text-5xl'>
                <p>Dashboard</p>
                <Link href={'/dashboard/pages/newpage'}>
                    <Button className=''>New page</Button>
                </Link>
            </div>

        </>
    )
}

export default Dashboard