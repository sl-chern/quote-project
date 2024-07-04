'use client';

import PageLoading from '@/components/PageLoading/PageLoading';
import Sidebar from '@/components/Sidebar/Sidebar';
import { verifyUserQuery } from '@/graphql/queries/verifyUser';
import { useLoadingStore } from '@/store/loadingStore';
import { useUserStore } from '@/store/userStore';
import { User } from '@/types/models/User';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect } from 'react';
import { useQuery } from 'urql';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const loading = useLoadingStore(state => state.loading);
  const [result] = useQuery({ query: verifyUserQuery });

  const addUser = useUserStore(state => state.setUser);
  const setLoading = useLoadingStore(state => state.setLoading);

  useEffect(() => {
    if (result.data?.verifyUser && result.data.verifyUser.permissions) {
      const user: User = {
        ...result.data.verifyUser,
        permissions: result.data.verifyUser.permissions.map(
          permission => permission.name as string,
        ),
      };
      addUser(user);
      setLoading(false);
    }
  }, [result]);

  return (
    <section className='flex flex-row w-full h-full gap-5 justify-center'>
      {loading && <PageLoading />}
      <div className='w-1/5 flex flex-col gap-2 py-5'>
        <Link href={'/'}>
          <h2 className='flex flex-row items-center '>
            <span>
              <Image
                className='text-black dark:text-white dark:invert w-16 h-16'
                src='/q.svg'
                alt='Q Logo'
                width={0}
                height={0}
                priority
              />
            </span>
            <span className='text-xl font-medium -ml-3 italic'>uotes</span>
          </h2>
        </Link>
        <Sidebar />
      </div>
      <div className='grow border-x-[1px] border-x-neutral-400 h-full py-5'>{children}</div>
      <div className='w-1/5'></div>
    </section>
  );
}
