'use client';

import { ClientOptions, Exchange } from '@urql/next';
import { cacheExchange, createClient, fetchExchange } from '@urql/next';
import { devtoolsExchange } from '@urql/devtools';
import { registerUrql } from '@urql/next/rsc';
import { refreshTokenMutation } from '@/graphql/mutations/refreshToken';
import { AuthConfig, authExchange } from '@urql/exchange-auth';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

const clientOptions: ClientOptions = {
  url: `http://${process.env.NEXT_PUBLIC_BACKEND_HOST}:${process.env.NEXT_PUBLIC_BACKEND_PORT}/graphql`,
  exchanges: [],
  fetchOptions: {
    credentials: 'include',
  },
};

const makeClient = () => {
  return createClient({
    ...clientOptions,
    url: `http://localhost:${process.env.NEXT_PUBLIC_BACKEND_PORT}/graphql`,
    exchanges: [...clientOptions.exchanges, cacheExchange, fetchExchange, devtoolsExchange],
  });
};

const { getClient } = registerUrql(makeClient);

const getAuthExchange = (router: AppRouterInstance): Exchange =>
  authExchange(async (): Promise<AuthConfig> => {
    return {
      addAuthToOperation(operation) {
        return operation;
      },
      async refreshAuth() {
        const res = await getClient().mutation(refreshTokenMutation, {});
        if (res?.error) router.push('/signin');
      },
      didAuthError(error) {
        return error.message.includes('Unauthorized');
      },
      willAuthError() {
        return false;
      },
    };
  });

export { clientOptions, getAuthExchange };
