"use client";

import { ComponentProps } from "react";
import { ThemeProvider as NextThemeProvider } from "next-themes";

type ThemeProviderProps = ComponentProps<typeof NextThemeProvider>;

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemeProvider {...props}>{children}</NextThemeProvider>;
}
