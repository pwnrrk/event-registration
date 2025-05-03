import clsx from "clsx";
import { forwardRef, HTMLAttributes } from "react";

const TableCell = forwardRef<
  HTMLTableCellElement,
  HTMLAttributes<HTMLTableCellElement> & { head?: boolean }
>(function ({ head, className, ...props }, ref) {
  if (head)
    return <th {...props} ref={ref} className={clsx(className, "px-6 py-3")} />;
  
  return <td {...props} ref={ref} className={clsx(className, "px-6 py-3")} />;
});

export default TableCell;
