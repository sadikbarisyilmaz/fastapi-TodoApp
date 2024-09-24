"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { updateTodo } from "@/app/actions.";

export const UpdateTodoForm = ({ todo }) => {
  const todoSchema = z.object({
    title: z.string().min(5, {
      message: "Must be at least 5 characters.",
    }),
    description: z.string().min(5, {
      message: "Must be at least 5 characters.",
    }),
    priority: z
      .number()
      .min(1, {
        message: "Must be at least 1",
      })
      .max(5, {
        message: "Must be smaller than 5",
      }),
    complete: z.boolean(),
    id: z.string(),
  });

  const form = useForm({
    resolver: zodResolver(todoSchema),
    defaultValues: {
      title: todo.title,
      description: todo.description,
      priority: todo.priority,
      complete: todo.complete,
      owner_id: todo.owner_id,
      id: todo.id,
    },
  });

  async function onSubmit(values) {
    console.log("asdasd");
    try {
      const res = await updateTodo(values);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      <h2 className="text-xl font-semibold md:text-start text-center">
        Create New Todo
      </h2>
      <Separator />
      <div className="flex w-full flex-col gap-2">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
            <div className="grid gap-2">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <div className="flex gap-4">
                          <div className="flex items-center space-x-1">
                            <Label htmlFor="r1">1</Label>
                            <RadioGroupItem value={1} id="r1" />
                          </div>
                          <div className="flex items-center space-x-1">
                            <Label htmlFor="r2">2</Label>
                            <RadioGroupItem value={2} id="r2" />
                          </div>
                          <div className="flex items-center space-x-1">
                            <Label htmlFor="r3">3</Label>
                            <RadioGroupItem value={3} id="r3" />
                          </div>
                          <div className="flex items-center space-x-1">
                            <Label htmlFor="r4">4</Label>
                            <RadioGroupItem value={4} id="r4" />
                          </div>
                          <div className="flex items-center space-x-1">
                            <Label htmlFor="r5">5</Label>
                            <RadioGroupItem value={5} id="r5" />
                          </div>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="complete"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Complete</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <div className="flex gap-4">
                          <div className="flex items-center space-x-1">
                            <Label htmlFor="r2">Not Completed</Label>
                            <RadioGroupItem value={false} />
                          </div>
                          <div className="flex items-center space-x-1">
                            <Label htmlFor="r1">Completed</Label>
                            <RadioGroupItem value={true} />
                          </div>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button className="w-full mt-4" type="submit">
              Submit
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};
