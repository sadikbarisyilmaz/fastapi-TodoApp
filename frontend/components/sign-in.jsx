"use client";
import { signIn } from "next-auth/react";
import { Button } from "./ui/button";

export function SignIn() {
  const username = "admin";
  const password = "1234";

  return (
    <Button
      variant="ghost"
      onClick={() => signIn("credentials", { username, password })}
    >
      Sign In
    </Button>
  );
}
