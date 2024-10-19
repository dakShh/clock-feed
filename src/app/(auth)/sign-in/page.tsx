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
import { signInSchema } from '@/schemas/signInSchema';
import { ApiResponse } from '@/types/ApiResponse';
import { useRouter } from 'next/navigation';
import { Loader } from '@/components/ui/loader';
import { signIn } from 'next-auth/react';

export default function SignInUser() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: '',
      password: ''
    }
  });

  async function onSubmit(values: z.infer<typeof signInSchema>) {
    try {
      setIsSubmitting(true);
      const response = await signIn('credentials', {
        redirect: false,
        identifier: values.identifier,
        password: values.password
      });
      console.log(response);
      if (response?.error) {
        toast({
          title: 'Login failed! :(',
          description: response?.error,
          variant: 'destructive'
        });
      }

      if (response?.url) {
        router.replace('/dashboard');
      }
      console.log('values123: ', values);
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

  return (
    <div>
      <div className="lg:container relative h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <Link
          href="/sign-up"
          className={cn(
            buttonVariants({ variant: 'ghost' }),
            'absolute left-4 top-4 md:left-8 md:top-8'
          )}
        >
          Sign up
        </Link>

        {/* 1st grid */}

        <div className="mx-auto flex w-full flex-col space-y-6 justify-center sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Login</h1>
            <div className="text-sm text-muted-foreground">
              Enter your email / username below to login
            </div>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 px-8 sm:px-0">
              <FormField
                control={form.control}
                name="identifier"
                render={({ field }) => (
                  <FormItem>
                    {/* <FormLabel>Username</FormLabel> */}
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Eg: daksh"
                        name="identifier"
                        className={cn(form?.formState?.errors?.password && 'border-destructive', '')}
                        autoComplete="off"
                      />
                    </FormControl>
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
                        name="password"
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
                {isSubmitting ? <Loader /> : 'Login'}
              </Button>
            </form>
          </Form>
          {/* <p className="px-8 text-center text-sm text-muted-foreground">
            By clicking continue, you agree to our{' '}
            <Link href="/terms" className="underline underline-offset-4 hover:text-primary">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="underline underline-offset-4 hover:text-primary">
              Privacy Policy
            </Link>
            .
          </p> */}
        </div>

        {/* 2nd grid */}

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
      </div>
    </div>
  );
}
