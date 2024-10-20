'use client';

import NavBar from '@/components/NavBar';
import { cn } from '@/lib/utils';
import { ApiResponse } from '@/types/ApiResponse';
import axios, { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { Loader } from 'lucide-react';
export default function HonestHubBoard({ params }: { params: { username: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  console.log('username: ', params);
  const [isAcceptingMessages, setIsAcceptingMessages] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get<ApiResponse>(
          `/api/get-user-detail?username=${params.username}`
        );
        console.log('fetchUserDetails: ', response);
        if (response.status) {
          setIsAcceptingMessages(response.data.userDetails?.isAcceptingMessage || false);
        }
        setIsLoading(false);
      } catch (error) {
        router.replace('/');
        const axiosError = error as AxiosError<ApiResponse>;
        toast({
          title: 'Error',
          description: axiosError.response?.data.message ?? 'Error getting user info'
        });
      }
    };

    fetchUserDetails();
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
    <div className="bg-secondary-foreground/90">
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
            {/* <h1 className="text-balance font-light tracking-tight sm:text-2xl">{` Hey ${params?.username}! `}</h1> */}
            <div className="text-background text-center tracking-tight">
              <p className="text-5xl font-bold ">{`Welcome to ${params.username}’s HonestHub. `}</p>
              <p className="mt-3">This is where honest feedback meets authenticity</p>
            </div>

            <div className="mt-20 flex flex-col items-center gap-y-2">
              <div className={cn('pt-2', 'flex flex-col items-center gap-x-2 gap-y-4')}>
                <div className="text-background">
                  {isAcceptingMessages
                    ? `${params.username} is accepting messages. Leave Your Review.`
                    : `${params.username} is not accepting messaging. Try some other time. `}
                </div>
                <div>
                  <Input />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
