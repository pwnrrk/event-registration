import { Seat } from "./seat";

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  phone: string;
  seat?: Seat;
  created?: Date;
  updated?: Date;
}
