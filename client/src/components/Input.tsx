import { Input as BaseInput, InputProps } from "@headlessui/react";
import clsx from "clsx";
import { forwardRef } from "react";

export const classes =
  "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500";

const Input = forwardRef<HTMLInputElement, InputProps>(function (
  { className, ...props },
  ref
) {
  return (
    <BaseInput className={clsx(className, classes)} {...props} ref={ref} />
  );
});

export default Input;
