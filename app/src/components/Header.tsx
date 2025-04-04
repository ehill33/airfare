'use client';

import { ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';
import useMediaQuery from '@/hooks/useMediaQuery';
import { UserButton } from '@clerk/nextjs';

type HeaderProps = {
  title: string;
  showBackButton?: boolean;
};

export default function Header({ title, showBackButton }: HeaderProps) {
  const router = useRouter();
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <header>
      <div className='flex items-center justify-between'>
        {showBackButton && (
          <Button
            variant='secondary'
            size={isMobile ? 'icon' : 'lg'}
            onClick={() => router.back()}
            className='md:w-12 md:h-12 w-10 h-10'
          >
            <ArrowLeft />
          </Button>
        )}
        <div className='flex items-center ml-auto gap-4'>
          <UserButton
            appearance={{
              elements: {
                rootBox: {
                  color: 'white',
                },
                avatarBox: {
                  width: '48px',
                  height: '48px',
                  '@media (max-width: 768px)': {
                    width: '40px',
                    height: '40px',
                  },
                },
              },
            }}
          />
        </div>
      </div>
      <h1 className='text-3xl md:text-6xl font-bold text-foreground my-10'>
        {title}
      </h1>
    </header>
  );
}
