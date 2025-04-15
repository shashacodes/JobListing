import React from "react";
import { cn } from "@/app/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "link";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, variant = "default", ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none h-10 px-4 py-2";

    const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
        default: "bg-black text-white hover:bg-gray-800",
        outline: "border border-input hover:bg-accent hover:text-accent-foreground",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "underline-offset-4 hover:underline text-primary",
      };
      

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
