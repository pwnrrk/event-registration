import { model, Model, models, Schema } from "mongoose";

export interface IAdmin {
  username?: string;
  password?: string;
  created?: Date;
  updated?: Date;
}

const AdminSchema = new Schema<IAdmin>({
  username: String,
  password: String,
  created: Date,
  updated: Date,
});

const Admin: Model<IAdmin> = models.Admin || model("Admin", AdminSchema);

export default Admin;
