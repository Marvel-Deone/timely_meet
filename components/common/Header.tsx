import Image from 'next/image'
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'
import UserMenu from './UserMenu'
import { checkUser } from '@/lib/checkUser'
import HeaderUI from './HeaderUI';

const Header = async () => {

  await checkUser();

  return <HeaderUI />
}

export default Header;
