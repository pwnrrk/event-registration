import createHttpError from "http-errors";
import { FindOptions } from "../libs/findOptions";
import User, { IUser } from "../models/user";

export async function getUsers({
  search,
  sort,
  limit,
  skip,
  phone,
}: FindOptions & { phone?: string }) {
  const query: any = {};
  if (search) {
    query.$or = [
      { firstName: { $regex: search, $options: "i" } },
      { lastName: { $regex: search, $options: "i" } },
      { phone: { $regex: search, $options: "i" } },
    ];
  }

  if (phone) query.phone = phone;

  const users = User.find({ ...query }).populate("seat");
  if (sort) users.sort(sort);
  if (limit) users.limit(limit);
  if (skip) users.skip(skip);

  return users;
}

export async function countUsers({
  search,
  phone,
}: FindOptions & { phone?: string }) {
  const query: any = {};
  if (search) {
    query.$or = [
      { firstName: { $regex: search, $options: "i" } },
      { lastName: { $regex: search, $options: "i" } },
      { phone: { $regex: search, $options: "i" } },
    ];
  }

  if (phone) query.phone = phone;
  return User.countDocuments(query);
}

export async function getUserById(id: string) {
  const user = await User.findById(id).populate("seat");
  if (!user) throw createHttpError(404, { message: "User not found" });
  return user;
}

export async function createUser(input: IUser) {
  input.created = new Date();
  input.updated = input.created;
  const newUser = await User.create(input);
  return newUser;
}

export async function deleteUser(id: any) {
  const user = await getUserById(id);
  await user.deleteOne();
  return { message: "User deleted successfully" };
}
