import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { getFindOptions } from "../libs/findOptions";
import { IUser } from "../models/user";
import {
  createUser,
  deleteUser,
  getUserById,
  getUsers,
} from "../repositories/userRepository";
import createHttpError from "http-errors";

export async function index(req: Request, res: Response) {
  const phone = req.query.phone;

  const users = await getUsers({
    ...getFindOptions(req),
    phone: phone ? (phone as string) : undefined,
  });

  res.json(users);
}

export async function create(req: Request, res: Response) {
  const validated = validationResult(req);
  if (!validated.isEmpty())
    throw createHttpError(400, { errors: validated.array() });

  const input: IUser = req.body;
  const newUser = await createUser(input);

  res.status(201).json(newUser);
}

export async function find(req: Request, res: Response) {
  const user = await getUserById(req.params.id);
  res.json(user);
}

export async function destroy(req: Request, res: Response) {
  const result = await deleteUser(req.params.id);
  res.json(result);
}
