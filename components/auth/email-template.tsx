import { FC } from "react";

interface EmailTemplateProps {
  firstName: string;
}

const EmailTemplate: FC<Readonly<EmailTemplateProps>> = ({ firstName }) => {
  return (
    <div>
      <h1 className="text-2xl text-purple-800 font-semibold">
        Welcome, {firstName}
      </h1>
    </div>
  );
};
export default EmailTemplate;
