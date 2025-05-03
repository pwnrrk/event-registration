import createHttpError from "http-errors";
import { FindOptions } from "../libs/findOptions";
import Seat, { ISeat } from "../models/seat";
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

export async function getEmptySeats() {
  const seats = await Seat.find({
    userId: null,
  });

  return seats;
}

export async function createSeat(input: ISeat): Promise<ISeat> {
  input.created = new Date();
  input.updated = input.created;
  const newSeat = await Seat.create(input);
  return newSeat;
}

export async function assignUserToSeat(
  userId: string,
  seatId: string
): Promise<ISeat> {
  const seat = await Seat.findById(seatId);
  if (!seat) throw createHttpError(400, { message: "Seat not found" });

  const user = await User.findById(userId);
  if (!user) throw createHttpError(400, { message: "User not found" });

  const oldSeats = await Seat.find({ userId });

  if (oldSeats) {
    for (const oldSeat of oldSeats) {
      oldSeat.set("userId", null);
      oldSeat.set("user", null);
      oldSeat.updated = new Date();
      await oldSeat.save();
    }
  }

  seat.user = user;
  seat.userId = user.id;
  seat.updated = new Date();
  await seat.save();

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
