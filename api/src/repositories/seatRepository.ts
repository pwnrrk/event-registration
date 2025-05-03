import { randomUUID } from "crypto";
import Seat, { ISeat } from "../models/seat";
import { FindOptions } from "../libs/findOptions";
import createHttpError from "http-errors";
import User from "../models/user";

export async function getSeats({
  sort,
  limit,
  skip,
}: FindOptions): Promise<ISeat[]> {
  const query: any = {};

  const seats = Seat.find({ ...query });
  if (sort) seats.sort(sort);
  if (limit) seats.limit(limit);
  if (skip) seats.skip(skip);

  return seats;
}

export async function createSeat(input: ISeat): Promise<ISeat> {
  input.seatId = randomUUID();
  input.created = new Date();
  input.updated = input.created;
  const newSeat = await Seat.create(input);
  return newSeat;
}

export async function assignUserToSeat(
  uid: string,
  seatId: string
): Promise<ISeat> {
  const seat = await Seat.findOne({ seatId: seatId });
  if (!seat) throw createHttpError(400, { message: "Seat not found" });

  const user = await User.findOne({ uid });
  if (!user) throw createHttpError(400, { message: "User not found" });

  const oldSeats = await Seat.find({ userId: uid });

  if (oldSeats) {
    for (const oldSeat of oldSeats) {
      oldSeat.set("userId", null);
      oldSeat.set("user", null);
      oldSeat.updated = new Date();
      await oldSeat.save();
    }
  }

  seat.user = user;
  seat.userId = user.uid;
  seat.updated = new Date();
  await seat.save();

  return seat;
}
