import NewPasswordForm from "@/components/forms/new-password-form";
import { Suspense } from "react";

const NewPasswordPage = () => {
  return (
    <Suspense>
      <NewPasswordForm />
    </Suspense>
  );
};
export default NewPasswordPage;
