import createHttpError from "http-errors";
import { FindOptions } from "../libs/findOptions";
import User, { IUser } from "../models/user";

export async function getUsers({
  search,
  sort,
  limit,
  skip,
  phone,
}: FindOptions & { phone?: string }): Promise<IUser[]> {
  const query: any = {};
  if (search) {
    query.$or = [
      { firstName: { $regex: search, $options: "i" } },
      { lastName: { $regex: search, $options: "i" } },
      { phone: { $regex: search, $options: "i" } },
    ];
  }

  if (phone) query.phone = phone;

  const users = User.find({ ...query });
  if (sort) users.sort(sort);
  if (limit) users.limit(limit);
  if (skip) users.skip(skip);

  return users;
}

export async function getUserById(id: string) {
  const user = await User.findById(id);
  if (!user) throw createHttpError(404);
  return user;
}

export async function createUser(input: IUser): Promise<IUser> {
  input.created = new Date();
  input.updated = input.created;
  const newUser = await User.create(input);
  return newUser;
}
