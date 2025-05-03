import { randomUUID } from "crypto";
import User, { IUser } from "../models/user";
import { FindOptions } from "../libs/findOptions";

export async function getUsers({
  search,
  sort,
  limit,
  skip,
}: FindOptions): Promise<IUser[]> {
  const query: any = {};
  if (search) {
    query.$or = [
      { firstName: { $regex: search, $options: "i" } },
      { lastName: { $regex: search, $options: "i" } },
      { phone: { $regex: search, $options: "i" } },
    ];
  }

  const users = User.find({ ...query });
  if (sort) users.sort(sort);
  if (limit) users.limit(limit);
  if (skip) users.skip(skip);

  return users;
}

export async function createUser(input: IUser): Promise<IUser> {
  input.uid = randomUUID();
  input.created = new Date();
  input.updated = input.created;
  const newUser = await User.create(input);
  return newUser;
}
