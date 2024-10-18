'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { verifySchema } from '@/schemas/verifySchema';
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const VerifyAccount = () => {
  const router = useRouter();
  const { username } = useParams<{ username: string }>();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema)
  });

  async function onSubmit(data: z.infer<typeof verifySchema>) {
    try {
      const response = await axios.post('/api/verify-code', { ...data, username });
      if (response.status) {
        router.replace(`/sign-in`);

        toast({
          title: 'Success',
          description: response.data.message
        });
      }
    } catch (error) {
      console.error('error: ', error);
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage =
        axiosError.response?.data.message ?? 'Error verifying your account, please try again :(';
      toast({
        title: 'Could not verify',
        description: errorMessage,
        variant: 'destructive'
      });
    }
  }

  return (
    <div className="container mx-auto bg-primary w-full grid place-items-center h-screen space-y-6 ">
      <Card className="w-[400px] px-10 py-5 bg-primary-foreground">
        <div className="flex flex-col space-y-1 mb-8 ">
          <h1 className="text-2xl font-semibold tracking-tight">{'Verify your account :)'}</h1>
          <div className="text-sm text-muted-foreground">Enter your 6 digit code to get verified..</div>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 px-8 sm:px-0">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  {/* <FormLabel>Username</FormLabel> */}
                  <FormControl>
                    <Input
                      placeholder="Eg: 888888"
                      {...form.register('code')}
                      name="code"
                      autoComplete="off"
                      type="number"
                      // {...field}
                      // className={cn(
                      //   form?.formState?.errors?.username ||
                      //     (usernameMessage &&
                      //       'Username is available. :)' !== usernameMessage &&
                      //       'border-destructive')
                      // )}
                      // onChange={(e) => {
                      //   setIsCheckingUsername(true);
                      //   debouncedUsername(e.target.value);
                      //   field.onChange(e);
                      // }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full bg-zinc-700 ">
              {/* {isSubmitting ? <Loader /> : 'Submit'} */}
              Submit
            </Button>
          </form>
        </Form>
      </Card>
    </div>
    // <div className="bg-primary h-screen">
    //   <div className="container mx-auto grid h-full place-items-center w-full">
    //     <Card className="w-[400px]">
    //       <div>
    //         <h1>Verify the code</h1>
    //       </div>
    //     </Card>
    //   </div>
    // </div>
  );
};

export default VerifyAccount;
