import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "secondary" | "outline" | "ghost" | "ivory" | "dark";
  size?: "default" | "sm" | "lg" | "icon";
  asChild?: boolean;
  href?: string;
  target?: string;
  rel?: string;
  onClick?: React.MouseEventHandler<HTMLElement>;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "default",
      size = "default",
      asChild = false,
      href,
      target,
      rel,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#171717] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] cursor-pointer";

    const variantStyles = {
      default:
        "bg-[#171717] text-[#F5F1E9] hover:bg-[#2A2A2A] shadow-xs border border-transparent rounded-full",
      dark:
        "bg-[#171717] text-[#FFFFFF] hover:bg-[#2E2E2E] border border-[#333333] rounded-full",
      secondary:
        "bg-[#FFFFFF] text-[#171717] hover:bg-[#F5F1E9] border border-[#E5E0D8] shadow-xs rounded-full",
      outline:
        "border border-[#171717] bg-transparent text-[#171717] hover:bg-[#171717] hover:text-[#F5F1E9] rounded-full",
      ivory:
        "bg-[#F5F1E9] text-[#171717] hover:bg-[#ECE7DF] border border-[#E5E0D8] rounded-full",
      ghost:
        "text-[#171717] hover:bg-[#E5E0D8]/40 hover:text-[#171717] rounded-full",
    };

    const sizeStyles = {
      default: "h-11 px-6 py-2.5",
      sm: "h-9 px-4 text-xs",
      lg: "h-12 px-8 text-base font-semibold tracking-tight",
      icon: "h-10 w-10 p-0 rounded-full",
    };

    const combinedClassName = cn(
      baseStyles,
      variantStyles[variant],
      sizeStyles[size],
      className
    );

    if (href) {
      if (href.startsWith("/") || href.startsWith("#")) {
        return (
          <Link
            href={href}
            className={combinedClassName}
            onClick={props.onClick as unknown as React.MouseEventHandler<HTMLAnchorElement>}
          >
            {children}
          </Link>
        );
      }
      return (
        <a
          href={href}
          target={target}
          rel={rel}
          className={combinedClassName}
          {...(props as unknown as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {children}
        </a>
      );
    }

    return (
      <button
        className={combinedClassName}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button };
