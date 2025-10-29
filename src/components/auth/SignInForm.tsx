'use client';

import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import Link from 'next/link';
import GoogleSignInButton from '../GoogleSignInButton';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Role } from '@prisma/client';

const FormSchema = z.object({
  login: z.string().min(1, 'Email or username is required'),
  password: z.string().min(1, 'Password is required'),
});

const SignInForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      login: '',
      password: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    setLoading(true);
    setError('');

    try {
      // sign in user
      const result = await signIn('credentials', {
        login: values.login,
        password: values.password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid email/username or password');
        setLoading(false);
        return;
      }

      // fetch user role from API or session after login
      const userResponse = await fetch('/api/auth/me'); // endpoint returns user data
      const user = await userResponse.json();

      if (user?.role) {
        // Capitalize first letter of role for UI if needed
        const role = user.role;

        // Redirect by role
        switch (role.toUpperCase()) {
          case Role.ADMIN:
            router.push('/admin');
            break;
          case Role.STAFF:
            router.push('/staff');
            break;
          case Role.AGENT:
            router.push('/agent');
            break;
          default:
            router.push(callbackUrl || '/dashboard');
            break;
        }
      } else {
        router.push(callbackUrl || '/dashboard');
      }

      router.refresh();
    } catch (error) {
      console.error(error);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='w-full'>
        <div className='space-y-4'>
          <FormField
            control={form.control}
            name='login'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email or Username</FormLabel>
                <FormControl>
                  <Input 
                    placeholder='mail@example.com or johndoe' 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder='Enter your password'
                      {...field}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="text-right mt-2">
          <Link 
            href="/forgot-password" 
            className="text-sm text-blue-600 hover:text-blue-500 transition-colors"
          >
            Forgot your password?
          </Link>
        </div>
        
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600 text-sm text-center">{error}</p>
          </div>
        )}
        
        <Button 
          className='w-full mt-6' 
          type='submit'
          disabled={loading}
        >
          {loading ? 'Signing in...' : 'Sign in'}
        </Button>
      </form>
      
      <div className='mx-auto my-4 flex w-full items-center justify-evenly before:mr-4 before:block before:h-px before:flex-grow before:bg-stone-400 after:ml-4 after:block after:h-px after:flex-grow after:bg-stone-400'>
        or
      </div>
      
      <GoogleSignInButton>Sign in with Google</GoogleSignInButton>
      
      <p className='text-center text-sm text-gray-600 mt-2'>
        If you don&apos;t have an account, please&nbsp;
        <Link className='text-blue-500 hover:underline' href='/sign-up'>
          Sign up
        </Link>
      </p>
    </Form>
  );
};

export default SignInForm;
