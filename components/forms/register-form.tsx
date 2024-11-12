"use client";

import { useState, useTransition } from "react";
import CardWrapper from "@/components/shared/card-wrapper";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { registerFormSchema } from "@/schemas";
import ErrorForm from "@/components/forms/error-form";
import SuccessForm from "@/components/forms/success-form";
import { registerAction } from "@/actions/auth-actions";
import { LoaderCircle } from "lucide-react";

const RegisterForm = () => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  const form = useForm<z.infer<typeof registerFormSchema>>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
  });
  const { handleSubmit, control, reset } = form;

  const onSubmit = (values: z.infer<typeof registerFormSchema>) => {
    console.log(values);

    startTransition(async () => {
      try {
        const data = await registerAction(values);
        if (data.error) {
          setError(data.error);
          setSuccess("");
        } else {
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
      headerLabel="Create an account"
      backButtonLabel="Already have an account? Login..."
      backButtonHref="/auth/login"
      showSocial
    >
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex items-center gap-x-2 justify-between">
            <FormField
              control={control}
              name="firstName"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="Enter your first name"
                        autoComplete="off"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              control={control}
              name="lastName"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="Enter your last name"
                        autoComplete="off"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          </div>

          <FormField
            control={control}
            name="email"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="Enter your email"
                      autoComplete="off"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <FormField
            control={control}
            name="password"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="Enter your password"
                      type="password"
                      autoComplete="off"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <SuccessForm message={success} />
          <ErrorForm message={error} />
          <div className="flex items-center justify-between gap-3 !mt-8">
            <Button
              type="reset"
              variant="secondary"
              className="w-full"
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
              <span>Register</span>
            </Button>
          </div>
        </form>
      </Form>
    </CardWrapper>
  );
};
export default RegisterForm;
