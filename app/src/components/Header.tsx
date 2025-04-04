'use client';

import { ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useRouter } from 'next/navigation';
import useMediaQuery from '@/hooks/useMediaQuery';

type HeaderProps = {
  title: string;
  showBackButton?: boolean;
};

export default function Header({ title, showBackButton }: HeaderProps) {
  const router = useRouter();
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <div>
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
        <Avatar className='md:w-12 md:h-12 w-10 h-10 ml-auto'>
          <AvatarImage src='https://github.com/shadcn.png' />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>
      <h1 className='text-3xl md:text-6xl font-bold text-foreground my-10'>
        {title}
      </h1>
    </div>
  );
}
