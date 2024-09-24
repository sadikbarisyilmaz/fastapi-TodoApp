"use client";
import { deleteTodos } from "@/app/actions.";
import { Button } from "./ui/button";

export const DeleteTodoButton = ({ id }) => {
  const handleDelete = async () => await deleteTodos(id);

  return (
    <Button onClick={handleDelete} variant="ghost">
      X
    </Button>
  );
};
