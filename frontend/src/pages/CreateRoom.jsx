import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { postRoom } from '../api/rooms';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';
import { getUser } from '../api/users';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useNavigate } from 'react-router-dom';

function CreateRoom() {
  const tokens = JSON.parse(localStorage.getItem('tokens'));
  let errorDetail = '';

  const [avatarSrc, setAvatarSrc] = useState('/placeholder-user.jpg');
  const handleAvatarChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setAvatarSrc(URL.createObjectURL(event.target.files[0]));
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();

  const shouldFetch = tokens?.accessToken ? true : false;

  const userData = useQuery({
    queryKey: ['user'],
    queryFn: () => getUser(tokens.accessToken),
    enabled: shouldFetch,
    retry: 0,
  });

  const mutation = useMutation({
    mutationFn: (data) => postRoom(tokens.accessToken, data),
    onSuccess: () => {
      Swal.close()
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Room created.',
      }).then(() => {
        navigate('/chat-menu');
      });
    },
    onError: (error) => {
      Swal.close()
      errorDetail = error;
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: errorDetail,
      });
    },
    retry: 2
  });

  const onSubmit = async (data) => {
    if(userData.data?.data?.user_type == 2){
      data.teacher_email = userData?.data?.data?.email || '';
    }

    mutation.mutate(data);

    
  };


  useEffect(() => {
    document.title = 'Create Room - EduTea';
  }, [])

  return (
    <>
      <Navbar />
      <section className="flex w-[100vw] justify-center mt-12 gap-12 md:gap-36">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex gap-4 flex-col w-[50vw]"
        >
          <div className="space-y-2">
            <Label htmlFor="room_name">Room name</Label>
            <Input
              id="room_name"
              placeholder="johndoe"
              {...register('room_name', {
                required: 'the room name is required',
              })}
            />
            {errors.room_name && (
              <p className="text-red-500">{errors.room_name.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              placeholder="this room is for..."
              {...register('description', {
                required: 'the description is required',
              })}
            />
            {errors.description && (
              <p className="text-red-500">{errors.description.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="theme">Room Topic</Label>
            <Input
              id="theme"
              placeholder="programming"
              {...register('theme')}
            />
            {errors.theme && (
              <p className="text-red-500">{errors.theme.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="schedule">Schedule</Label>
            <Input
              id="schedule"
              placeholder="7am - 8:45am"
              {...register('schedule')}
            />
            {errors.schedule && (
              <p className="text-red-500">{errors.schedule.message}</p>
            )}
          </div>
          {userData.data?.data?.user_type == 3 && 
            <div className="space-y-2">
              <Label htmlFor="teacher_email">Teacher email</Label>
              <Input
                id="teacher_email"
                placeholder="teacher@gmail.com"
                {...register('teacher_email')}
              />
              {errors.teacher && (
                <p className="text-red-500">{errors.teacher.message}</p>
              )}
            </div>
          }
          <Button className="mb-4 bg-dark-moss-green hover:bg-eerie-black">
            Submit
          </Button>
        </form>
        {/* <div className="flex items-center justify-center">
                <label htmlFor="avatar-input" className="cursor-pointer relative inline-block">
                    <Avatar className="h-24 w-24 border-2 border-primary rounded-full">
                    <AvatarImage src="/placeholder-user.jpg" />
                    <AvatarFallback>
                        <UserIcon className="h-12 w-12 text-primary" />
                    </AvatarFallback>
                    </Avatar>
                    <input id="avatar-input" type="file" accept="image/*" className="sr-only" onChange={handleAvatarChange} />
                </label>
            </div> */}
        <div className="flex items-center justify-center">
          <label
            htmlFor="avatar-input"
            className="cursor-pointer relative inline-block"
          >
            <Avatar className="h-24 w-24 border-2 border-primary rounded-full">
              <AvatarImage src="/placeholder-user.jpg" />
              <AvatarFallback>
                <UserIcon className="h-12 w-12 text-primary" />
              </AvatarFallback>
            </Avatar>
            <input
              id="avatar-input"
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={handleAvatarChange}
            />
          </label>
        </div>
      </section>
      <Footer />
    </>
  );
}

function UserIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

export default CreateRoom;
