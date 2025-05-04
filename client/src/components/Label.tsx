import { Label as BaseLabel, LabelProps } from "@headlessui/react";
import clsx from "clsx";
import { forwardRef } from "react";

const Label = forwardRef<HTMLLabelElement, LabelProps>(function (
  { className, ...props },
  ref
) {
  return (
    <BaseLabel
      {...props}
      className={clsx(
        "block mb-2 text-sm font-medium text-gray-900 dark:text-white",
        className
      )}
      ref={ref}
    />
  );
});

export default Label;
