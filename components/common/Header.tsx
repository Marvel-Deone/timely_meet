import { checkUser } from '@/lib/checkUser';
import HeaderUI from './HeaderUI';

const Header = async () => {

  await checkUser();

  return <HeaderUI />
}

export default Header;
