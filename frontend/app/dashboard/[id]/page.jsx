import { getTodo } from "@/app/actions.";
import { UpdateTodoForm } from "@/components/forms/UpdateTodoForm";

export default async function Page({ params }) {
  const todo = await getTodo(params.id);
  console.log(todo);

  return (
    <div className="flex flex-col items-center justify-items-center min-h-screen p-8 pb-20 gap-4 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <UpdateTodoForm todo={todo} />
    </div>
  );
}
