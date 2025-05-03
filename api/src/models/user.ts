import { model, Model, models, Schema } from "mongoose";

export interface IUser {
  uid: string;
  firstName: string;
  lastName: string;
  phone: string;
  isAdmin?: boolean;
  created?: Date;
  updated?: Date;
}

const UserSchema = new Schema<IUser>({
  uid: String,
  firstName: String,
  lastName: String,
  phone: String,
  isAdmin: Boolean,
  created: Date,
  updated: Date,
});

const User: Model<IUser> = models.User || model("User", UserSchema);

export default User;
