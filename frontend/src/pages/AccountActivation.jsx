import { useSearchParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { activateUser, resendActivationEmail } from '../api/users';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function AccountActivation() {
  const navigate = useNavigate();
  let errorDetail = '';
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  let [searchParams] = useSearchParams();

  const shouldActivate = searchParams.has('uid') && searchParams.has('token');

  const { error, status } = useQuery({
    queryKey: [
      'activateUser',
      searchParams.get('uid'),
      searchParams.get('token'),
    ],
    queryFn: async () => activateUser(searchParams),
    enabled: shouldActivate,
    retry: false,
  });

  const onSubmit = async (data) => {
    try {
      const response = await resendActivationEmail(data);
      if (response.status === 204) {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Check your email to activate your account.',
        });
        errorDetail = '';
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

  useEffect(() => {
    document.title = "Account activation - EduTea"
    if (status === 'success') {
      Swal.fire({
        icon: 'success',
        title: 'Account successfully activated',
        text: 'You can now log in.',
      }).then(() => navigate('/login'));
    } else if (
      status === 'error' &&
      searchParams.has('uid') &&
      searchParams.has('token')
    ) {
      Swal.fire({
        icon: 'error',
        title: 'Account activation failed',
        text:
          error.response.data.detail +
            ' Please try again or write your email in the form to receive a new activation code.' ||
          'An error occurred while activating your account.',
        footer:
          'You might also be experiencing this error if your account is already activated.',
      });
    }
  }, [status, navigate, searchParams, error]);

  return (
    <>
      <Navbar />
      <Card className="w-full max-w-md mx-auto mt-[6rem] bg-beige">
        <CardHeader>
          <CardTitle className="text-2xl">Resend Activation Code</CardTitle>
          <CardDescription>
            Enter your email address to receive new activation codes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                {...register('email', { required: 'The email is required' })}
              />
              {errors.email && (
                <p className="text-red-500">{errors.email.message}</p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full bg-dark-moss-green hover:bg-eerie-black"
            >
              Resend Code
            </Button>
          </form>
        </CardContent>
      </Card>
      <Footer />
    </>
  );
}

export default AccountActivation;
