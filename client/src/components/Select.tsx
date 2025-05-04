import { Select as BaseSelect, SelectProps } from "@headlessui/react";
import clsx from "clsx";
import { forwardRef } from "react";
import { classes } from "./Input";

const Select = forwardRef<HTMLSelectElement, SelectProps>(function (
  { className, ...props },
  ref
) {
  return (
    <BaseSelect {...props} ref={ref} className={clsx(classes, className)} />
  );
});

export default Select;
