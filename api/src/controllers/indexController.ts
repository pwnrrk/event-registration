import { Request, Response } from "express";
import { countSeats } from "../repositories/seatRepository";
import { countUsers } from "../repositories/userRepository";

export async function getInformation(req: Request, res: Response) {
  const totalUser = await countUsers({});
  const totalSeats = await countSeats({});
  const emptySeats = await countSeats({ user: null });

  res.json({
    name: "event-registration",
    version: "0.0.1",
    totalSeat: totalSeats,
    available: emptySeats,
    totalUser: totalUser,
  });
}
