import { getTodo } from "@/app/actions.";
import { UpdateTodoForm } from "@/components/forms/UpdateTodoForm";
import Link from "next/link";

export default async function Page({ params }) {
  const todo = await getTodo(params.id);

  return (
    <div className="flex flex-col items-center justify-items-center min-h-screen p-8 pb-20 gap-4 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <Link href={"/dashboard"}>Back To Dashboard</Link>
      <UpdateTodoForm todo={todo} />
    </div>
  );
}
