import { model, Model, models, Schema, Types } from "mongoose";
import { ISeat } from "./seat";

export interface IUser {
  firstName: string;
  lastName: string;
  phone: string;
  seat?: Types.ObjectId | ISeat;
  created?: Date;
  updated?: Date;
}

const UserSchema = new Schema<IUser>({
  firstName: String,
  lastName: String,
  phone: String,
  seat: { type: Schema.Types.ObjectId, ref: "Seat" },
  created: Date,
  updated: Date,
});

const User: Model<IUser> = models.User || model("User", UserSchema);

export default User;
