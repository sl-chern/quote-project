'use client';

import Image from 'next/image';

export default function PageLoading() {
  return (
    <div className='w-screen h-screen bg-background flex flex-row items-center justify-center absolute top-0 left-0 z-[100]'>
      <Image
        src={'/q.svg'}
        alt='loading'
        height={100}
        width={100}
        className='w-20 h-20 text-black dark:text-white dark:invert animate-loading'
      />
    </div>
  );
}
