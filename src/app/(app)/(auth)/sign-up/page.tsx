import { redirect } from 'next/navigation';

import { caller } from '@/trpc/server';

import { SignUpView } from '@/modules/auth/ui/view/sign-up-view';

const SignUp =  async () => {
  const session = await caller.auth.session();

  if (session.user) {
    redirect("/")
  }
  return (
    <SignUpView />
  )
}

export default SignUp;