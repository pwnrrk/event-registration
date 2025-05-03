import { NextFunction, Request, Response } from "express";
import {
  assignUserToSeat,
  createSeat,
  getSeats,
} from "../repositories/seatRepository";
import { ISeat } from "../models/seat";
import { validationResult } from "express-validator";
import { getFindOptions } from "../libs/findOptions";

export async function index(req: Request, res: Response, next: NextFunction) {
  const seats = await getSeats(getFindOptions(req));
  res.json(seats);
}

export async function create(req: Request, res: Response, next: NextFunction) {
  const validated = validationResult(req);
  validated.throw();

  const input: ISeat = req.body;
  const newSeat = await createSeat(input);

  res.status(201).json(newSeat);
}

export async function assignUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { seatId, userId } = req.params;
  const seat = await assignUserToSeat(userId, seatId);

  res.status(200).json(seat);
}
