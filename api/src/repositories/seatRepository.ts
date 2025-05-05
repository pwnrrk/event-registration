import createHttpError from "http-errors";
import { FindOptions } from "../libs/findOptions";
import Seat, { ISeat } from "../models/seat";
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
  const seat = await Seat.findById(id);
  if (!seat) throw createHttpError(404, { message: "Seat not found" });
  return seat;
}

export async function getEmptySeats() {
  const seats = await Seat.find({
    user: null,
  });

  return seats;
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
