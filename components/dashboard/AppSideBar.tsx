'use client';

import { nav_items } from '@/lib/consts/navigation'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

const AppSideBar = () => {
    const pathname = usePathname();

    return (
        <aside className='hidden md:block w-64 bg-white'>
            <nav className='mt-8'>
                <ul>
                    {nav_items.map((item) => (
                        <li key={item.href}>
                            <Link href={item.href} className={`flex items-center p-4 text-gray-700 hover:bg-gray-100 ${pathname === item.href ? "bg-blue-100" : ""}`}>
                                <item.icon className='w-5 h-5 mr-3' />
                                {item.label}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    )
}

export default AppSideBar
