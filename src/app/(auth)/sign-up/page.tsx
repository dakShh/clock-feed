'use client';

import { useEffect, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useDebounceCallback } from 'usehooks-ts';
import axios, { AxiosError } from 'axios';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button, buttonVariants } from '@/components/ui/button';

import { useToast } from '@/hooks/use-toast';

import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

// Schema imports
import { signupSchema } from '@/schemas/signUpSchema';
import { ApiResponse } from '@/types/ApiResponse';
import { useRouter } from 'next/navigation';
import { Loader } from '@/components/ui/loader';

export default function ProfileForm() {
  const { toast } = useToast();
  const [username, setUsername] = useState('');
  const [usernameMessage, setUsernameMessage] = useState('');
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const debouncedUsername = useDebounceCallback(setUsername, 500);
  const router = useRouter();

  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: '',
      email: '',
      password: ''
    }
  });

  async function onSubmit(values: z.infer<typeof signupSchema>) {
    setIsSubmitting(true);

    try {
      const response = await axios.post<ApiResponse>('/api/sign-up', values);
      toast({
        title: 'Success',
        description: response.data.message
      });
      router.replace(`/verify/${values.username}`);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage = axiosError?.response?.data.message;
      toast({
        title: 'Signup failed',
        description: errorMessage,
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (username) {
        setIsCheckingUsername(true);
        setUsernameMessage('');
        try {
          const response = await axios.get<ApiResponse>(
            `/api/check-username-unique?username=${username}`
          );
          setUsernameMessage(response.data.message);
        } catch (error) {
          console.log('err: ', error);
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(axiosError.response?.data.message ?? 'Error checking username');
        } finally {
          setIsCheckingUsername(false);
        }
      }
    };

    checkUsernameUnique();

    if (!username) setUsernameMessage('');
    return () => {
      setIsCheckingUsername(false);
    };
  }, [username]);
  return (
    <div>
      <div className="lg:container relative h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <Link
          href="/sign-in"
          className={cn(
            buttonVariants({ variant: 'ghost' }),
            'absolute right-4 top-4 md:right-8 md:top-8'
          )}
        >
          Login
        </Link>

        {/* 1st grid */}
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
          <div
            className={cn(
              'absolute inset-0 ',
              'bg-primary'
              // 'bg-zinc-700'
            )}
          />
          <div className="relative z-20 flex items-center text-lg font-medium">readme.ca</div>
          <div className="relative z-20 mt-auto">
            <blockquote className="space-y-2">
              <p className="text-lg">
                &ldquo;This library has saved me countless hours of work and helped me deliver stunning
                designs to my clients faster than ever before.&rdquo;
              </p>
              <footer className="text-sm">Sofia Davis</footer>
            </blockquote>
          </div>
        </div>

        {/* 2nd grid */}
        <div className="mx-auto flex w-full flex-col space-y-6 justify-center sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
            <div className="text-sm text-muted-foreground">
              Enter your email below to create your account
            </div>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 px-8 sm:px-0">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    {/* <FormLabel>Username</FormLabel> */}
                    <FormControl>
                      <Input
                        // {...field}
                        placeholder="Eg: daksh"
                        {...form.register('username')}
                        name="username"
                        className={cn(
                          form?.formState?.errors?.username ||
                            (usernameMessage &&
                              'Username is available. :)' !== usernameMessage &&
                              'border-destructive')
                        )}
                        onChange={(e) => {
                          setIsCheckingUsername(true);
                          debouncedUsername(e.target.value);
                          field.onChange(e);
                        }}
                        autoComplete="off"
                      />
                    </FormControl>
                    {isCheckingUsername && <Loader />}
                    {(username && usernameMessage && !isCheckingUsername && (
                      <p
                        className={cn(
                          `text-[0.8rem]`,
                          `${'Username is available. :)' === usernameMessage ? 'text-green-400' : 'text-destructive'}`
                        )}
                      >
                        {usernameMessage}
                      </p>
                    )) || <FormMessage />}
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    {/* <FormLabel>Username</FormLabel> */}
                    <FormControl>
                      <Input
                        placeholder="input@example.com"
                        {...field}
                        className={cn(form?.formState?.errors?.email && 'border-destructive')}
                        // value={username}
                        // onChange={field.onChange}
                      />
                    </FormControl>
                    {/* <FormDescription>This is your public display name.</FormDescription> */}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    {/* <FormLabel>Username</FormLabel> */}
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="password"
                        className={cn(form?.formState?.errors?.password && 'border-destructive', '')}
                        type="password"
                        // value={username}
                        // onChange={field.onChange}
                      />
                    </FormControl>
                    {/* <FormDescription>This is your public display name.</FormDescription> */}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                {isSubmitting ? <Loader /> : 'Submit'}
              </Button>
            </form>
          </Form>
          <p className="px-8 text-center text-sm text-muted-foreground">
            By clicking continue, you agree to our{' '}
            <Link href="/terms" className="underline underline-offset-4 hover:text-primary">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="underline underline-offset-4 hover:text-primary">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
