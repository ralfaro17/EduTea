import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { useQuery, useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';
import Message from '../components/Message';
import { verifyJWT } from '../api/jwt';
import { getRoom } from '../api/rooms';
import { getUser } from '../api/users';
import { getMessages } from '../api/messages';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';

function ChatRoom() {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const tokens = JSON.parse(localStorage.getItem('tokens'));
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const chatRoom = useQuery({
    queryKey: ['roomDetail', searchParams.get('room')],
    queryFn: () => getRoom(tokens.accessToken, searchParams.get('room')),
    enabled: true,
    retry: 0,
  });
  
  const roomMessages = useQuery({
    queryKey: ['messagesRoom'],
    queryFn: () =>
      getMessages(tokens?.accessToken, { room: searchParams.get('room') }),
    enabled: true,
    retry: 0,
  });

  // console.log(roomMessages?.data?.data?.results);
  const socketUrl = `http://localhost:8000/ws/room/${searchParams.get(
    'room'
  )}/`;
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  // console.log(roomMessages?.data?.data?.results)
  const verified = useQuery({
    queryKey: ['verified', tokens?.accessToken],
    queryFn: () => verifyJWT(tokens.accessToken),
    enabled: true,
    retry: 0,
  });

  const sendMessage = (info) => {
    // let currentdate = new Date();
    // let datetime =
    //   currentdate.getDate() +
    //   '/' +
    //   (currentdate.getMonth() + 1) +
    //   '/' +
    //   currentdate.getFullYear() +
    //   '  ' +
    //   currentdate.getHours() +
    //   ':' +
    //   currentdate.getMinutes() +
    //   ':' +
    //   currentdate.getSeconds();
    // console.log(datetime);
    info['token'] = tokens.accessToken
    const message = info;
    // console.log(message)
    socket.send(JSON.stringify(message));
  };

  const shouldFetch = tokens?.accessToken ? true : false;

  const userData = useQuery({
    queryKey: ['user'],
    queryFn: () => getUser(tokens.accessToken),
    enabled: shouldFetch,
    retry: 0,
  });

  const onSubmit = (data) => {
    // console.log(userData);
    data.data_type = 'message';
    data.first_name = userData?.data?.data?.first_name;
    data.last_name = userData?.data?.data?.last_name;
    data.username = userData?.data?.data?.username;
    data.id = userData?.data?.data?.id;
    sendMessage(data);
    reset();
  };

  useEffect(() => {
    if (roomMessages.isSuccess){
      setMessages(roomMessages?.data?.data);
    }
    window.scrollTo(0, document.body.scrollHeight);   
  }, [roomMessages?.data?.data, roomMessages.isSuccess]);

  useEffect(() => {
    document.title = 'Chat Room ';
    if (!socket) {

      const websocket = new WebSocket(socketUrl);

      websocket.onopen = () => {
        console.log('Connected to the websocket server');
      };

      websocket.onclose = () => {
        console.log('Se ha cerrado la conexión con el socket.');
      };

      websocket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log(data);
        
        setMessages((prev) => [...prev, data]);
        window.scrollTo(0, document.body.scrollHeight);   
      };

      setSocket(websocket);
    }
    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [socketUrl, socket]);

  useEffect(() => {
    if (verified.error) {
      Swal.fire({
        icon: 'error',
        title: 'login error',
        text: 'You must login to access this page',
      });
      navigate('/login');
    }
  }, [verified, navigate]);

  /* useEffect(() => {
    let data = chatRoom?.data?.data;
    console.log(data);
    setMessages((prev) => [...prev, data]);
  }, [messages, chatRoom]); */

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {messages?.map((msg, index) => (
          <Message
            key={index}
            first_name="John"
            message={msg?.content}
            last_name="Doe"
            sentByCurrentUser={msg?.author === userData?.data?.data?.id}
          />
        ))}
      </div>

      <form
        className="bg-dark-moss-green border-t border-border p-4 flex items-center gap-2"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">View room details</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{chatRoom?.data?.data?.room_name}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <p className="text-muted-foreground">Description</p>
                <p>{chatRoom?.data?.data?.description}</p>
              </div>
              <div className="grid grid-cols-[auto_1fr] items-center gap-4">
                <p className="text-muted-foreground">Code</p>
                <div className="rounded-md bg-muted px-3 py-1 text-sm font-medium">
                  {chatRoom?.data?.data?.room_code}
                </div>
              </div>
              <div className="grid grid-cols-[auto_1fr] items-center gap-4">
                <p className="text-muted-foreground">topic</p>
                <div className="rounded-md bg-muted px-3 py-1 text-sm font-medium">
                  {chatRoom?.data?.data?.theme}
                </div>
              </div>
              <div className="grid grid-cols-[auto_1fr] items-center gap-4">
                <p className="text-muted-foreground">Schedule</p>
                <div className="rounded-md bg-muted px-3 py-1 text-sm font-medium">
                  {chatRoom?.data?.data?.schedule}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        <Input
          placeholder="Type your message..."
          className="flex-1 rounded-full pr-12"
          {...register('message', { required: 'You must enter a message' })}
        />
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-5"
          type="submit"
        >
          <SendIcon className="w-5 h-5" />
          <span className="sr-only">Send</span>
        </Button>
      </form>
    </div>
  );
}

function SendIcon(props) {
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
      <path d="m22 2-7 20-4-9-9-4Z" />
      <path d="M22 2 11 13" />
    </svg>
  );
}

export default ChatRoom;
