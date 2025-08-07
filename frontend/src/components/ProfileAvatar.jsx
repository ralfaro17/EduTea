import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { getUser } from '../api/users';
import { useQuery } from '@tanstack/react-query'
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faRightFromBracket, faGear, faHammer } from '@fortawesome/free-solid-svg-icons'


function ProfileAvatar() {
  const tokens = JSON.parse(localStorage.getItem("tokens"))

  const shouldFetch = tokens?.accessToken ? true : false

  const { data } = useQuery({queryKey: ["user"], queryFn: () => getUser(tokens.accessToken), enabled: shouldFetch, retry: 0})

  return (
    <>
    
      <DropdownMenu >
        <DropdownMenuTrigger asChild>
          <Avatar className="h-9 w-9">
            <AvatarImage src="/placeholder-user.jpg" />
            <AvatarFallback>{`${data?.data.first_name[0].toUpperCase()}${data?.data.last_name[0].toUpperCase()}`}</AvatarFallback>
            <span className="sr-only">Toggle user menu</span>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-tea-green text-eerie-black border-dark-moss-green">
          <DropdownMenuItem className="focus:bg-dark-moss-green focus:text-white">
            <Link to="/profile" className="flex items-center">
              <div className="h-4 w-4" />
              <FontAwesomeIcon icon={faUser} className='mr-2'/>
              <span>Profile</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="focus:bg-dark-moss-green focus:text-white">
            <Link to="/settings" className="flex items-center">
              <div className="h-4 w-4" />
              <FontAwesomeIcon icon={faGear} className='mr-2'/>
              <span>Settings</span>
            </Link>
          </DropdownMenuItem>
          {data?.data?.user_type == 3 && 
          <DropdownMenuItem className="focus:bg-dark-moss-green focus:text-white">
            
            <a href="http://localhost:8000/admin" className="flex items-center" >
              <div className="h-4 w-4" />
              <FontAwesomeIcon icon={faHammer} className='mr-2'/>
              <span>admin panel</span>
            </a>
          </DropdownMenuItem>
          }
          <DropdownMenuSeparator className="bg-dark-moss-green"/>
          <DropdownMenuItem className="focus:bg-dark-moss-green focus:text-white">
          <Link to="/logout" className="flex items-center" >
            <div className="h-4 w-4" />
            <FontAwesomeIcon icon={faRightFromBracket} className='mr-2'/>
            <span>Log out</span>
          </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>

  )
}

export default ProfileAvatar