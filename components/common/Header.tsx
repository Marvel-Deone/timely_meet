import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { Button } from '../ui/button'
import { PenBox, User } from 'lucide-react'
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'
import UserMenu from './UserMenu'
import { checkUser } from '@/lib/checkUser'

const Header = async () => {
  await checkUser();

  return (
    <nav className='w-full py-4 px-4 flex mx-auto justify-between items-center shadow-md border-b-2'>
      <Link href={"/"} className='flex items-center'>
        <Image src={"/images/timely_meet_logo_dark.png"} alt="logo" width={300} height={60} className='hidden md:flex !h-[60px] w-auto' />
        <Image src={"/images/mobile_logo.png"} alt="logo" width={140} height={20} className='flex md:hidden !h-[40px] w-auto' />
      </Link>
      <div className='flex items-center gap-4'>
        <Link href={"/events?create=true"}>
          <Button className='!bg-blue-600 flex gap-2 cursor-pointer'>
            <PenBox size={18} /> Create Event
          </Button>
        </Link>
        <SignedOut>
          <SignInButton forceRedirectUrl="/dashboard">
            <Button variant="outline" className=' cursor-pointer'>Login</Button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <UserMenu />
        </SignedIn>
      </div>
    </nav>
  )
}

export default Header;
