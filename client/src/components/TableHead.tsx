import clsx from "clsx";
import { forwardRef, HTMLAttributes } from "react";

const TableHead = forwardRef<
  HTMLTableSectionElement,
  HTMLAttributes<HTMLTableSectionElement>
>(function ({ className, ...props }, ref) {
  return (
    <thead
      {...props}
      ref={ref}
      className={clsx(
        className,
        "text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
      )}
    />
  );
});

export default TableHead;
