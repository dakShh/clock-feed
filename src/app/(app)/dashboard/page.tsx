'use client';

import { useCallback, useEffect, useState } from 'react';
import NavBar from '@/components/NavBar';
import { Input } from '@/components/ui/input';
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
export default function Dashboard() {
  const { data } = useSession();
  const user: User = data?.user as User;
  const personalUrl = `${process.env.NEXT_PUBLIC_APP_URL}/u/${user?.username}`;

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
        console.log('response: ', response);
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
    // fetchMessages();
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
    <div className="bg-primary/65">
      <NavBar username={user.username || user.email || ''} />
      <div className="container mx-auto grid text-background ">
        <div className="">
          <div className="relative px-6 lg:px-8">
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
                <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-6xl">
                  {` Hey, ${user?.username ? user?.username.toUpperCase() : 'UNKNOWN'}! Welcome back to your HonestHub space. 🚀`}
                </h1>
                <p className="text-lg leading-8 ">Let’s see what your community is saying today!</p>
                <div className={cn(' font-bold pt-2', 'flex items-center gap-x-2')}>
                  <div className="text-background font-semibold text-lg">Accepting messages: </div>
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
                <div className="mt-16 flex items-center justify-center ">
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

      {/* <div>dashboard</div> */}
      {/* <button onClick={() => signOut()}>Sign out</button> */}
    </div>
  );
}
