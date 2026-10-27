import * as React from "react";
import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-12 w-full rounded-xl border border-[#E2EBE0] bg-white px-4 py-3 text-sm text-[#1E293B] placeholder:text-[#94A3B8] transition-all duration-200 focus-visible:outline-none focus-visible:border-[#7A9A60] focus-visible:ring-2 focus-visible:ring-[#7A9A60]/20 disabled:cursor-not-allowed disabled:opacity-50",
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
