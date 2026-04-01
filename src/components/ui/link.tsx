import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const linkVariants = cva(
  "inline-flex items-center text-sm font-medium transition-colors hover:text-primary",
  {
    variants: {
      variant: {
        default: "text-primary hover:text-primary/90",
        destructive:
          "text-destructive hover:text-destructive/90",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface LinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement>,
    VariantProps<typeof linkVariants> {}

const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ className, variant, ...props }, ref) => (
    <a
      ref={ref}
      className={cn(linkVariants({ variant }), className)}
      {...props}
    />
  )
);
Link.displayName = "Link";

export { Link, linkVariants };
