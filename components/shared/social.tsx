"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { signIn } from "next-auth/react";

const Social = () => {
  const [isPending, startTransition] = useTransition();
  const handleOnClick = (provider: "google" | "github") => {
    startTransition(() => {
      signIn(provider, { callbackUrl: DEFAULT_LOGIN_REDIRECT });
    });
  };

  return (
    <div className="flex items-center w-full gap-x-2">
      <Button
        size="sm"
        className="w-full"
        variant="outline"
        disabled={isPending}
        onClick={() => {
          handleOnClick("github");
        }}
      >
        Github
      </Button>
      <Button
        size="sm"
        className="w-full"
        variant="outline"
        disabled={isPending}
        onClick={() => {
          handleOnClick("google");
        }}
      >
        Google
      </Button>
    </div>
  );
};
export default Social;
