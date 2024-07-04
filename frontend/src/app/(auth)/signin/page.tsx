'use client';

import { useRouter } from 'next/navigation';
import { Form } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import TextInput from '@/components/TextInput/TextInput';
import { PasswordInput } from '@/components/PasswordInput/PasswordInput';
import { Button } from '@/components/ui/button';
import signinSchema from '@/types/schemas/signinSchema.schema';
import { useMutation } from 'urql';
import { loginMutation } from '@/graphql/mutations/login';
import { useLoadingStore } from '@/store/loadingStore';
import { useEffect } from 'react';

export default function SignInPage() {
  const router = useRouter();
  const setLoading = useLoadingStore(state => state.setLoading);

  const [, login] = useMutation(loginMutation);

  const form = useForm<z.infer<typeof signinSchema>>({
    resolver: zodResolver(signinSchema),
    mode: 'onTouched',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const { control, handleSubmit } = form;

  const onSubmit = async (data: z.infer<typeof signinSchema>) => {
    try {
      await login(data);
      router.push('/');
    } catch {}
  };

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <div className='flex flex-col w-1/2 gap-4'>
      <h1 className='text-4xl font-medium text-white font-montserrat'>Welcome back</h1>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4 w-96'>
          <TextInput control={control} name='email' label='Email' type='text' disabled={false} />
          <PasswordInput control={control} name='password' label='Password' />
          <Button type='submit'>Sign In</Button>
        </form>
      </Form>
    </div>
  );
}
