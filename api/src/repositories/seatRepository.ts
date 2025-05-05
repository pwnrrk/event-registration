import createHttpError from "http-errors";
import { Document } from "mongoose";
import { FindOptions } from "../libs/findOptions";
import Seat, { ISeat } from "../models/seat";
import { IUser } from "../models/user";
import { getUserById } from "./userRepository";

export async function getSeats({ sort, limit, skip }: FindOptions) {
  const query: any = {};

  const seats = Seat.find({ ...query }).populate("user");
  if (sort) seats.sort(sort);
  if (limit) seats.limit(limit);
  if (skip) seats.skip(skip);

  return seats;
}

export async function getSeatById(id: string) {
  const seat = await Seat.findById(id).populate("user");
  if (!seat) throw createHttpError(404, { message: "Seat not found" });
  return seat;
}

export async function createSeat(input: ISeat) {
  input.created = new Date();
  input.updated = input.created;
  const newSeat = await Seat.create(input);
  return newSeat;
}

export async function assignUserToSeat(userId: string, seatId: string) {
  const seat = await getSeatById(seatId);
  const user = await getUserById(userId);

  const oldSeats = await Seat.find({ user: user._id });

  if (oldSeats) {
    for (const oldSeat of oldSeats) {
      oldSeat.set("user", null);
      oldSeat.updated = new Date();
      await oldSeat.save();
    }
  }

  seat.user = user._id;
  seat.updated = new Date();
  await seat.save();

  user.seat = seat._id;
  user.updated = new Date();
  await user.save();

  return seat;
}

export async function removeUserFromSeat(id: string) {
  const seat = await getSeatById(id);

  if (!seat.user) throw createHttpError(400, { message: "Seat is empty" });

  const user = seat.user as Document & IUser;

  seat.set("user", null);
  await seat.save();

  user.set("seat", null);
  await user.save();

  return seat;
}

export async function createDefaultSeats() {
  await Seat.deleteMany();
  const rows = ["A", "B", "C", "D", "E"];
  for (let i = 0; i < rows.length; i++) {
    for (let j = 1; j < 5; j++) {
      createSeat({
        seatNo: `${rows[i]}${j}`,
      });
    }
  }
}

export async function countSeats({ user }: FindOptions) {
  const query: any = {};

  if (user !== undefined) query.user = user;

  return Seat.countDocuments(query);
}
