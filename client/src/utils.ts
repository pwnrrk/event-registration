interface FieldError {
  type: string;
  value: unknown;
  msg: string;
  path: string;
  location: string;
}

interface FormErrors {
  errors: FieldError[];
}
export function isFormErrors(value: unknown): value is FormErrors {
  if (typeof value !== "object") return false;
  if (Object.getOwnPropertyNames(value).includes("errors")) return true;
  return false;
}
