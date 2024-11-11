import { CircleCheckBig } from "lucide-react";

interface FormSuccessProps {
  message?: string;
}

const SuccessForm = ({ message }: FormSuccessProps) => {
  if (!message) return null;

  return (
    <div className="bg-emerald-500/15 rounded-md flex items-center gap-x-2 text-sm text-emerald-500 py-1 px-2">
      <CircleCheckBig className="h-4 w-4" />
      <p>{message}</p>
    </div>
  );
};
export default SuccessForm;
