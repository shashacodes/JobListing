import React from "react";
import { cn } from "@/app/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "flex h-10 w-full  rounded-md border border-input text-black font-bold px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground ",
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";
