
import { SignIn } from "@clerk/clerk-react";
import { MainNav } from "@/components/MainNav";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-background">
      <MainNav />
      <div className="container mx-auto flex justify-center items-center py-16">
        <div className="w-full max-w-md border rounded-lg p-8 shadow-sm bg-card">
          <h1 className="text-2xl font-bold mb-6 text-center">Sign In</h1>
          <SignIn signUpUrl="/signup" />
        </div>
      </div>
    </div>
  );
}
