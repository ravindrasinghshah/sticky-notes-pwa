import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const loadingVariants = cva("flex items-center justify-center", {
  variants: {
    size: {
      default: "min-h-screen",
      sm: "h-32",
      lg: "min-h-[50vh]",
    },
    variant: {
      default: "text-foreground",
      muted: "text-muted-foreground",
      primary: "text-primary",
    },
  },
  defaultVariants: {
    size: "default",
    variant: "default",
  },
});

const spinnerVariants = cva("animate-spin rounded-full border-b-2", {
  variants: {
    size: {
      default: "h-32 w-32",
      sm: "h-8 w-8",
      lg: "h-16 w-16",
    },
    variant: {
      default: "border-foreground",
      muted: "border-muted-foreground",
      primary: "border-primary",
    },
  },
  defaultVariants: {
    size: "default",
    variant: "default",
  },
});

export interface LoadingProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof loadingVariants> {
  message?: string;
  spinnerSize?: VariantProps<typeof spinnerVariants>["size"];
  spinnerVariant?: VariantProps<typeof spinnerVariants>["variant"];
}

const Loading = React.forwardRef<HTMLDivElement, LoadingProps>(
  (
    {
      className,
      size,
      variant,
      message,
      spinnerSize,
      spinnerVariant,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(loadingVariants({ size, variant, className }))}
        {...props}
      >
        <div className="flex flex-col items-center space-y-4">
          <div
            className={cn(
              spinnerVariants({ size: spinnerSize, variant: spinnerVariant })
            )}
          />
          {message && <div className="text-sm font-medium">{message}</div>}
        </div>
      </div>
    );
  }
);
Loading.displayName = "Loading";

export { Loading, loadingVariants, spinnerVariants };
