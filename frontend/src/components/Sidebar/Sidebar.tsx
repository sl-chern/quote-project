'use client';

import { useUserStore } from '@/store/userStore';
import Image from 'next/image';
import { Button } from '../ui/button';
import { Bell, LogOut, UserRound } from 'lucide-react';
import Link from 'next/link';
import { useMutation } from 'urql';
import { logoutMutation } from '@/graphql/mutations/logout';
import { useRouter } from 'next/navigation';
import { useLoadingStore } from '@/store/loadingStore';

export default function Sidebar() {
  const { user, removeUser } = useUserStore(state => state);
  const [, executeLogout] = useMutation(logoutMutation);
  const router = useRouter();
  const setLoading = useLoadingStore(state => state.setLoading);

  const logout = async () => {
    setLoading(true);
    removeUser();
    await executeLogout({});
    router.push('/signin');
  };

  return (
    <div className='flex flex-col gap-5'>
      <div className='w-full flex flex-row gap-2 items-center mb-2'>
        <Image
          src={'/placeholder.webp'}
          alt='avatar'
          height={100}
          width={100}
          className='w-10 h-10'
        />
        <p className='font-medium text-lg'>{user?.name || ''}</p>
      </div>
      <Link href={'/'}>
        <Button
          variant='ghost'
          size='sm'
          className='w-full justify-start items-center gap-1 hover:bg-transparent text-2xl px-0'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='24'
            height='24'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
            className='lucide lucide-house'
          >
            <path d='M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8' />
            <path d='M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z' />
          </svg>
          Main
        </Button>
      </Link>
      <Link href={'/notifications'}>
        <Button
          variant='ghost'
          size='sm'
          className='w-full justify-start items-center gap-1 hover:bg-transparent text-2xl px-0'
        >
          <Bell />
          Notifications
        </Button>
      </Link>
      <Link href={`/profile/${user?.name}`}>
        <Button
          variant='ghost'
          size='sm'
          className='w-full justify-start items-center gap-1 hover:bg-transparent text-2xl px-0'
        >
          <UserRound />
          Profile
        </Button>
      </Link>
      <Button
        variant='ghost'
        size='sm'
        className='w-full justify-start items-center gap-1 hover:bg-transparent text-2xl px-0'
        onClick={logout}
      >
        <LogOut />
        Logout
      </Button>
      <Button size='lg' className='w-full justify-center items-center font-medium text-xl mt-2'>
        Create quote
      </Button>
    </div>
  );
}
