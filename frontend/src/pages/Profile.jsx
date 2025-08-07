import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { getUser, patchUser } from '../api/users';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';

function Profile() {
  let errorDetail = '';
  const queryClient = useQueryClient();
  const tokens = JSON.parse(localStorage.getItem('tokens'));
  const possibleRoles = ['Student', 'Teacher', 'Admin'];
  const shouldFetch = tokens?.accessToken ? true : false;
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: '',
      first_name: '',
      last_name: '',
      biography: '',
    },
  });

  const mutation = useMutation({
    mutationFn: (data) => patchUser(tokens.accessToken, data),
    onSuccess: () => {
      queryClient.invalidateQueries('user');
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Your profile has been updated!',
      });
    },
    onError: (error) => {
      errorDetail = error?.response?.data;
      Swal.fire({
        icon: 'error',
        title: 'Something went wrong!',
        text: errorDetail,
      });
    },
  });

  const onSubmit = async (data) => {
    mutation.mutate(data);
    if (mutation.isSuccess) {
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Your profile has been updated!',
      });
      errorDetail = '';
    } else if (mutation.isError) {
      console.log(mutation.error);
      errorDetail = mutation?.error?.response?.data;
      Swal.fire({
        icon: 'error',
        title: 'Something went wrong!',
        text: errorDetail,
      });
    }
  };

  const { data } = useQuery({
    queryKey: ['user'],
    queryFn: () => getUser(tokens.accessToken),
    enabled: shouldFetch,
    retry: 0,
  });

  useEffect(() => {
    document.title = 'Profile - EduTea';
    if (data) {
      reset({
        username: data?.data?.username,
        first_name: data?.data?.first_name,
        last_name: data?.data?.last_name,
        biography: data?.data?.biography,
      });
    }
  }, [data, reset]);

  return (
    <>
      <Navbar />
      <div className="flex align-center flex-col my-52 md:my-0 md:flex-row h-[75vh] w-full justify-center">
        <div className="border-2 p-12 gap-12 flex flex-col mx-24 md:my-auto rounded-lg bg-beige border-dark-moss-green md:flex-row md:mx-0">
          <div className="flex items-center justify-center flex-col gap-4 md:gap-8 p-4 my-auto">
            <Avatar className="size-24">
              <AvatarImage src="/placeholder-user.jpg" />
              <AvatarFallback>{`${data?.data?.first_name[0].toUpperCase()}${data?.data?.last_name[0].toUpperCase()}`}</AvatarFallback>
            </Avatar>
            <div className="text-center">
              <h2 className="text-2xl font-bold">{`${data?.data?.first_name}`}</h2>
              <h2 className="text-2xl font-bold">{`${data?.data?.last_name}`}</h2>
              <p className="text-muted-foreground">{data?.data?.email}</p>
            </div>
          </div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex items-center flex-col md:flex-row justify-center gap-2 md:gap-8 my-auto"
          >
            <div className="flex flex-col gap-8">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  {...register('first_name', {
                    required: 'Your first name is required',
                  })}
                />
                {errors.first_name && (
                  <p className="text-red-500">{errors.first_name.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  {...register('last_name', {
                    required: 'Your last name is required',
                  })}
                />
                {errors.last_name && (
                  <p className="text-red-500">{errors.last_name.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  {...register('username', {
                    required: 'Your username is required',
                  })}
                />
                {errors.username_name && (
                  <p className="text-red-500">{errors.username.message}</p>
                )}
              </div>
            </div>
            <div className="gap-2 flex flex-col mt-6 md:mt-0">
              <Label htmlFor="biography">Biography</Label>
              <Textarea
                id="biography"
                name="biography"
                placeholder="Enter your biography..."
                className="min-h-[120px]"
                {...register('biography')}
              />
              <div>
                <Label htmlFor="role">Role</Label>
                <Input
                  id="role"
                  value={possibleRoles[data?.data?.user_type - 1]}
                  disabled={true}
                  className="bg-white"
                  readOnly
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-dark-moss-green hover:bg-eerie-black"
              >
                Save changes
              </Button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Profile;
