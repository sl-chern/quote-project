import type { Metadata } from 'next';
import { Open_Sans } from 'next/font/google';
import './globals.css';
import classNames from 'classnames';
import { Toaster } from '@/components/ui/toaster';
import { Providers } from './providers/providers';

const openSans = Open_Sans({
  subsets: ['cyrillic', 'latin'],
});

export const metadata: Metadata = {
  title: 'Quotes',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' className='h-full bg-white dark min-h-screen'>
      <body className={classNames(openSans.className)}>
        <Providers>
          <main className='max-w-7xl mx-auto h-full'>{children}</main>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
