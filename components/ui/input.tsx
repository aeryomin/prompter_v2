import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-slate-900 px-3 py-2 text-sm text-slate-50 shadow-sm outline-none ring-0 transition hover:border-slate-500 focus-visible:border-sky-500 focus-visible:ring-2 focus-visible:ring-sky-500/40",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";

