"use client";

import { getUser } from "@/app/actions.";
import { Button } from "./ui/button";

export const GetUserButton = () => {
  const getUserInfo = async () => {
    const info = await getUser();
    console.log(info);
  };
  return (
    <Button variant="ghost" onClick={getUserInfo}>
      User Info
    </Button>
  );
};
