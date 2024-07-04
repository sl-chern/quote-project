'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Tabs, TabsContent, TabsTrigger, TabsList } from '@/components/ui/tabs';

export default function Profile() {
  const params = useParams();
  const router = useRouter();

  return (
    <div className='flex flex-col h-auto gap-5'>
      <div className='flex flex-row gap-8 items-center px-5'>
        <Button
          variant='ghost'
          size='sm'
          className='justify-start items-center gap-1 hover:bg-transparent text-2xl px-0'
          onClick={router.back}
        >
          <ArrowLeft />
        </Button>
        <h2 className='text-2xl font-semibold'>{params.name}</h2>
      </div>
      <div className='min-h-0 relative'>
        <div className='pb-[33%]'></div>
        <Image
          className='h-full absolute top-0 left-0 w-full'
          src='/ver.jpg'
          alt='banner'
          width={1000}
          height={1000}
          priority
        />
      </div>
      <div className='flex flex-col gap-2'>
        <div className='flex flex-row justify-between px-3'>
          <div className='min-w-12 w-1/4 -mt-[18%] h-auto relative'>
            <div className='pb-[100%] w-full'></div>
            <Image
              src={'/placeholder.webp'}
              alt='avatar'
              height={100}
              width={100}
              className='w-full h-full absolute top-0 left-0'
            />
          </div>
          <Button variant={'outline'} className='border-primary'>
            Update profile
          </Button>
        </div>
        <div className='flex flex-col gap-2 px-5'>
          <h2 className='text-3xl font-semibold'>{params.name}</h2>
          <div className='flex flex-row gap-10'>
            <p className='text-gray-400'>
              <span className='font-bold text-primary'>42</span> following
            </p>
            <p className='text-gray-400'>
              <span className='font-bold text-primary'>42</span> followers
            </p>
          </div>
          <Tabs defaultValue='quotes' className='w-full'>
            <TabsList>
              <TabsTrigger value='quotes'>Quotes</TabsTrigger>
              <TabsTrigger value='likes'>Likes</TabsTrigger>
            </TabsList>
            <TabsContent value='quotes'>Quotes</TabsContent>
            <TabsContent value='likes'>Likes</TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
