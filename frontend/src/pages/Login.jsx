import { createJWT, verifyJWT } from '../api/jwt';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';

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

// hooks
import { useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  // const [created, setCreated] = useState(false)
  // const [error, setError] = useState(false)
  let errorDetail = '';
  const tokens = JSON.parse(localStorage.getItem('tokens'));
  const navigate = useNavigate();

  const { data, error } = useQuery({
    queryKey: ['verified'],
    queryFn: () => verifyJWT(tokens?.accessToken),
    enabled: true,
    retry: 0,
  });

  useEffect(() => {
    document.title = 'Login - EduTea';
    if (data) {
      navigate('/');
    }
  }, [data, navigate, error]);

  const onSubmit = async (data) => {
    try {
      const response = await createJWT(data);
      if (response.status === 200) {
        // setError(false);
        // setCreated(true);
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'You have successfully logged in!',
        });
        errorDetail = '';
        localStorage.setItem(
          'tokens',
          JSON.stringify({
            accessToken: response.data.access,
            refreshToken: response.data.refresh,
          })
        );
        navigate('/');
      }
    } catch (error) {
      // setError(true);
      // setCreated(false);
      if (error.response && error.response.data) {
        console.log('Error data:', error.response.data);
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
        console.log('Datos del error:', Object.values(error.response.data));
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

  return (
    <>
      <Navbar />
      <div className="mt-[6rem] justify-center flex mb-[2rem] flex-1">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Card className="bg-beige">
            <CardHeader>
              <CardTitle className="text-2xl">Login</CardTitle>
              <CardDescription>
                Enter your email and password to access your account.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="johndoe@example.com"
                  {...register('email', { required: 'Email is required.' })}
                />
                {errors.email && (
                  <p className="text-red-500">{errors.email.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  {...register('password', {
                    required: 'Password is required.',
                  })}
                />
                {errors.password && (
                  <p className="text-red-500">{errors.password.message}</p>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-dark-moss-green hover:bg-eerie-black">
                Sign in
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
      <Footer className="absoluto bottom-0" />
    </>
  );
}

export default Login;
