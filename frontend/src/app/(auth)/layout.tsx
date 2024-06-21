import Image from 'next/image';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className='flex flex-row w-full h-full gap-4 items-center justify-center'>
      <div className='w-1/2'>
        <Image
          className='text-black dark:text-white dark:invert w-4/5 h-4/5'
          src='/q.svg'
          alt='Q Logo'
          width={0}
          height={0}
          priority
        />
      </div>
      {children}
    </section>
  );
}
