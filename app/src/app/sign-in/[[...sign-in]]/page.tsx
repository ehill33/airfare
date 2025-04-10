import { SignIn } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div className='grid place-items-center min-h-dvh w-full'>
      <SignIn routing='hash' />
    </div>
  );
}
