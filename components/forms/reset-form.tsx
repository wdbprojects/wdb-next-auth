"use client";

import { useState, useTransition } from "react";
import CardWrapper from "@/components/shared/card-wrapper";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { forgotPasswordSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LoaderCircle } from "lucide-react";
import SuccessForm from "./success-form";
import ErrorForm from "./error-form";
import { resetPasswordAction } from "@/actions/auth-actions";

const ResetForm = () => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const { handleSubmit, control, reset } = form;

  const onSubmit = (values: z.infer<typeof forgotPasswordSchema>) => {
    startTransition(async () => {
      try {
        const data = await resetPasswordAction(values);
        if (data && data.error) {
          setError(data.error);
          setSuccess("");
        } else if (data && data.success) {
          setError("");
          setSuccess(data.success);
        }
      } catch (err) {
        console.log(err);
      }
    });
    reset();
  };
  return (
    <CardWrapper
      headerLabel="Forgot your password?"
      backButtonLabel="Back to login"
      backButtonHref="/auth/login"
    >
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={control}
            name="email"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Type your current email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <SuccessForm message={success} />
          <ErrorForm message={error} />
          <div className="flex items-center justify-between gap-3 !mt-8 !mb-4">
            <Button
              type="reset"
              variant="secondary"
              className="w-full"
              disabled={isPending}
              onClick={() => {
                reset();
                setError("");
                setSuccess("");
              }}
            >
              Reset form
            </Button>
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? <LoaderCircle className="animate-spin" /> : null}
              <span>Send reset email</span>
            </Button>
          </div>
        </form>
      </Form>
    </CardWrapper>
  );
};
export default ResetForm;
