import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "charcoal" | "ivory" | "outline" | "subtle" | "olive" | "sage" | "mint";
}

function Badge({ className, variant = "subtle", ...props }: BadgeProps) {
  const baseStyles =
    "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium tracking-wider uppercase transition-colors duration-200";

  const variantStyles: Record<string, string> = {
    charcoal: "bg-[#171717] text-[#F5F1E9] border border-transparent",
    ivory: "bg-[#ECE7DF] text-[#171717] border border-[#E5E0D8]",
    outline: "border border-[#171717] text-[#171717] bg-transparent",
    subtle: "bg-[#FFFFFF] text-[#171717] border border-[#E5E0D8]",
    olive: "bg-[#171717] text-[#F5F1E9] border border-transparent",
    sage: "bg-[#ECE7DF] text-[#171717] border border-[#E5E0D8]",
    mint: "bg-[#FFFFFF] text-[#171717] border border-[#E5E0D8]",
  };

  return (
    <div
      className={cn(baseStyles, variantStyles[variant] || variantStyles.subtle, className)}
      {...props}
    />
  );
}

export { Badge };
