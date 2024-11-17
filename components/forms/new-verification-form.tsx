"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import CardWrapper from "@/components/shared/card-wrapper";
import { BeatLoader } from "react-spinners";
import { newVerificationAction } from "@/actions/auth-actions";
import SuccessForm from "@/components/forms/success-form";
import ErrorForm from "@/components/forms/error-form";

const NewVerificationForm = () => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const params = useSearchParams();
  const token = params.get("token");

  const onSubmit = useCallback(async () => {
    if (!token) {
      setError("Missing token");
      return;
    }
    try {
      const data = await newVerificationAction(token as string);
      setSuccess(data.success);
      setError(data.error);
    } catch (err) {
      console.log(err);
      setError("Something went wrong");
    }
  }, [token]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);

  return (
    <CardWrapper
      headerLabel="Confirming your verification"
      backButtonHref="/auth/login"
      backButtonLabel="Back to login"
    >
      <div className="flex items-center w-full justify-center">
        {!success && !error && <BeatLoader color="#3b82f6" />}
        <SuccessForm message={success} />
        <ErrorForm message={error} />
      </div>
    </CardWrapper>
  );
};
export default NewVerificationForm;
