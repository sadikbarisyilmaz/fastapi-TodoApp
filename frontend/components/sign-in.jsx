"use client";
import { signIn } from "next-auth/react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

export function SignIn() {
  const username = "admin";
  const password = "1234";
  const router = useRouter();

  const handleSignIn = () => {
    try {
      signIn("credentials", {
        username,
        password,
        callbackUrl: "/dashboard",
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Button variant="ghost" onClick={handleSignIn}>
      Sign In
    </Button>
  );
}
