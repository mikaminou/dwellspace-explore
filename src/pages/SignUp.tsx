
import { SignUp } from "@clerk/clerk-react";
import { MainNav } from "@/components/MainNav";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-background">
      <MainNav />
      <div className="container mx-auto flex justify-center items-center py-16">
        <div className="w-full max-w-md border rounded-lg p-8 shadow-sm bg-card">
          <h1 className="text-2xl font-bold mb-6 text-center">Create an Account</h1>
          <SignUp signInUrl="/signin" />
        </div>
      </div>
    </div>
  );
}
