import { model, Model, models, Schema, Types } from "mongoose";
import { IUser } from "./user";

export interface ISeat {
  seatNo: string;
  user?: Types.ObjectId | IUser;
  created?: Date;
  updated?: Date;
}

const SeatSchema = new Schema({
  seatNo: String,
  user: { type: Schema.Types.ObjectId, ref: "User" },
  created: Date,
  updated: Date,
});

const Seat: Model<ISeat> = models.Seat || model("Seat", SeatSchema);

export default Seat;
