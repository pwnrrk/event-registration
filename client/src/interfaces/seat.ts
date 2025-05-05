import { User } from "./user";

export interface Seat {
  _id: string;
  seatNo: string;
  user?: User;
  created?: Date;
  updated?: Date;
}
