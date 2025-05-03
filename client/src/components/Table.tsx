import clsx from "clsx";
import { forwardRef, HTMLAttributes } from "react";

const Table = forwardRef<HTMLTableElement, HTMLAttributes<HTMLTableElement>>(
  function ({ className, ...props }, ref) {
    return (
      <table
        {...props}
        ref={ref}
        className={clsx(
          className,
          "w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
        )}
      />
    );
  }
);

export default Table;
