import { createUser } from '../api/users';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';
import { useEffect } from 'react';

// shadcn
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

// hooks
import { useForm } from 'react-hook-form';

function Register() {
  useEffect(() => {
    document.title = 'Register - EduTea';
  }, []);

  let errorDetail = '';
  const [userType, setUserType] = useState(1);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    data.biography = '';
    data.user_type = userType;
    try {
      const response = await createUser(data);
      if (response.status === 201) {
        errorDetail = '';
        localStorage.setItem(
          'tokens',
          JSON.stringify({
            accessToken: response.data.access,
            refreshToken: response.data.refresh,
          })
        );
        Swal.fire({
          icon: 'success',
          title: 'Account successfully created',
          text: 'Check your email to activate your account.',
        }).then(() => navigate('/'));
      }
    } catch (error) {
      if (error.response && error.response.data) {
        // console.log('Error data:', error.response.data);
        const errorData = error.response.data;
        if (errorData.error) {
          errorDetail = errorData.error;
        } else {
          const fieldErrors = [];
          for (const field in errorData) {
            if (Array.isArray(errorData[field])) {
              fieldErrors.push(...errorData[field]);
            } else if (typeof errorData[field] === 'string') {
              fieldErrors.push(errorData[field]);
            }
          }

          if (fieldErrors.length > 0) {
            errorDetail = fieldErrors.join(' ');
          } else {
            errorDetail = 'Unknown error';
          }
        }
      } else if (error.message) {
        errorDetail = 'Connection error';
      } else {
        // console.log('Datos del error:', Object.values(error.response.data));
        errorDetail =
          'Error in the communication with the server. Please, try again later.';
      }
      Swal.fire({
        icon: 'error',
        title: 'Something went wrong!',
        text: errorDetail,
      });
    }
  };

  const password = watch('password', '');

  return (
    <>
      <Navbar />
      <div className="my-[2rem] justify-center flex">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Card className="bg-beige">
            <CardHeader>
              <CardTitle className="text-2xl">Register</CardTitle>
              <CardDescription>
                Enter the following data to create your account.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first-name">First Name</Label>
                  <Input
                    id="first-name"
                    placeholder="John"
                    {...register('first_name', {
                      required: 'Your first name is required',
                    })}
                  />
                  {errors.first_name && (
                    <p className="text-red-500">{errors.first_name.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last-name">Last Name</Label>
                  <Input
                    id="last-name"
                    placeholder="Doe"
                    {...register('last_name', {
                      required: 'Your last name is required',
                    })}
                  />
                  {errors.last_name && (
                    <p className="text-red-500">{errors.last_name.message}</p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  placeholder="johndoe"
                  {...register('username', {
                    required: 'Your username is required',
                  })}
                />
                {errors.username && (
                  <p className="text-red-500">{errors.username.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  {...register('email', { required: 'Your email is required' })}
                />
                {errors.email && (
                  <p className="text-red-500">{errors.email.message}</p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    {...register('password', {
                      required: 'Your password is required',
                    })}
                  />
                  {errors.password && (
                    <p className="text-red-500">{errors.password.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    {...register('re_password', {
                      required: 'You must confirm the password',
                      validate: (value) => {
                        value === password || 'Passwords do not match';
                      },
                    })}
                  />
                  {errors.re_password && (
                    <p className="text-red-500">{errors.re_password.message}</p>
                  )}
                </div>
              </div>
              <RadioGroup
                aria-label="User Type"
                className="flex items-center justify-evenly"
                defaultValue="1"
              >
                <Label>User Type:</Label>
                <div className="flex items-center gap-2">
                  <RadioGroupItem
                    id="student"
                    value="1"
                    {...register('user_type', {
                      required: 'user type is required',
                    })}
                    onClick={() => setUserType(1)}
                  />
                  <Label htmlFor="student">Student</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem
                    id="teacher"
                    value="2"
                    {...register('user_type', {
                      required: 'user type is required',
                    })}
                    onClick={() => setUserType(2)}
                  />
                  <Label htmlFor="teacher">Teacher</Label>
                </div>

                {errors.user_type && (
                  <p className="text-red-500">{errors.user_type.message}</p>
                )}
              </RadioGroup>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full bg-dark-moss-green hover:bg-eerie-black"
                type="submit"
              >
                Register
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
      <Footer />
    </>
  );
}

export default Register;
