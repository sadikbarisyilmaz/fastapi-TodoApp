import { SignOut } from "@/components/sign-out";
import { getTodos, getUser } from "../actions.";
import { Separator } from "@/components/ui/separator";
import { EditPhoneForm } from "@/components/forms/EditPhoneForm";
import { EditUserPasswordForm } from "@/components/forms/EditPasswordForm";
import { DeleteTodoButton } from "@/components/DeleteTodoButton";
import { CreateTodoForm } from "@/components/forms/CreateTodoForm";
import Link from "next/link";

export default async function Page() {
  const user = await getUser();
  const todos = await getTodos();

  return (
    <div className="flex flex-col items-center justify-items-center min-h-screen p-8 pb-20 gap-4 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div className="flex gap-2">
        <SignOut />
        {/* <GetUserButton /> */}
      </div>
      <div className="flex flex-col w-full gap-2">
        <h2 className="text-xl font-bold">Todos</h2>
        {todos.map((todo, i) => {
          return (
            <li className="pl-3" key={i}>
              {todo.title}
              <DeleteTodoButton id={todo.id} />
              <Link href={`/dashboard/${todo.id}`}>Edit</Link>
            </li>
          );
        })}
      </div>
      <div className="w-full">
        <CreateTodoForm />
      </div>
      <div className="grid grid-cols-2 w-full">
        <div className="grid border-r-0 border border-black/40">
          <h2 className="border-y p-2 border-black/40">Username</h2>
          <h2 className="border-y p-2 border-black/40">First Name</h2>
          <h2 className="border-y p-2 border-black/40">Last Name</h2>
          <h2 className="border-y p-2 border-black/40">Phone Number</h2>
        </div>
        <div className="grid border border-black/40">
          <p className="border-y p-2 border-black/40">{user.username}</p>
          <p className="border-y p-2 border-black/40">{user.first_name}</p>
          <p className="border-y p-2 border-black/40">{user.last_name}</p>
          <p className="border-y p-2 border-black/40">{user.phone_number}</p>
        </div>
      </div>

      <Separator />
      <EditPhoneForm />
      <EditUserPasswordForm />
    </div>
  );
}
