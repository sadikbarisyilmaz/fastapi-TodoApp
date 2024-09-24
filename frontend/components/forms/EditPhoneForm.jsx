"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { changePhoneNumber } from "@/app/actions.";
import { Separator } from "../ui/separator";

const formSchema = z.object({
  phoneNumber: z
    .string({
      required_error: "First name is required",
    })
    .min(11)
    .regex(
      /^(\+90|0)?\s*(\(\d{3}\)[\s-]*\d{3}[\s-]*\d{2}[\s-]*\d{2}|\(\d{3}\)[\s-]*\d{3}[\s-]*\d{4}|\(\d{3}\)[\s-]*\d{7}|\d{3}[\s-]*\d{3}[\s-]*\d{4}|\d{3}[\s-]*\d{3}[\s-]*\d{2}[\s-]*\d{2})$/
    ),
});

export const EditPhoneForm = () => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phoneNumber: "",
    },
  });

  function onSubmit(values) {
    try {
      console.log(values);

      changePhoneNumber(values.phoneNumber);
      form.reset();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      <h2 className="text-xl font-semibold md:text-start text-center">
        Change Phone Number
      </h2>
      <Separator />
      <div className="flex flex-col gap-2">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="">
            <div className="grid gap-2">
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="(0512) 345-67-89" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <br />
              <Button className="w-full mt-2" type="submit">
                Submit
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};
