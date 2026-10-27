import * as React from "react";
import { cn } from "@/lib/utils";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[120px] w-full rounded-xl border border-[#E2EBE0] bg-white px-4 py-3 text-sm text-[#1E293B] placeholder:text-[#94A3B8] transition-all duration-200 focus-visible:outline-none focus-visible:border-[#7A9A60] focus-visible:ring-2 focus-visible:ring-[#7A9A60]/20 disabled:cursor-not-allowed disabled:opacity-50 resize-y",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
