import clsx from "clsx";
import { forwardRef, HTMLAttributes } from "react";

const Badge = forwardRef<HTMLSpanElement, HTMLAttributes<HTMLSpanElement>>(
  function ({ className, ...props }, ref) {
    return (
      <span
        {...props}
        className={clsx(
          "bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm dark:bg-blue-900 dark:text-blue-300",
          className
        )}
        ref={ref}
      />
    );
  }
);

export default Badge;
