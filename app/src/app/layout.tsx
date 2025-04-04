import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { ClerkProvider, SignedIn, SignedOut, SignIn } from '@clerk/nextjs';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang='en' className='dark'>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-dvh bg-background`}
        >
          <div className='min-w-full p-4 overflow-x-scroll'>
            <main className='container mx-auto'>
              <SignedOut>
                <div className='grid place-items-center min-h-dvh w-full'>
                  <SignIn routing='hash' />
                </div>
              </SignedOut>
              <SignedIn>{children}</SignedIn>
            </main>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
