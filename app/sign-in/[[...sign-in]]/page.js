import { SignIn } from "@clerk/nextjs";

export const metadata = {
  title: 'Sign In — OwnerReply',
  description: 'Sign in to your OwnerReply account.',
};

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <SignIn />
    </div>
  );
}