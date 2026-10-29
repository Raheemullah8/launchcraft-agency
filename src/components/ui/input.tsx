import * as React from "react";
import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-12 w-full rounded-lg border border-[#E5E0D8] bg-white px-4 py-3 text-sm text-[#171717] placeholder:text-[#888888] transition-all duration-200 focus-visible:outline-none focus-visible:border-[#171717] focus-visible:ring-1 focus-visible:ring-[#171717] disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
