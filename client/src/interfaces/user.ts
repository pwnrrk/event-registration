export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  phone: string;
  isAdmin?: boolean;
  created?: Date;
  updated?: Date;
}
