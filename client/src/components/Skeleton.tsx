import clsx from "clsx";
import { forwardRef, HTMLAttributes } from "react";

const Skeleton = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function ({ className, ...props }, ref) {
    return (
      <div
        {...props}
        className={clsx(
          "h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px] mb-3",
          className
        )}
        ref={ref}
      ></div>
    );
  }
);

export default Skeleton;
