'use client';

import { useRouter } from 'next/navigation';
import { useMutation } from 'urql';
import { registrationMutation } from '@/graphql/mutations/registration';
import { Form } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import TextInput from '@/components/TextInput/TextInput';
import { PasswordInput } from '@/components/PasswordInput/PasswordInput';
import { Button } from '@/components/ui/button';
import registrationSchema from '@/types/schemas/registrationSchema.schema';
import { useToast } from '@/components/ui/use-toast';

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [, register] = useMutation(registrationMutation);

  const form = useForm<z.infer<typeof registrationSchema>>({
    resolver: zodResolver(registrationSchema),
    mode: 'onTouched',
    defaultValues: {
      username: '',
      email: '',
      password: '',
    },
  });

  const { control, handleSubmit } = form;

  const onSubmit = async (data: z.infer<typeof registrationSchema>) => {
    try {
      const res = await register(data);
      if (res.error)
        toast({
          title: 'Error during registration',
          description: res.error.message.replace('[GraphQL] ', ''),
        });
      else {
        toast({
          title: 'Account created successfully!',
        });
        router.push('/signin');
      }
    } catch {}
  };

  return (
    <div className='flex flex-col w-1/2 gap-4'>
      <h1 className='text-4xl font-medium text-white font-montserrat'>Register now</h1>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4 w-96'>
          <TextInput control={control} name='email' label='Email' type='text' disabled={false} />
          <TextInput
            control={control}
            name='username'
            label='User name'
            type='text'
            disabled={false}
          />
          <PasswordInput control={control} name='password' label='Password' />
          <Button type='submit'>Sign Up</Button>
        </form>
      </Form>
    </div>
  );
}
