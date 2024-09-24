import { SignIn } from "@/components/sign-in";

export default async function Home() {
  return (
    <div className="flex flex-col items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <h1>Login Page</h1>
      <SignIn />
    </div>
  );
}
