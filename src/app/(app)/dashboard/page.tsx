'use client';

import { useCallback, useEffect, useState } from 'react';
import NavBar from '@/components/NavBar';
import { Switch } from '@/components/ui/switch';
import { User } from 'next-auth';
import { useSession } from 'next-auth/react';
import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/types/ApiResponse';
import { Message } from '@/models/User';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { acceptMessageSchema } from '@/schemas/acceptMessageSchemas';
import { cn } from '@/lib/utils';
import { Copy, Loader } from 'lucide-react';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { getDomain } from '@/helpers/common';

export default function Dashboard() {
  const { data } = useSession();
  const domain = getDomain();
  const user: User = data?.user as User;

  const personalUrl = `${domain}/u/${user?.username}`;

  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState<boolean>(false);

  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(acceptMessageSchema)
  });

  const { register, watch, setValue } = form;

  const acceptMessages = watch('acceptMessages');

  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitchLoading(true);

    try {
      const response = await axios.get<ApiResponse>(`/api/accept-messages`);
      setValue('acceptMessages', response.data.isAcceptingMessage);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage = axiosError?.response?.data.message;
      toast({
        title: 'Error getting accept messages! :(',
        description: errorMessage,
        variant: 'destructive'
      });
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue]);

  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setIsLoading(true);
      setIsSwitchLoading(false);
      try {
        const response = await axios.get<ApiResponse>('/api/get-messages');
        console.log('response messages: ', response);
        setMessages(response.data.messages || []);
        if (refresh) {
          toast({
            title: 'Refresh Messages',
            description: 'Showing latest messages'
          });
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        const errorMessage = axiosError?.response?.data.message;
        toast({
          title: 'Error getting messages! :(',
          description: errorMessage,
          variant: 'destructive'
        });
      } finally {
        setIsSwitchLoading(false);
        setIsLoading(false);
      }
    },
    [setIsLoading, setMessages]
  );

  const handleSwitchChange = async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.post<ApiResponse>(`/api/accept-messages`, {
        acceptMessages: !acceptMessages
      });
      setValue('acceptMessages', !acceptMessages);

      if (!response.status) {
      }
      toast({
        title: 'Status updated successfully! :)',
        description: response.data.message || 'Message acceptance status updated successfully'
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage = axiosError?.response?.data.message;
      toast({
        title: 'Error toggling accept messages! :(',
        description: errorMessage,
        variant: 'destructive'
      });
    } finally {
      setIsSwitchLoading(false);
    }
  };

  useEffect(() => {
    if (!data || !data?.user) return;

    fetchAcceptMessage();
    fetchMessages();
  }, [data, setValue, fetchAcceptMessage, fetchMessages]);
  if (!data || !data.user) {
    return (
      <div className="items-center h-screen w-screen grid place-content-center font-bold text-3xl">
        <Loader size={30} className="animate-spin text-primary" />
        {/* <div>Loading...</div> */}
      </div>
    );
  }
  return (
    <div className="">
      <NavBar />
      <div className="bg-secondary-foreground/90 container mx-auto grid text-background ">
        <div className="relative px-6 lg:px-8  ">
          <div className="mx-auto max-w-3xl pt-24 pb-8">
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
              <h1 className="text-balance font-light tracking-tight sm:text-2xl">{` Hey ${user?.username}! `}</h1>
              <div className="text-background tracking-tight">
                <p className="text-6xl font-bold ">Welcome back to your HonestHub space. 🚀</p>
                <p className="mt-3">Let’s see what your community is saying today!</p>
              </div>

              <div className="mt-20 flex flex-col items-center gap-y-2">
                <div className={cn('pt-2', 'flex items-center gap-x-2')}>
                  <div className="text-background">Accepting messages: </div>
                  {isSwitchLoading ? (
                    <Loader size={20} className="animate-spin text-secondary-foreground p-x-2" />
                  ) : (
                    <Switch
                      {...register('acceptMessage')}
                      checked={acceptMessages}
                      onCheckedChange={handleSwitchChange}
                      disabled={isSwitchLoading}
                    />
                  )}
                </div>
                <div className="flex items-center">
                  <div
                    className={cn(
                      'font-light rounded-s-xl',
                      'px-4 py-2',
                      'underline underline-offset-2',
                      'bg-secondary-foreground/40',
                      'cursor-pointer',
                      'shadow-lg '
                    )}
                  >
                    {(data?.user && personalUrl) || 'NA'}
                  </div>
                  <button
                    className={cn(
                      'rounded-e-xl',
                      'grid place-content-center self-stretch px-5',
                      'underline',
                      'bg-primary',
                      'shadow-lg'
                    )}
                  >
                    <Copy size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto py-5">
        <div className="grid grid-cols-4 gap-4 px-6">
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

      {/* <div>dashboard</div> */}
      {/* <button onClick={() => signOut()}>Sign out</button> */}
    </div>
  );
}
