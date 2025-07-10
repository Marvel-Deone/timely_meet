'use client';

import { nav_items } from '@/lib/consts/navigation';
import { usePathname } from 'next/navigation'

const AppHeader = () => {
 const pathname = usePathname();

  return (
    <header className='flex justify-between items-center mb-4'>
        <h2 className='text-2xl md:text-3xl font-extrabold pb-6 bg-gradient-to-br from-blue-600 to-blue-400 bg-clip-text tracking-tighter text-transparent pr-2 pt-2 md:pt-0 text-center md:text-left w-full'>
            {nav_items.find((item) => item.href == pathname)?.label || "Dashboard"}
        </h2>
    </header>
  )
}

export default AppHeader
