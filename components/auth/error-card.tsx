import CardWrapper from "@/components/shared/card-wrapper";
import { TriangleAlert } from "lucide-react";

const ErrorCard = () => {
  return (
    <CardWrapper
      headerLabel="Sorry, something went wrong!"
      backButtonHref="/auth/login"
      backButtonLabel="Go back to login"
    >
      <div className="w-full flex items-center justify-center">
        <TriangleAlert className="h-4 w-4 text-destructive" />
      </div>
    </CardWrapper>
  );
};
export default ErrorCard;
