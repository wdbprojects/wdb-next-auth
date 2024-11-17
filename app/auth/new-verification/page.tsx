import { Suspense } from "react";
import NewVerificationForm from "@/components/forms/new-verification-form";

const NewVerification = () => {
  return (
    <Suspense>
      <NewVerificationForm />
    </Suspense>
  );
};
export default NewVerification;
