import * as React from "react";
import { cn } from "@/shared/lib/utils";
import { Spinner } from "./Spinner";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", isLoading = false, children, disabled, ...props }, ref) => {
    
    const baseClasses = "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
    
    const variants = {
      default: "bg-brand-orange text-white hover:bg-brand-coral",
      destructive: "bg-semantic-error text-white hover:bg-semantic-error/90",
      outline: "border border-brand-orange/20 hover:bg-brand-orange/10 hover:text-brand-orange text-white",
      secondary: "bg-brand-card text-white hover:bg-brand-card/80",
      ghost: "hover:bg-brand-card hover:text-white",
      link: "text-brand-orange underline-offset-4 hover:underline",
    };

    const sizes = {
      default: "h-10 px-4 py-2",
      sm: "h-9 rounded-md px-3",
      lg: "h-11 rounded-md px-8",
      icon: "h-10 w-10",
    };

    return (
      <button
        className={cn(baseClasses, variants[variant], sizes[size], className)}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <Spinner size="sm" className="mr-2 text-current" />}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button };
