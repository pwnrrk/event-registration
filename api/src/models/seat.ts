import { model, Model, models, Schema } from "mongoose";
import User, { IUser } from "./user";

export interface ISeat {
  seatId: string;
  seatNo: string;
  userId?: string;
  user?: IUser;
  created?: Date;
  updated?: Date;
}

const SeatSchema = new Schema({
  seatId: String,
  seatNo: String,
  userId: String,
  user: Object,
  created: Date,
  updated: Date,
});

const Seat: Model<ISeat> = models.Seat || model("Seat", SeatSchema);

export default Seat;
