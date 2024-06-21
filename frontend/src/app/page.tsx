'use client';

import { useQuery } from 'urql';
import { verifyUserQuery } from '@/graphql/queries/verifyUser';
import { useEffect } from 'react';
import { useUserStore } from '@/lib/store';
import { User } from '@/types/models/User';

export default function Home() {
  const [result] = useQuery({ query: verifyUserQuery });

  const addUser = useUserStore(state => state.setUser);

  useEffect(() => {
    if (result.data?.verifyUser && result.data.verifyUser.permissions) {
      const user: User = {
        ...result.data.verifyUser,
        permissions: result.data.verifyUser.permissions.map(
          permission => permission.name as string,
        ),
      };
      addUser(user);
    }
  }, []);

  return <main className='flex min-h-screen flex-col items-center justify-between p-24'></main>;
}
