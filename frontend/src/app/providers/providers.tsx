'use client';

import { UrqlProvider, cacheExchange, createClient, fetchExchange, ssrExchange } from '@urql/next';
import { ThemeProvider } from 'next-themes';
import { clientOptions, getAuthExchange } from '@/lib/graphql';
import { useMemo } from 'react';
import { useRouter } from 'next/navigation';

export function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const [client, ssr] = useMemo(() => {
    const authExchange = getAuthExchange(router);
    const ssr = ssrExchange({
      isClient: typeof window !== 'undefined',
    });
    const client = createClient({
      ...clientOptions,
      exchanges: [...clientOptions.exchanges, cacheExchange, authExchange, ssr, fetchExchange],
      suspense: false,
      fetchOptions: {
        credentials: 'include',
      },
    });
    return [client, ssr];
  }, []);

  return (
    <UrqlProvider client={client} ssr={ssr}>
      <ThemeProvider attribute='class'>{children}</ThemeProvider>
    </UrqlProvider>
  );
}
