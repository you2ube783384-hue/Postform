"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const pfButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-mono-tech uppercase tracking-wider font-bold border-2 border-pf-black select-none whitespace-nowrap disabled:pointer-events-none disabled:opacity-40 pf-press cursor-pointer",
  {
    variants: {
      variant: {
        // Yellow primary CTA — black text, black border
        primary:
          "bg-pf-yellow text-pf-black hover:-translate-x-[2px] hover:-translate-y-[2px] hover:pf-hard-shadow-sm active:translate-x-0 active:translate-y-0 active:shadow-none",
        // Black structural CTA
        dark: "bg-pf-black text-pf-cream hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[3px_3px_0_0_#6c4cf1] active:translate-x-0 active:translate-y-0 active:shadow-none",
        // Paper secondary — white with black border
        outline:
          "bg-pf-paper text-pf-black hover:-translate-x-[2px] hover:-translate-y-[2px] hover:pf-hard-shadow-sm active:translate-x-0 active:translate-y-0 active:shadow-none",
        // Purple accent action
        purple:
          "bg-pf-purple text-white hover:-translate-x-[2px] hover:-translate-y-[2px] hover:pf-hard-shadow-sm active:translate-x-0 active:translate-y-0 active:shadow-none",
        // Bare text action with underline
        ghost:
          "border-transparent bg-transparent text-pf-black hover:text-pf-purple underline-offset-4 hover:underline normal-case",
        // Danger
        danger: "bg-pf-red text-white hover:shadow-[3px_3px_0_0_#141310]",
      },
      size: {
        sm: "h-9 px-3 text-[11px]",
        md: "h-11 px-5 text-xs",
        lg: "h-14 px-8 text-sm",
        xl: "h-16 px-10 text-base",
        icon: "h-10 w-10 p-0",
      },
      block: {
        true: "w-full",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface PFButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof pfButtonVariants> {}

const PFButton = React.forwardRef<HTMLButtonElement, PFButtonProps>(
  ({ className, variant, size, block, type = "button", ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn(pfButtonVariants({ variant, size, block }), className)}
      {...props}
    />
  )
);
PFButton.displayName = "PFButton";

export { PFButton, pfButtonVariants };
