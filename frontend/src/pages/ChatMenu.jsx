import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { getUser } from '../api/users';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';
import axios from 'axios';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { postStudentsRoom } from '../api/studentsRooms';
import { getRooms } from '../api/rooms';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';

function ChaTMenu() {
  const queryClient = useQueryClient();
  const tokens = JSON.parse(localStorage.getItem('tokens'));
  const [rooms, setRooms] = useState([]);
  const userData = useQuery({queryKey: ['user'], queryFn: () => getUser(tokens.accessToken), enabled: true, retry: 0})
  const [search, setSearch] = useState('');
  

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const filteredRooms = rooms?.filter((room) =>
    room.room_name.toLowerCase().includes(search.toLowerCase())
  );

  const navigate = useNavigate();

  const shouldFetch = tokens?.accessToken ? true : false;

  const { data } = useQuery({
    queryKey: ['user'],
    queryFn: () => getUser(tokens.accessToken),
    enabled: shouldFetch,
    retry: 0,
  });

  const roomsQuery = useQuery({
    queryKey: ['rooms'],
    queryFn: () => getRooms(tokens.accessToken),
    enabled: shouldFetch,
    retry: 0,
  });

  const mutation = useMutation({
    mutationFn: (code) => postStudentsRoom(tokens?.accessToken , code),
    onSuccess: () => {
      queryClient.invalidateQueries('rooms');
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Joined room.',
      });
      navigate('/chat-menu');
    },
    onError: (error) => {
      console.log(error)
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: error?.response?.data?.detail || 'Invalid code.',
      });
    }
  });

  const onSubmit = async (data) => {
    // data.student = userData?.data?.data?.id
    console.log(data)
    mutation.mutate(data);
  };

  useEffect(() => {
    document.title = 'Menu - EduTea';
    if (roomsQuery.data?.data?.results) {
      setRooms(roomsQuery.data.data.results);
    }
  }, [rooms, roomsQuery]);

  return (
    <>
      <Navbar />
      <div className="flex p-4 justify-between items-center border-b-[1px] border-b-eerie-black">
        <div className="flex items-center w-full max-w-md">
          <Input
            type="search"
            placeholder="Search..."
            className="flex-1 pr-4 bg-beige font-semibold text-[1.25rem]"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <h1 className="ml-6 cursor-pointer font-semibold text-[1.25rem]">
            Search
          </h1>
        </div>
        {data?.data?.user_type == 1 && (
          <Dialog>
            <DialogTrigger asChild>
              <h1 className="mx-4 cursor-pointer font-semibold text-[1.25rem]">
                Join room
              </h1>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[400px]">
              <div className="space-y-4 p-6">
                <div className="space-y-2">
                  <DialogTitle className="text-2xl font-bold">
                    Enter Chat Room Code
                  </DialogTitle>
                  <DialogDescription>
                    Enter the code provided to you to join the chat room.
                  </DialogDescription>
                </div>
                <form className="space-y-2" onSubmit={handleSubmit(onSubmit)}>
                  <Label htmlFor="code">Chat Room Code</Label>
                  <Input
                    id="code"
                    placeholder="Enter code"
                    {...register('room_code', {
                      required: 'You must enter a code',
                    })}
                  />
                  {errors.room_code && (
                    <p className="text-red-500">{errors.room_code.message}</p>
                  )}
                  <Button type="submit" className="w-full bg-dark-moss-green ">
                    Join
                  </Button>
                </form>
              </div>
            </DialogContent>
          </Dialog>
        )}
        {(data?.data?.user_type == 2 || data?.data?.user_type == 3) && (
          <Link to="/create-room" className="flex items-center">
            <h1 className="font-semibold text-[1.25rem]">Create room</h1>
          </Link>
        )}
      </div>
      <div className="flex flex-col overflow-y-auto h-[calc(100vh-16.2rem)]">
        {filteredRooms && filteredRooms.length > 0 ? (
          filteredRooms.map((room) => (
            <Link className="flex justify-center my-3" to={`/chat-room?room=${room.id}`} key={room.id}>
            <Card className="w-[100vw] max-w-6xl border-2 border-dark-moss-green bg-beige">
              <div className="grid grid-cols-[1fr_auto] items-center gap-6 p-6">
                <div>
                  <CardTitle className="text-2xl font-bold">
                    {room.room_name}
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {room.description}
                  </CardDescription>
                </div>
              </div>
            </Card>
          </Link>
          ))
        ) : (
          <div></div>
        )}
      </div>
      <Footer />
    </>
  );
}

export default ChaTMenu;
