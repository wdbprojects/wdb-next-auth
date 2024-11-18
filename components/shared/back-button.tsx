"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

interface BackButtonProps {
  href: string;
  label: string;
}

const BackButton = ({ href, label }: BackButtonProps) => {
  return (
    <Button variant="link" asChild className="mx-auto" size="sm">
      <Link href={href}>{label}</Link>
    </Button>
  );
};
export default BackButton;
