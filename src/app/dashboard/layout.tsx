"use client";
import DashboardItems from '@/components/dashboard/DashboardItems';
import { CircleUser, DollarSign, Globe, Home } from 'lucide-react';
import Image from 'next/image';
import React, { ReactNode, use } from 'react';
import Link from 'next/link'; // Importing from next/link
import NavbarMenu from '@/components/dashboard/NavbarMenu';
import { ThemeToggle } from '@/components/dashboard/ThemeToggle';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { LogoutLink } from '@kinde-oss/kinde-auth-nextjs/components';
import LogoImage from '@/public/2.png'
import { usePathname } from 'next/navigation';

export const navLinks = [
    {
        name: "Dashboard",
        href: "/dashboard",
        icon: Home,
    },
    {
        name: "Pages",
        href: "/dashboard/pages",
        icon: Globe,
    },
    {
        name: "NothingHereYet",
        href: "/dashboard",
        icon: DollarSign,
    },
];

function DashboardLayout({ children }: { children: ReactNode }) {

    const pathname = usePathname();
    return (
        <section className='grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]'>
            <div className='hidden border-r bg-muted/40 md:block '>  {/*on small screens we dont show */}
                <div className='flex h-full max-h-screen flex-col gap-2'>

                    <div className='flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6 gap-2 overflow-hidden text-nowrap'>
                        <Image src={LogoImage} alt='logo' width={32} height={32} className='rounded-md'/>
                        <Link href='/'>
                            <h3 className='text-3xl'>Planet <span className='text-primary'>Seth</span></h3>
                        </Link>
                    </div>

                    <div className='flex-1'>
                        <nav className='grid items-start px-2 font-medium lg:px-4'>
                            <DashboardItems />
                        </nav>
                    </div>

                </div>
            </div>



            <div className='flex flex-col'>
                <header className='flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6'>
                    <div className='md:hidden '>
                        <NavbarMenu />
                    </div>

                    <div className='ml-auto flex items-center gap-5'>
                        <h1 className='text-teal-500 '>{pathname}</h1>
                        <ThemeToggle />
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="secondary" className='rounded-full' size="icon">
                                    <CircleUser />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align='end'>
                                <DropdownMenuItem>
                                    <LogoutLink>Logout</LogoutLink>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </header>
                <main className='flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6'>
                    {children}
                </main>
            </div>
        </section>
    );
}

export default DashboardLayout;
