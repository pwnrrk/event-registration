import { hash, compare } from "bcryptjs";
import Admin from "../models/admin";
import createHttpError from "http-errors";

export async function addFirstAdmin() {
  const adminCount = await Admin.countDocuments({ username: "admin" });

  if (adminCount !== 0) return;

  const hashed = await hash("admin1234", 6);
  await Admin.insertOne({
    username: "admin",
    password: hashed,
  });
}

export async function checkLogin(username: string, password: string) {
  const admin = await Admin.findOne({ username: username });
  if (!admin) throw createHttpError(404);
  const passwordCorrect = await compare(password, admin.password!);
  if (!passwordCorrect) throw createHttpError(401);
}
