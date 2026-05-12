import { SignUp } from "@clerk/nextjs";

export const metadata = {
  title: 'Sign Up — OwnerReply',
  description: 'Create your OwnerReply account and start responding to reviews.',
};

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <SignUp />
    </div>
  );
}