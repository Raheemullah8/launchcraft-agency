import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "olive" | "sage" | "outline" | "mint";
}

function Badge({ className, variant = "olive", ...props }: BadgeProps) {
  const baseStyles =
    "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium tracking-wide uppercase transition-colors duration-200";

  const variantStyles = {
    olive:
      "bg-[#2C4018] text-[#F2F7F1] border border-[#3E5723]/30 shadow-xs",
    sage:
      "bg-[#E3EDE0] text-[#2C4018] border border-[#7A9A60]/40 font-semibold",
    outline:
      "border border-[#2C4018]/30 text-[#2C4018] bg-white/60 backdrop-blur-xs",
    mint:
      "bg-[#F2F7F1] text-[#2C4018] border border-[#E2EBE0]",
  };

  return (
    <div
      className={cn(baseStyles, variantStyles[variant], className)}
      {...props}
    />
  );
}

export { Badge };
