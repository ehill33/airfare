import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div className='grid place-items-center min-h-dvh w-full'>
      <SignUp routing='hash' />
    </div>
  );
}
