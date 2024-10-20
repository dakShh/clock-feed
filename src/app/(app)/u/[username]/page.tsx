'use client';

import NavBar from '@/components/NavBar';
import { cn } from '@/lib/utils';
import { ApiResponse } from '@/types/ApiResponse';
import axios, { AxiosError } from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { Loader } from 'lucide-react';
import { Message } from '@/models/User';
import { User } from 'next-auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function HonestHubBoard({ params }: { params: { username: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const [userDetails, setUserDetails] = useState<User>();
  const [isAcceptingMessages, setIsAcceptingMessages] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);

  const fetchMessages = async (userId: string) => {
    // setIsLoading(true);
    console.log('fetch messages: ', userId);
    try {
      const response = await axios.get<ApiResponse>(`/api/get-user-messages?userId=${userId}`);
      setMessages(response.data.messages || []);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage = axiosError?.response?.data.message;
      toast({
        title: 'Error getting messages! :(',
        description: errorMessage,
        variant: 'destructive'
      });
    }
  };

  const fetchUserDetails = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get<ApiResponse>(
        `/api/get-user-detail?username=${params.username}`
      );
      console.log('fetchUserDetails: ', response);
      if (response.status) {
        setIsAcceptingMessages(response.data.userDetails?.isAcceptingMessage || false);
        setUserDetails(response.data.userDetails);
      }
      setIsLoading(false);
      return response.data.userDetails;
    } catch (error) {
      router.replace('/');
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description: axiosError.response?.data.message ?? 'Error getting user info'
      });
    }
  };
  useEffect(() => {
    fetchUserDetails().then((x) => {
      fetchMessages(x?._id || '');
    });
  }, []);

  if (isLoading) {
    return (
      <div className="items-center h-screen w-screen grid place-content-center font-bold text-3xl">
        <Loader size={30} className="animate-spin text-primary" />
        {/* <div>Loading...</div> */}
      </div>
    );
  }

  return (
    <div className="bg-secondary-foreground/10 min-h-screen">
      <NavBar />
      <div className="container mx-auto grid text-background ">
        <div className="mx-auto max-w-4xl pt-24 pb-8">
          <div className="hidden sm:mb-8 sm:flex sm:justify-center">
            {/* <div className="relative rounded-full px-3 py-1 text-sm leading-6  ring-1 ring-gray-900/10 hover:ring-gray-900/20">
                  Announcing our next round of funding.{' '}
                  <a href="#" className="font-semibold text-indigo-600">
                    <span className="absolute inset-0" aria-hidden="true"></span>Read more{' '}
                    <span aria-hidden="true">&rarr;</span>
                  </a>
                </div> */}
          </div>
          <div className="">
            <div className="text-secondary-foreground/55 text-center tracking-tight">
              <p className="text-5xl font-bold ">{`Welcome to ${params.username}’s HonestHub. `}</p>
              <p className="mt-3">This is where honest feedback meets authenticity</p>
            </div>

            <div className="mt-20 flex flex-col items-center gap-y-2">
              <div
                className={cn(
                  'pt-2',
                  'flex flex-col items-center w-full gap-x-2 gap-y-4',
                  'relative'
                )}
              >
                <div className="w-full flex items-center">
                  <Input
                    disabled={!isAcceptingMessages}
                    placeholder={`"Eg: ${params.username} is awesome! :)"`}
                    className="w-full max-w-7xl ring-0 rounded-s-xl rounded-e-none focus-visible:ring-0 border border-background/40  focus:border-primary/50 shadow-md text-secondary-foreground/55 placeholder:text-secondary-foreground/30"
                    maxLength={150}
                  />
                  <Button
                    disabled={!isAcceptingMessages}
                    className="rounded-e-xl rounded-s-none border-primary shadow-md"
                  >
                    {`Review ${params?.username || ''}`}
                  </Button>
                </div>
                {isAcceptingMessages ? (
                  <p className="text-teal-600 text-sm italic font-light absolute right-3 top-[-16px] ">
                    {`${params.username} is accepting messages.`}
                  </p>
                ) : (
                  <p className="text-red-600 text-sm italic font-light absolute right-3 top-[-16px] ">
                    {`${params.username.toUpperCase()} is not accepting messaging. Try some other time. `}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="container mx-auto pt-8 px-6">
          <div className="">
            <h2 className="text-primary/80 font-bold text-4xl ">HonestHUB Wall</h2>
            <Separator decorative className="mt-2 mb-4 font-thin" />
          </div>
          <div></div>
          <div className="grid grid-cols-4 gap-4 ">
            {messages?.map(({ content, createAt }, index) => {
              const date = new Date(createAt);
              return (
                <Card
                  key={index}
                  className={cn('py-5', 'bg-primary/70 text-background', 'shadow border-none')}
                >
                  <CardContent className="flex items-between w-full">
                    <div className="font-bold w-full pr-3">{content}</div>
                    <div className="text-xs font-thin">
                      {date.toLocaleString('en-US').split(',')[0]}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
