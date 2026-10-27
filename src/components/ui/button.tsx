import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "secondary" | "outline" | "ghost" | "sage" | "dark";
  size?: "default" | "sm" | "lg" | "icon";
  asChild?: boolean;
  href?: string;
  target?: string;
  rel?: string;
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
      "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7A9A60] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]";

    const variantStyles = {
      default:
        "bg-[#2C4018] text-[#F2F7F1] hover:bg-[#3D5922] hover:shadow-lg hover:shadow-[#2C4018]/15 border border-transparent",
      dark:
        "bg-[#1A270F] text-[#FFFFFF] hover:bg-[#2C4018] hover:shadow-md border border-[#7A9A60]/30",
      secondary:
        "bg-[#F2F7F1] text-[#2C4018] hover:bg-[#E3EDE0] border border-[#E2EBE0] hover:border-[#7A9A60]/40",
      outline:
        "border-2 border-[#2C4018] bg-transparent text-[#2C4018] hover:bg-[#2C4018] hover:text-[#FFFFFF]",
      sage:
        "bg-[#7A9A60] text-white hover:bg-[#688550] hover:shadow-lg hover:shadow-[#7A9A60]/25 border border-transparent",
      ghost:
        "text-[#2C4018] hover:bg-[#F2F7F1] hover:text-[#2C4018]",
    };

    const sizeStyles = {
      default: "h-11 px-6 py-2.5",
      sm: "h-9 px-4 text-xs",
      lg: "h-13 px-8 text-base tracking-wide font-semibold",
      icon: "h-10 w-10 p-0",
    };

    const combinedClassName = cn(
      baseStyles,
      variantStyles[variant],
      sizeStyles[size],
      className
    );

    if (href) {
      return (
        <a
          href={href}
          target={target}
          rel={rel}
          className={combinedClassName}
        >
          {children}
        </a>
      );
    }

    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(
        children as React.ReactElement<{ className?: string }>,
        {
          className: cn(
            combinedClassName,
            (children as React.ReactElement<{ className?: string }>).props.className
          ),
          ...props,
        }
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
