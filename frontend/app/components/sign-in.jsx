"use client";
import { signIn } from "next-auth/react";

export function SignIn() {
  const username = "admin";
  const password = "1234";

  return (
    <button onClick={() => signIn("credentials", { username, password })}>
      Sign In
    </button>
  );
}
