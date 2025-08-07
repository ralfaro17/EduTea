import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { verifyJWT, refreshJWT } from '../api/jwt';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faRightToBracket,
  faHouse,
  faUserPlus,
  faCircleInfo,
  faBars,
  faUserCheck,
  faCommentDots,
} from '@fortawesome/free-solid-svg-icons';
import ProfileAvatar from './ProfileAvatar';
import { useEffect } from 'react';

function Navbar() {
  const tokens = JSON.parse(localStorage.getItem('tokens'));

  const { data, error, status, refetch } = useQuery({
    queryKey: ['verified', tokens?.accessToken],
    queryFn: () => verifyJWT(tokens.accessToken),
    enabled: true,
    retry: 0,
  });


  let shouldRefresh = status === 'error' && error?.response?.status === 401;

  const refresh = useQuery({
    queryKey: ['refresh', tokens?.refreshToken],
    queryFn: () => refreshJWT(tokens.refreshToken),
    enabled: shouldRefresh,
    retry: 0,
  });

  useEffect(() => {
    if (refresh.data) {
      tokens.accessToken = refresh.data?.data?.access;
      tokens.refreshToken = refresh.data?.data?.refresh;
      localStorage.setItem('tokens', JSON.stringify(tokens));
      refetch();
    }
  }, [refresh, tokens, refetch]);

  return (
    <header className="sticky top-0 z-50 w-full bg-dark-moss-green border-b">
      <div className="container flex items-center justify-between h-16 px-4 md:px-6">
        <Link to="/" className="flex items-center gap-2">
          <img src="/logo2.png" alt="logo" className="w-12 h-12" />
          <span className="font-bold text-maize hover:text-tea-green transition-all duration-500 text-3xl">
            EduTea
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <Link
            to="/"
            className="text-white hover:text-tea-green transition-all duration-500"
          >
            <FontAwesomeIcon icon={faHouse} className="mr-2" />
            Home
          </Link>
          {data && (
            <>
              <Link
                to="/chat-menu"
                className="text-white hover:text-tea-green transition-all duration-500"
              >
                <FontAwesomeIcon icon={faCommentDots} className="mr-2" />
                Chat
              </Link>
            </>
          )}
          {error && (
            <>
              <Link
                to="/login"
                className="text-white hover:text-tea-green transition-all duration-500"
              >
                <FontAwesomeIcon icon={faRightToBracket} className="mr-2" />
                Log in
              </Link>
              <Link
                to="/register"
                className="text-white hover:text-tea-green transition-all duration-500"
              >
                <FontAwesomeIcon icon={faUserPlus} className="mr-2" />
                Register
              </Link>
              <Link
                to="/activate-account"
                className="text-white hover:text-tea-green transition-all duration-500"
              >
                <FontAwesomeIcon icon={faUserCheck} className="mr-2" />
                Account activation
              </Link>
            </>
          )}
          <Link
            to="/about"
            className="text-white hover:text-tea-green transition-all duration-500"
          >
            <FontAwesomeIcon icon={faCircleInfo} className="mr-2" />
            About
          </Link>
          {data && <ProfileAvatar />}
        </nav>
        <div className="flex items-center gap-4 md:hidden">
          {data && <ProfileAvatar />}

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden ">
                <FontAwesomeIcon icon={faBars} className="w-6 h-6" />
                <span className="sr-only">Toggle navigation</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="md:hidden w-[12rem] bg-dark-moss-green border-l-0"
            >
              <SheetHeader>
                <SheetTitle>
                  <Link to="/" className="flex items-center gap-2">
                    <img src="/logo2.png" alt="logo" className="w-8 h-8" />
                    <span className="font-bold text-maize hover:text-tea-green transition-all duration-500 text-2xl">
                      EduTea
                    </span>
                  </Link>
                </SheetTitle>
              </SheetHeader>
              <nav className="grid gap-4 p-4">
                <Link
                  to="/"
                  className="text-white hover:text-tea-green transition-all duration-500"
                >
                  <FontAwesomeIcon icon={faHouse} className="mr-2" />
                  Home
                </Link>
                {data && (
                  <>
                    <Link
                      to="/chat-menu"
                      className="text-white hover:text-tea-green transition-all duration-500"
                    >
                      <FontAwesomeIcon icon={faCommentDots} className="mr-2" />
                      Chat
                    </Link>
                  </>
                )}
                {error && (
                  <>
                    <Link
                      to="/login"
                      className="text-white hover:text-tea-green transition-all duration-500"
                    >
                      <FontAwesomeIcon
                        icon={faRightToBracket}
                        className="mr-2"
                      />
                      Log in
                    </Link>
                    <Link
                      to="/register"
                      className="text-white hover:text-tea-green transition-all duration-500"
                    >
                      <FontAwesomeIcon icon={faUserPlus} className="mr-2" />
                      Register
                    </Link>
                    <Link
                      to="/activate-account"
                      className="text-white hover:text-tea-green transition-all duration-500"
                    >
                      <FontAwesomeIcon icon={faUserCheck} className="mr-2" />
                      account activation
                    </Link>
                  </>
                )}
                <Link
                  to="/about"
                  className="text-white hover:text-tea-green transition-all duration-500"
                >
                  <FontAwesomeIcon icon={faCircleInfo} className="mr-2" />
                  About
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
