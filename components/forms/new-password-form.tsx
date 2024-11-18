"use client";

import { useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import CardWrapper from "@/components/shared/card-wrapper";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { newPasswordSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LoaderCircle } from "lucide-react";
import SuccessForm from "./success-form";
import ErrorForm from "./error-form";
import { createNewPasswordAction } from "@/actions/auth-actions";

const NewPasswordForm = () => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const form = useForm<z.infer<typeof newPasswordSchema>>({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const { handleSubmit, control, reset } = form;

  const onSubmit = (values: z.infer<typeof newPasswordSchema>) => {
    startTransition(async () => {
      try {
        const data = await createNewPasswordAction(values, token);
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
      reset();
    });
  };
  return (
    <CardWrapper
      headerLabel="Reset password"
      backButtonLabel="Back to login"
      backButtonHref="/auth/login"
    >
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={control}
            name="password"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>New password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter your new password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <FormField
            control={control}
            name="confirmPassword"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Confirm password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Confirm your password"
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
            <Button
              type="submit"
              className="w-full"
              disabled={isPending}
              variant="destructive"
            >
              {isPending ? <LoaderCircle className="animate-spin" /> : null}
              <span>Change password</span>
            </Button>
          </div>
        </form>
      </Form>
    </CardWrapper>
  );
};
export default NewPasswordForm;
